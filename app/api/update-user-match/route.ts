import 'server-only';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Interface pour les données de la requête
interface UpdateMatchRequest {
  userEmail: string;
  groupName: string; // Correspond à currentGroup.name
}

// Interface pour la structure de la clé de compte de service
interface ServiceAccountKey {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain?: string;
}

const keyFilePath = path.resolve('../noted-handler-461816-q2-9331c5aed3ee.json');
let serviceAccountKey: ServiceAccountKey | undefined;

try {
  const keyFileContent = fs.readFileSync(keyFilePath, 'utf8');
  serviceAccountKey = JSON.parse(keyFileContent) as ServiceAccountKey;
} catch (e: unknown) {
  console.error(`[UPDATE-MATCH API] Failed to load service account key from ${keyFilePath}.`, e);
  // Gérer l'erreur de chargement de clé si nécessaire, ici on laisse serviceAccountKey undefined
}

const SPREADSHEET_ID = '12zm9lYzcqT45_XTfchv415Q3CxLEha-hM8FOw8-b8rk';
const SHEET_NAME = 'Compte';
const EMAIL_COLUMN = 'B'; // Colonne contenant les emails des utilisateurs
const MATCHCOMPTE_COLUMN = 'I'; // Colonne à mettre à jour

export async function POST(request: Request) {
  console.log('[UPDATE-MATCH API] Received POST request.');

  if (!serviceAccountKey || !serviceAccountKey.client_email || !serviceAccountKey.private_key) {
    console.error('[UPDATE-MATCH API] Service account key not loaded or invalid.');
    return NextResponse.json({ error: 'Service account key not loaded or invalid.' }, { status: 500 });
  }

  const { client_email, private_key } = serviceAccountKey;

  try {
    const data: UpdateMatchRequest = await request.json();
    const { userEmail, groupName } = data;

    if (!userEmail || !groupName) {
      console.error('[UPDATE-MATCH API] Missing userEmail or groupName in request body.');
      return NextResponse.json({ error: 'Missing userEmail or groupName' }, { status: 400 });
    }
    console.log(`[UPDATE-MATCH API] Request data: userEmail=${userEmail}, groupName=${groupName}`);

    const auth = new google.auth.JWT({
      email: client_email,
      key: private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 1. Lire les données pour trouver le numéro de ligne basé sur l'email
    // On lit une plage A1 jusqu'à la colonne MATCHCOMPTE_COLUMN et une limite de ligne (ex: 1000)
    const MAX_ROWS_TO_READ = 1000; // Ajustez si nécessaire
    const readRange = `${SHEET_NAME}!A1:${MATCHCOMPTE_COLUMN}${MAX_ROWS_TO_READ}`;
    console.log(`[UPDATE-MATCH API] Reading data from range ${readRange} in sheet ${SHEET_NAME} to find email.`);
    
    const getDataResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: readRange,
    });

    const rows = getDataResponse.data.values;
    let rowIndex = -1;

    if (rows) {
      for (let i = 0; i < rows.length; i++) {
        // Supposer que l'email est dans la deuxième colonne (index 1) de la plage lue (A=0, B=1, etc.)
        // Ceci suppose que EMAIL_COLUMN ('B') correspond à l'index 1 si readRange commence à 'A'
        const emailCellIndex = EMAIL_COLUMN.charCodeAt(0) - 'A'.charCodeAt(0); // B -> 1, C -> 2 etc.
        if (rows[i][emailCellIndex] === userEmail) {
          rowIndex = i + 1; // Les lignes de Google Sheets sont 1-indexed
          break;
        }
      }
    }

    if (rowIndex === -1) {
      console.error(`[UPDATE-MATCH API] User email ${userEmail} not found in column ${EMAIL_COLUMN}.`);
      return NextResponse.json({ error: `User email ${userEmail} not found.` }, { status: 404 });
    }
    console.log(`[UPDATE-MATCH API] Found user email ${userEmail} at row ${rowIndex}.`);

    // 2. Mettre à jour la cellule "matchcompte" pour cette ligne
    const updateRange = `${SHEET_NAME}!${MATCHCOMPTE_COLUMN}${rowIndex}`;
    console.log(`[UPDATE-MATCH API] Preparing to update matchcompte at range: ${updateRange} with value: ${groupName}`);

    const updateResponse = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: updateRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[groupName]],
      },
    });

    console.log('[UPDATE-MATCH API] Matchcompte column updated successfully. Response data:', JSON.stringify(updateResponse.data, null, 2));
    return NextResponse.json({ success: true, data: updateResponse.data });

  } catch (error: unknown) {
    console.error('[UPDATE-MATCH API] Error in POST handler:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: 'Failed to update match information', details: errorMessage }, { status: 500 });
  }
} 
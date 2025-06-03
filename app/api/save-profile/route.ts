import 'server-only';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import fs from 'fs'; // Restored
import path from 'path'; // Restored

// Define an interface for the service account key structure
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
  universe_domain?: string; // Optional, as it might not be in all service account keys
}

// Adjusted path to go one level up from 'velc' to the project root
const keyFilePath = path.resolve('../noted-handler-461816-q2-9331c5aed3ee.json');
console.log('[SAVE-PROFILE API] Resolved keyFilePath:', keyFilePath);

let serviceAccountKey: ServiceAccountKey | undefined;

try {
  console.log('[SAVE-PROFILE API] Attempting to read service account key from:', keyFilePath);
  const keyFileContent = fs.readFileSync(keyFilePath, 'utf8');
  serviceAccountKey = JSON.parse(keyFileContent) as ServiceAccountKey;
  console.log('[SAVE-PROFILE API] Service account key loaded successfully. Client Email:', serviceAccountKey.client_email);
} catch (e: unknown) {
  console.error(`[SAVE-PROFILE API] Failed to load or parse service account key from ${keyFilePath}. Ensure the file exists and is valid JSON.`, e);
  if (e instanceof Error) {
    console.error('[SAVE-PROFILE API] Error message:', e.message);
    console.error('[SAVE-PROFILE API] Error stack:', e.stack);
  }
  // serviceAccountKey will remain undefined, and the POST handler will return an error
}

const SPREADSHEET_ID = '12zm9lYzcqT45_XTfchv415Q3CxLEha-hM8FOw8-b8rk';
const SHEET_NAME = 'Compte1';
const RANGE_TO_APPEND = 'Compte!A1';


console.log('[SAVE-PROFILE API] SPREADSHEET_ID:', SPREADSHEET_ID);
console.log('[SAVE-PROFILE API] SHEET_NAME:', SHEET_NAME);
console.log('[SAVE-PROFILE API] RANGE_TO_APPEND:', RANGE_TO_APPEND);

interface ProfileData {
  email: string;
  name: string;
  role: string;
  officeDays: string[];
  interests: string[];
  activities: string[];
  bio: string;
  // photo is not part of the sheet data for now
}

export async function POST(request: Request) {
  console.log('[SAVE-PROFILE API] Received POST request.');

  if (!serviceAccountKey || !serviceAccountKey.client_email || !serviceAccountKey.private_key) {
    console.error('[SAVE-PROFILE API] Service account key not loaded or invalid. Check server logs. Service Account Key:', serviceAccountKey);
    return NextResponse.json({ error: 'Service account key not loaded or invalid. Check server logs.' }, { status: 500 });
  }
  console.log('[SAVE-PROFILE API] Service account key seems valid.');

  const { client_email, private_key } = serviceAccountKey;
  console.log('[SAVE-PROFILE API] Using Client Email for JWT:', client_email);
  // Avoid logging the private key directly for security, but confirm its presence
  console.log('[SAVE-PROFILE API] Private key is present:', !!private_key);


  try {
    console.log('[SAVE-PROFILE API] Attempting to parse request JSON...');
    const data: ProfileData = await request.json();
    console.log('[SAVE-PROFILE API] Successfully parsed request JSON. Data:', JSON.stringify(data, null, 2));

    console.log('[SAVE-PROFILE API] Creating JWT auth object...');
    const auth = new google.auth.JWT({
      email: client_email,
      key: private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    console.log('[SAVE-PROFILE API] JWT auth object created.');

    console.log('[SAVE-PROFILE API] Initializing Google Sheets API client...');
    const sheets = google.sheets({ version: 'v4', auth });
    console.log('[SAVE-PROFILE API] Google Sheets API client initialized.');

    const rowValues = [
      new Date().toISOString(), // Timestamp
      data.email,
      data.name,
      data.role,
      data.officeDays.join(', '),
      data.interests.join(', '),
      data.activities.join(', '),
      data.bio,
    ];
    console.log('[SAVE-PROFILE API] Prepared rowValues:', JSON.stringify(rowValues, null, 2));

    const appendRequest = {
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE_TO_APPEND,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS', // This will insert a new row
      resource: {
        values: [rowValues],
      },
    };
    console.log('[SAVE-PROFILE API] Prepared appendRequest:', JSON.stringify(appendRequest, null, 2));

    console.log('[SAVE-PROFILE API] Attempting to append data to Google Sheet...');
    const response = await sheets.spreadsheets.values.append(appendRequest);
    console.log('[SAVE-PROFILE API] Profile data saved successfully to Google Sheet. Response data:', JSON.stringify(response.data, null, 2));
    return NextResponse.json({ success: true, data: response.data });

  } catch (error: unknown) {
    console.error('[SAVE-PROFILE API] Error in POST handler /api/save-profile:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      console.error('[SAVE-PROFILE API] Error message:', error.message);
      errorMessage = error.message;
      if (error.stack) {
        console.error('[SAVE-PROFILE API] Error stack:', error.stack);
      }
    }
    // Attempt to log Google API specific errors if present
    if (typeof error === 'object' && error !== null && 'errors' in error) {
        // Using unknown[] for the errors array items to satisfy linter
        const googleApiError = error as { errors: unknown[] }; 
        console.error('[SAVE-PROFILE API] Google API errors:', JSON.stringify(googleApiError.errors, null, 2));
    }
    try {
        console.error('[SAVE-PROFILE API] Full error object (stringified):', JSON.stringify(error, null, 2));
    } catch (stringifyError: unknown) {
        console.error('[SAVE-PROFILE API] Could not stringify the full error object. Stringify error:', stringifyError);
    }
    return NextResponse.json({ error: 'Failed to save profile to sheet', details: errorMessage }, { status: 500 });
  }
} 
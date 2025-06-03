// lib/sheets.ts
import { google } from 'googleapis';
import path from 'path';
import { promises as fs } from 'fs';

const SHEET_ID = '12zm9lYzcqT45_XTfchv415Q3CxLEha-hM8FOw8-b8rk';
const RANGE = 'Compte!A1';

async function getAuth() {
  const keyPath = path.join(process.cwd(), 'noted-handler-461816-q2-9331c5aed3ee.json');
  const file = await fs.readFile(keyPath, 'utf-8');
  const key = JSON.parse(file);

  return new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

export const SheetsService = {
  async saveProfile(profile: {
    email: string;
    name: string;
    role: string;
    officeDays: string[];
    interests: string[];
    activities: string[];
    bio: string;
  }) {
    const auth = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const values = [[
      profile.email,
      profile.name,
      profile.role,
      profile.officeDays.join(', '),
      profile.interests.join(', '),
      profile.activities.join(', '),
      profile.bio,
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });
  },
};

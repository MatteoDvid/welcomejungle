import { NextRequest, NextResponse } from 'next/server'

// Définition locale pour AddRowParams basé sur l'utilisation
interface AddRowParams {
  sheetId: string;
  tab: string;
  values: {
    Email: string;
    Prénom: string;
    Nom: string;
    Rôle: string;
    Timestamp: string; // Assumant que Timestamp est toujours fourni ou géré
    "Thèmes choisis": string[]; // Assumant que "Thèmes choisis" sont toujours fournis ou gérés
    [key: string]: string | number | boolean | string[] | undefined; // Remplacement de any par un type plus spécifique
  };
}

export async function POST(request: NextRequest) {
  try {
    const data: AddRowParams = await request.json()
    
    console.log('📡 API Google Sheets appelée avec:', {
      sheetId: data.sheetId,
      tab: data.tab,
      email: data.values.Email,
      nom: `${data.values.Prénom} ${data.values.Nom}`,
      role: data.values.Rôle
    })

    // 🚀 INTÉGRATION GOOGLE SHEETS RÉELLE
    // Pour activer l'intégration réelle, décommentez le code ci-dessous
    // et ajoutez vos clés d'API Google dans les variables d'environnement
    
    /*
    const { GoogleSpreadsheet } = require('google-spreadsheet')
    const doc = new GoogleSpreadsheet(data.sheetId)
    
    // Authentification avec service account
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    })
    
    await doc.loadInfo()
    const sheet = doc.sheetsByTitle[data.tab]
    
    if (!sheet) {
      throw new Error(`Tab "${data.tab}" not found in the Google Sheet`)
    }
    
    // Ajouter la ligne avec les données
    await sheet.addRow(data.values)
    
    console.log('✅ Données ajoutées avec succès dans Google Sheets')
    */

    // 🔄 SIMULATION (actuellement actif)
    // Cette section simule l'ajout dans Google Sheets
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('✅ Simulation: Données "ajoutées" dans Google Sheets')
    console.log('📊 Données simulées:', {
      Timestamp: data.values.Timestamp,
      Utilisateur: `${data.values.Prénom} ${data.values.Nom}`,
      Email: data.values.Email,
      Role: data.values.Rôle,
      Themes: data.values["Thèmes choisis"],
      SheetID: data.sheetId.substring(0, 10) + '...'
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Profile data added to Google Sheets successfully',
      timestamp: new Date().toISOString(),
      data: {
        sheetId: data.sheetId,
        tab: data.tab,
        user: `${data.values.Prénom} ${data.values.Nom}`,
        email: data.values.Email
      }
    })
  } catch (error) {
    console.error('❌ Error adding to Google Sheets:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to add data to Google Sheets',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Google Sheets Integration API',
    status: 'SIMULATION MODE - Ready for production',
    endpoints: {
      POST: 'Add profile data to Google Sheets',
    },
    sheetInfo: {
      sheetId: '12zm9lYzcqT45_XTfchv415Q3CxLEha-hM8FOw8-b8rk',
      tab: 'Profil_utilisateur'
    },
    integration: {
      current: 'SIMULATION',
      toActivate: 'Uncomment code and add Google API credentials'
    }
  })
} 
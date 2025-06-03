# 📊 Configuration Google Sheets Integration

## 🎯 Vue d'ensemble

L'application est configurée pour envoyer automatiquement les données des profils utilisateurs vers votre Google Sheet :
- **Sheet ID :** `12zm9lYzcqT45_XTfchv415Q3CxLEha-hM8FOw8-b8rk`
- **Tab :** `Profil_utilisateur`

## 🔧 Configuration Actuelle

**Status :** 🟡 MODE SIMULATION 
- Les données sont traitées et formatées correctement
- Les appels API fonctionnent 
- L'intégration réelle Google Sheets est prête à être activée

## 🚀 Activation de l'Intégration Réelle

### Étape 1: Installer la dépendance Google Sheets

```bash
npm install google-spreadsheet
```

### Étape 2: Créer un Service Account Google

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer ou sélectionner un projet
3. Activer l'API Google Sheets
4. Créer un Service Account
5. Télécharger la clé JSON

### Étape 3: Partager le Google Sheet

Partager votre Google Sheet avec l'email du Service Account (lecture + écriture)

### Étape 4: Configurer les Variables d'Environnement

Créer un fichier `.env.local` :

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=votre-service-account@projet.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVOTRE_CLE_PRIVEE\n-----END PRIVATE KEY-----\n"
```

### Étape 5: Activer l'Intégration

Dans `app/api/google-sheets/route.ts`, décommenter la section :

```typescript
// 🚀 INTÉGRATION GOOGLE SHEETS RÉELLE
const { GoogleSpreadsheet } = require('google-spreadsheet')
const doc = new GoogleSpreadsheet(data.sheetId)

await doc.useServiceAccountAuth({
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
})

await doc.loadInfo()
const sheet = doc.sheetsByTitle[data.tab]
await sheet.addRow(data.values)
```

## 📋 Structure des Données Envoyées

Chaque profil créé enverra ces colonnes :

| Colonne | Exemple | Description |
|---------|---------|-------------|
| Timestamp | 2024-01-15T10:30:45.123Z | Date/heure de création |
| Prénom | John | Prénom utilisateur |
| Nom | Doe | Nom utilisateur |
| Email | john.doe@company.com | Email professionnel |
| Rôle | employee | employee/manager/hr/office_manager |
| Langue | en | en/fr |
| Thèmes choisis | Technology, Coffee, Travel | Liste comma-separated |
| Bio | "Passionate employee with..." | Bio générée ou personnalisée |
| Avatar URL | https://api.dicebear.com/... | URL de l'avatar généré |
| Groupe ID | (vide) | À remplir plus tard |
| Slack ID | (vide) | À remplir plus tard |
| Présence actuelle | Non renseigné | Status par défaut |

## 🔍 Test de l'Intégration

### Mode Simulation (Actuel)
- Créer un profil dans l'app
- Vérifier les logs dans la console du navigateur
- Les données sont formatées et "envoyées"

### Mode Production 
- Après activation, les données apparaîtront dans votre Google Sheet
- Vérifier les logs serveur pour confirmation

## 🐛 Dépannage

### Erreurs Communes

1. **"Sheet not found"**
   - Vérifier que le tab "Profil_utilisateur" existe
   - Vérifier l'ID du Google Sheet

2. **"Permission denied"**
   - Partager le Sheet avec le Service Account
   - Vérifier les droits d'écriture

3. **"Invalid credentials"**
   - Vérifier les variables d'environnement
   - Régénérer la clé Service Account

## 📞 Support

L'intégration est prête à être activée. Toute la logique de formatage et d'envoi des données est fonctionnelle.

Quand vous aurez configuré l'authentification Google, il suffira de décommenter le code et l'intégration sera active ! 
# 🚀 Configuration Intégration Complète - Office Pulse Match

## Vue d'ensemble de l'intégration

Cette intégration permet de :
- ✅ **Authentification OAuth 2.0** avec Google Calendar
- ✅ **Synchronisation bidirectionnelle** calendrier personnel + calendrier partagé d'entreprise  
- ✅ **Google Sheets** pour tracker les présences
- ✅ **Notifications Slack** automatiques via Make/Zapier
- ✅ **Interface multilingue** (FR/EN) avec adaptation du calendrier
- ✅ **Filtres par groupes** et vue jour/semaine

## 🔧 1. Configuration Google Cloud Console

### Étape 1: Créer le projet
1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet : `Office-Pulse-Match`
3. Activer les APIs requises :
   - **Google Calendar API**
   - **Google Sheets API**

### Étape 2: Configurer OAuth 2.0
1. **Identifiants** → **Créer des identifiants** → **ID client OAuth 2.0**
2. Type d'application : **Application Web**
3. Nom : `Office Pulse Match Calendar`
4. **Origines JavaScript autorisées** :
   ```
   http://localhost:3000
   http://localhost:3001
   http://localhost:3002
   https://votre-domaine.com
   ```
5. **URI de redirection autorisés** :
   ```
   http://localhost:3000
   https://votre-domaine.com
   ```

### Étape 3: Récupérer les clés
- **API Key** : Identifiants → Créer une clé API
- **Client ID** : Copier l'ID client OAuth créé

## 📊 2. Configuration Google Sheets

### Créer le fichier de suivi des présences
1. Créer un nouveau Google Sheets : **"Office Pulse - Présences"**
2. Créer une feuille nommée **"Présences"**
3. En-têtes en ligne 1 :
   ```
   A1: Timestamp
   B1: UserId  
   C1: UserName
   D1: UserEmail
   E1: Date
   F1: Status
   G1: Location
   H1: Groups
   I1: Notes
   J1: Source
   ```
4. Partager avec le compte de service ou rendre accessible en lecture/écriture
5. Récupérer l'**ID du fichier** depuis l'URL

## 📅 3. Configuration Calendrier Partagé

### Créer le calendrier d'entreprise
1. Google Calendar → **Créer un calendrier**
2. Nom : **"Office Pulse - Équipe"**
3. Description : **"Présences et activités de l'équipe"**
4. Partager avec tous les employés (**Écrire**)
5. Récupérer l'**ID du calendrier** : Paramètres → ID du calendrier

## 🔔 4. Configuration Notifications Slack

### Option A: Avec Make (recommandé)
1. Créer un compte [Make.com](https://make.com)
2. Créer un nouveau scénario :
   - **Trigger** : Webhook
   - **Action** : Slack → Envoyer un message
3. Configurer le webhook et récupérer l'URL
4. Template de message Slack :
   ```json
   {
     "text": "{{statusEmoji}} {{userName}} est {{statusText}} le {{date}} !",
     "channel": "#office-presence",
     "username": "Office Pulse Bot",
     "icon_emoji": ":office:"
   }
   ```

### Option B: Webhook direct Slack
1. Créer une **Slack App** sur api.slack.com
2. Activer **Incoming Webhooks**
3. Récupérer l'URL du webhook

## ⚙️ 5. Variables d'environnement

Créer un fichier `.env.local` :
```env
# Google Calendar & Sheets
NEXT_PUBLIC_GOOGLE_API_KEY=AIzaSy...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
NEXT_PUBLIC_COMPANY_CALENDAR_ID=abc123@group.calendar.google.com
NEXT_PUBLIC_GOOGLE_SHEETS_ID=1AbCdEfGhIjKlMnOpQrStUvWxYz

# Notifications Slack/Make
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.eu2.make.com/xyz123

# Configuration optionnelle
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🏃‍♂️ 6. Test de l'intégration

### Vérifications étape par étape :

1. **Authentification Google** ✅
   ```javascript
   // Vérifier dans la console du navigateur
   console.log('Google Auth:', GoogleCalendar.isSignedIn())
   ```

2. **Lecture calendrier principal** ✅
   ```
   GET https://www.googleapis.com/calendar/v3/calendars/primary/events
   ```

3. **Écriture calendrier partagé** ✅
   ```
   POST https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events
   ```

4. **Synchronisation Google Sheets** ✅
   ```
   POST https://sheets.googleapis.com/v4/spreadsheets/{sheetId}/values/Présences!A:J:append
   ```

5. **Notification Slack** ✅
   ```
   POST {MAKE_WEBHOOK_URL}
   ```

## 🔐 7. Sécurité et permissions

### Scopes OAuth requis :
```
https://www.googleapis.com/auth/calendar
https://www.googleapis.com/auth/calendar.events  
https://www.googleapis.com/auth/spreadsheets
```

### Données accessibles :
- ✅ Calendrier principal de l'utilisateur (lecture)
- ✅ Calendrier partagé d'entreprise (lecture/écriture)
- ✅ Google Sheets de présences (lecture/écriture)
- ❌ **Pas d'accès** aux autres calendriers privés

## 📱 8. Fonctionnalités de l'interface

### Vue Semaine
- **Grille 7 jours** avec événements positionnés visuellement
- **Filtres par groupes** : Coffee Club, Fitness Squad, UX Team, etc.
- **Présences en temps réel** depuis Google Sheets
- **Événements Google Calendar** intégrés automatiquement

### Vue Jour  
- **Planning détaillé** heure par heure
- **Informations complètes** des événements (lieu, participants)
- **Mise à jour présence** en un clic

### Gestion des présences
- **3 statuts** : Présent, Télétravail, Absent
- **Création automatique** d'événements dans le calendrier partagé
- **Synchronisation Google Sheets** en temps réel
- **Notifications Slack** automatiques

### Système multilingue
- **Français/Anglais** : Interface complète
- **Adaptation calendrier** : Jours de la semaine, formats de date
- **Sélecteur de langue** dans l'en-tête

## 🚀 9. Déploiement Production

### Variables d'environnement production :
```env
NEXT_PUBLIC_GOOGLE_API_KEY=prod_api_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=prod_client_id.apps.googleusercontent.com
NEXT_PUBLIC_COMPANY_CALENDAR_ID=company@yourdomain.com
NEXT_PUBLIC_GOOGLE_SHEETS_ID=prod_sheets_id
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.eu2.make.com/prod_webhook
```

### Vérifications post-déploiement :
1. ✅ OAuth Google fonctionne en HTTPS
2. ✅ Événements créés dans le bon calendrier
3. ✅ Google Sheets mis à jour automatiquement  
4. ✅ Notifications Slack reçues
5. ✅ Interface multilingue fonctionnelle

## 📞 Support et dépannage

### Problèmes courants :

**❌ Erreur OAuth "origin_mismatch"**
- Vérifier les origines autorisées dans Google Cloud Console

**❌ Calendrier partagé inaccessible**
- Vérifier les permissions de partage du calendrier

**❌ Google Sheets non synchronisé**
- Vérifier l'ID du fichier et les permissions

**❌ Notifications Slack non reçues**
- Tester le webhook Make manuellement
- Vérifier les permissions du bot Slack

### Logs de debugging :
```javascript
// Activer les logs détaillés
localStorage.setItem('debug-calendar', 'true')

// Vérifier le statut de connexion
console.log('Auth Status:', GoogleCalendar.isSignedIn())
console.log('User Profile:', GoogleCalendar.getUserProfile())
```

---

## 🎯 Résultat final

Vous obtenez une **application complète de gestion des présences** avec :
- **Interface Google Calendar professionnelle**
- **Synchronisation en temps réel** avec Google Calendar et Sheets
- **Notifications Slack automatiques**
- **Système multilingue FR/EN**
- **Filtres avancés par groupes**
- **Vue jour et semaine**

L'équipe peut maintenant gérer facilement leurs présences, voir qui est au bureau, et être notifiée automatiquement via Slack ! 🚀 
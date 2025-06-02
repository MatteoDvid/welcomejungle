# 📅 Configuration Google Calendar - Office Pulse Match

## Vue d'ensemble
L'intégration Google Calendar permet de synchroniser automatiquement :
- ✅ **Présences des employés** dans un calendrier partagé
- ✅ **Événements de groupe** (Coffee Club, Fitness, etc.)
- ✅ **Réunions d'équipe** et activités communes
- ✅ **Synchronisation bidirectionnelle** entre l'app et Google Calendar

## 🚀 Mode Démo (Actuel)
L'application fonctionne actuellement en **mode démo** avec des données simulées :
- Événements de démonstration pré-remplis
- Simulation de la connexion Google
- Toutes les fonctionnalités testables sans configuration

## 🔧 Configuration pour Production

### Étape 1: Google Cloud Console
1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet : `Office-Pulse-Match`
3. Activer l'API Google Calendar :
   - Bibliothèque → Rechercher "Google Calendar API" → Activer

### Étape 2: Créer les identifiants OAuth
1. Identifiants → Créer des identifiants → ID client OAuth 2.0
2. Type d'application : **Application Web**
3. Nom : `Office Pulse Match`
4. Origines JavaScript autorisées :
   ```
   http://localhost:3000
   https://votre-domaine.com
   ```
5. URI de redirection autorisés :
   ```
   http://localhost:3000
   https://votre-domaine.com
   ```

### Étape 3: Variables d'environnement
Créer un fichier `.env.local` :
```env
NEXT_PUBLIC_GOOGLE_API_KEY=votre_api_key_ici
NEXT_PUBLIC_GOOGLE_CLIENT_ID=votre_client_id_ici.apps.googleusercontent.com
NEXT_PUBLIC_COMPANY_CALENDAR_ID=office-pulse-shared@votre-entreprise.com
```

### Étape 4: Calendrier partagé d'entreprise
1. Créer un nouveau calendrier Google : **"Office Pulse - Équipe"**
2. Partager avec tous les employés (lecture/écriture)
3. Récupérer l'ID du calendrier dans les paramètres
4. Mettre à jour `NEXT_PUBLIC_COMPANY_CALENDAR_ID`

## 📋 Fonctionnalités disponibles

### 🏢 Gestion des présences
- **Déclaration présence** → Événement automatique dans le calendrier
- **Vue d'ensemble équipe** → Qui est au bureau aujourd'hui
- **Notifications** → Rappels automatiques

### 👥 Événements de groupe
- **Coffee Culture Club** → Réunions automatiques dans le calendrier
- **Fitness Friday** → Sessions sport partagées
- **Lunch & Learn** → Déjeuners d'équipe

### 🔄 Synchronisation
- **Temps réel** → Mise à jour immédiate
- **Bidirectionnelle** → App ↔ Google Calendar
- **Notifications** → Slack + Email

## 🧪 Test des fonctionnalités

### En mode démo (actuel) :
1. Aller dans **Calendrier**
2. Cliquer sur **"Connect Google Calendar"**
3. Tester les boutons :
   - ✅ **"Ajouter présence aujourd'hui"**
   - ✅ **"Créer événement de groupe"**
4. Observer la synchronisation simulée

### Avec vraie intégration :
- Même interface, mais avec vrais événements Google Calendar
- Synchronisation réelle avec le calendrier d'entreprise
- Notifications et invitations automatiques

## 🔒 Sécurité et permissions

### Permissions OAuth requises :
```
https://www.googleapis.com/auth/calendar
https://www.googleapis.com/auth/calendar.events
```

### Données accessibles :
- ✅ Lecture des événements du calendrier partagé
- ✅ Création d'événements (présences, activités)
- ✅ Modification des événements créés par l'app
- ❌ Pas d'accès aux calendriers personnels

## 🚀 Déploiement

### Variables d'environnement production :
```env
NEXT_PUBLIC_GOOGLE_API_KEY=prod_api_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=prod_client_id.apps.googleusercontent.com
NEXT_PUBLIC_COMPANY_CALENDAR_ID=entreprise@company.com
```

### Vérification post-déploiement :
1. ✅ Connexion Google fonctionne
2. ✅ Événements se créent dans le bon calendrier
3. ✅ Synchronisation temps réel active
4. ✅ Notifications Slack intégrées

## 📞 Support
- 🐛 **Bugs** → Vérifier les logs console du navigateur
- 🔑 **Permissions** → Vérifier les scopes OAuth
- 🔄 **Sync** → Bouton "Refresh" dans l'interface
- 📧 **Contact** → Équipe IT pour support technique 
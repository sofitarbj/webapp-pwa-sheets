# Sheets Manager - WebApp PWA

Application PWA mobile-first pour gérer vos Google Sheets avec authentification Google OAuth via Supabase.

## 🚀 Fonctionnalités

- ✅ Authentification Google OAuth (via Supabase)
- ✅ Liste de tous vos Google Sheets
- ✅ Affichage dynamique des données
- ✅ Parsing intelligent des colonnes
- ✅ Recherche et filtres avancés
- ✅ Intégration WhatsApp, Appel, Email
- ✅ PWA installable (Android/iOS)
- ✅ Mode offline partiel
- ✅ Interface 100% en français

## 📋 Prérequis

1. **Node.js** (version 18 ou supérieure)
2. **Compte Supabase** avec un projet créé
3. **Projet Google Cloud** avec :
   - Google Sheets API activée
   - Google Drive API activée
   - OAuth 2.0 configuré

## 🔧 Installation

### 1. Cloner et installer les dépendances

```bash
cd webapp-pwa-sheets
npm install
```

### 2. Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_ici

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=votre_client_id.apps.googleusercontent.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Configuration Supabase

Dans votre projet Supabase :

1. Allez dans **Authentication** → **Providers**
2. Activez **Google**
3. Ajoutez votre **Client ID** et **Client Secret** Google
4. Dans **Additional Scopes**, ajoutez :
   ```
   https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets.readonly
   ```
5. Ajoutez l'URL de callback autorisée :
   ```
   http://localhost:3000/auth/callback
   https://votre-domaine.vercel.app/auth/callback
   ```

### 4. Configuration Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez ou sélectionnez un projet
3. Activez les APIs :
   - Google Sheets API
   - Google Drive API
4. Créez des identifiants OAuth 2.0 :
   - Type : Application Web
   - Origines autorisées : `http://localhost:3000`, `https://votre-domaine.vercel.app`
   - URI de redirection : Utilisez l'URL fournie par Supabase

## 🏃 Lancement en développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📦 Build de production

```bash
npm run build
npm run start
```

## 🌐 Déploiement sur Vercel

### Option 1 : Via l'interface Vercel

1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement dans Vercel :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - `NEXT_PUBLIC_APP_URL` (votre URL Vercel)
3. Déployez !

### Option 2 : Via CLI

```bash
npm install -g vercel
vercel
```

Suivez les instructions et configurez les variables d'environnement.

## 📱 Installation PWA

### Sur Android
1. Ouvrez l'application dans Chrome
2. Appuyez sur le menu (⋮)
3. Sélectionnez "Ajouter à l'écran d'accueil"

### Sur iOS
1. Ouvrez l'application dans Safari
2. Appuyez sur le bouton Partager
3. Sélectionnez "Sur l'écran d'accueil"

## 🏗️ Structure du projet

```
webapp-pwa-sheets/
├── app/                      # Pages Next.js
│   ├── page.tsx             # Splash screen
│   ├── login/               # Page de connexion
│   ├── sheets/              # Liste des sheets
│   │   └── [id]/           # Détail d'un sheet
│   └── auth/callback/       # Callback OAuth
├── components/              # Composants réutilisables
│   ├── Header.tsx
│   ├── SheetCard.tsx
│   ├── DataCard.tsx
│   ├── SearchBar.tsx
│   └── Loader.tsx
├── lib/                     # Utilitaires
│   ├── supabase.ts         # Client Supabase
│   ├── googleApi.ts        # Google APIs
│   ├── sheetParser.ts      # Parser de données
│   └── whatsappHelper.ts   # Helper WhatsApp
└── public/                  # Assets statiques
    ├── manifest.json        # Manifest PWA
    ├── sw.js               # Service Worker
    └── icons/              # Icônes PWA
```

## 🎨 Personnalisation

Les couleurs de la marque sont définies dans `tailwind.config.ts` :

```typescript
colors: {
  primary: '#1826A3',  // Bleu foncé
  accent: '#F9D902',   // Jaune
}
```

## 🔒 Sécurité

- Les tokens Google sont gérés par Supabase
- Authentification OAuth sécurisée
- Pas de stockage de données sensibles côté client
- HTTPS obligatoire en production

## 🐛 Dépannage

### Erreur "Token Google non disponible"
- Vérifiez que les scopes sont bien configurés dans Supabase
- Reconnectez-vous pour obtenir un nouveau token

### Les sheets ne s'affichent pas
- Vérifiez que les APIs Google sont activées
- Vérifiez les permissions OAuth

### Erreur de build
- Supprimez `node_modules` et `.next`
- Réinstallez : `npm install`

## 📝 License

MIT

## 👨‍💻 Support

Pour toute question, consultez la documentation :
- [Next.js](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Google Sheets API](https://developers.google.com/sheets/api)

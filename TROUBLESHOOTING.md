# Fix pour les scopes Google OAuth

## Problème

L'erreur 403 (Forbidden) indique que le token OAuth ne contient pas les scopes nécessaires pour accéder à Google Drive API.

## Solution temporaire : Test avec votre propre API Key

En attendant que Supabase transmette correctement les scopes, voici une solution alternative :

### Option 1 : Utiliser Google Picker API (Recommandé)

Au lieu d'utiliser Drive API pour lister les sheets, utilisez Google Picker qui ne nécessite pas de scopes spéciaux.

### Option 2 : OAuth direct sans Supabase (pour les APIs Google)

Créer un flow OAuth séparé uniquement pour les Google APIs, en parallèle de l'authentification Supabase.

### Option 3 : Vérifier la configuration Supabase

Assurez-vous que dans Supabase, vous avez bien :

1. **Client ID et Secret configurés** ✅ (vous l'avez fait)
2. **Redirect URL correcte dans Google Cloud** :
   - Allez dans Google Cloud Console → Credentials
   - Votre OAuth 2.0 Client
   - Dans "Authorized redirect URIs", ajoutez :
     ```
     https://qzmygoutppvvqclazpjo.supabase.co/auth/v1/callback
     ```
     (Remplacez par votre vraie URL Supabase)

3. **APIs activées dans Google Cloud** :
   - Google Sheets API ✅
   - Google Drive API ✅

## Test de diagnostic

Pour vérifier quel est le vrai problème, ajoutez ce code temporaire dans `app/sheets/page.tsx` ligne 57 :

```typescript
// DEBUG: Vérifier le token
console.log('Token:', providerToken?.substring(0, 20) + '...')

// Tester si le token fonctionne pour une API basique
try {
  const testResponse = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
    headers: { Authorization: `Bearer ${providerToken}` }
  })
  console.log('Test userinfo:', testResponse.ok)
  
  // Tester Drive API
  const driveResponse = await fetch('https://www.googleapis.com/drive/v3/about?fields=user', {
    headers: { Authorization: `Bearer ${providerToken}` }
  })
  console.log('Test Drive API:', driveResponse.ok, driveResponse.status)
} catch (e) {
  console.error('Test failed:', e)
}
```

Cela nous dira si :
- Le token est valide (userinfo devrait fonctionner)
- Le token a les scopes Drive (Drive API devrait fonctionner)

## Solution définitive recommandée

Si après tous ces tests ça ne fonctionne toujours pas, la meilleure solution est d'utiliser **Google Identity Services** directement pour obtenir un access token avec les bons scopes, séparément de l'authentification Supabase.

Voulez-vous que j'implémente cette solution ?

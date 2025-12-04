/**
 * Fonctions pour gérer l'authentification Google OAuth directe
 * Utilisé pour obtenir un token avec les scopes Drive et Sheets
 */

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
// Utiliser l'URI de callback de l'application (déjà autorisée dans Google Cloud)
const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : ''
const SCOPES = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/spreadsheets.readonly'
].join(' ')

/**
 * Génère l'URL d'autorisation Google OAuth
 */
export function getGoogleAuthUrl(): string {
    const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code', // Utiliser le flow standard (code) au lieu de implicit (token)
        scope: SCOPES,
        access_type: 'offline',
        prompt: 'consent',
        state: 'google_sheets_access'
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

/**
 * Extrait le token d'accès depuis l'URL de callback
 */
export function extractTokenFromUrl(): string | null {
    if (typeof window === 'undefined') return null

    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    return params.get('access_token')
}

/**
 * Stocke le token Google
 */
export function storeGoogleToken(token: string): void {
    localStorage.setItem('google_sheets_token', token)
    // Stocker aussi l'heure d'expiration (tokens Google expirent après 1h)
    const expiresIn = 3600 // 1 heure en secondes
    const expiresAt = Date.now() + (expiresIn * 1000)
    localStorage.setItem('google_sheets_token_expires', expiresAt.toString())
}

/**
 * Récupère le token Google stocké
 */
export function getStoredGoogleToken(): string | null {
    const token = localStorage.getItem('google_sheets_token')
    const expiresAt = localStorage.getItem('google_sheets_token_expires')

    if (!token || !expiresAt) return null

    // Vérifier si le token a expiré
    if (Date.now() > parseInt(expiresAt)) {
        localStorage.removeItem('google_sheets_token')
        localStorage.removeItem('google_sheets_token_expires')
        return null
    }

    return token
}

/**
 * Supprime le token Google stocké
 */
export function clearGoogleToken(): void {
    localStorage.removeItem('google_sheets_token')
    localStorage.removeItem('google_sheets_token_expires')
}

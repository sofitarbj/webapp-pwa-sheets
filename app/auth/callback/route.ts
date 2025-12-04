import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const state = requestUrl.searchParams.get('state')

    // Cas 1 : OAuth direct Google (avec state = google_sheets_access)
    if (state === 'google_sheets_access' && code) {
        // Rediriger vers une page qui échangera le code contre un token
        return NextResponse.redirect(`${requestUrl.origin}/auth/callback/google?code=${code}`)
    }

    // Cas 2 : OAuth Supabase (code dans les query params, sans state spécial)
    if (code && !state) {
        const cookieStore = cookies()
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

        try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code)

            if (error) {
                console.error('Erreur lors de l\'échange du code:', error)
                return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`)
            }

            if (data.session) {
                // Stocker le provider token pour les appels Google API
                const providerToken = data.session.provider_token

                if (providerToken) {
                    // Le token sera accessible via la session Supabase
                    console.log('Token Google récupéré avec succès')
                }

                // Rediriger vers la page des sheets
                return NextResponse.redirect(`${requestUrl.origin}/sheets`)
            }
        } catch (error) {
            console.error('Erreur:', error)
            return NextResponse.redirect(`${requestUrl.origin}/login?error=unknown`)
        }
    }

    // Si pas de code ni state, rediriger vers login
    return NextResponse.redirect(`${requestUrl.origin}/login`)
}

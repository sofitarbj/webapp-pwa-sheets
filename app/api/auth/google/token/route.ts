import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { code } = await request.json()

        if (!code) {
            return NextResponse.json({ error: 'No code provided' }, { status: 400 })
        }

        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET!
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`

        // Échanger le code contre un access token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        })

        if (!tokenResponse.ok) {
            const error = await tokenResponse.json()
            console.error('Token exchange error:', error)
            return NextResponse.json({ error: 'Token exchange failed' }, { status: 400 })
        }

        const tokenData = await tokenResponse.json()

        return NextResponse.json({
            access_token: tokenData.access_token,
            expires_in: tokenData.expires_in,
            refresh_token: tokenData.refresh_token,
        })
    } catch (error) {
        console.error('Error in token exchange:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

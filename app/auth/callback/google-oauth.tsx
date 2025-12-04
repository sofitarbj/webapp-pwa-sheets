'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { extractTokenFromUrl, storeGoogleToken } from '@/lib/googleOAuth'

export default function GoogleCallbackPage() {
    const router = useRouter()

    useEffect(() => {
        // Extraire le token de l'URL
        const token = extractTokenFromUrl()

        if (token) {
            // Stocker le token
            storeGoogleToken(token)

            // Rediriger vers la page des sheets
            router.push('/sheets')
        } else {
            // Erreur : pas de token
            console.error('Aucun token reçu de Google')
            router.push('/login?error=no_token')
        }
    }, [router])

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Connexion en cours...</p>
            </div>
        </div>
    )
}

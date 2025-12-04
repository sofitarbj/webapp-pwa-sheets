'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { storeGoogleToken } from '@/lib/googleOAuth'

export const dynamic = 'force-dynamic'

export default function GoogleCallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const code = searchParams.get('code')

        if (!code) {
            setError('Aucun code reçu de Google')
            setTimeout(() => router.push('/login?error=no_code'), 2000)
            return
        }

        // Échanger le code contre un token
        exchangeCodeForToken(code)
    }, [searchParams, router])

    const exchangeCodeForToken = async (code: string) => {
        try {
            const response = await fetch('/api/auth/google/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            })

            if (!response.ok) {
                throw new Error('Échec de l\'échange du code')
            }

            const data = await response.json()

            if (data.access_token) {
                // Stocker le token
                storeGoogleToken(data.access_token)

                // Rediriger vers la page des sheets
                router.push('/sheets')
            } else {
                throw new Error('Aucun token reçu')
            }
        } catch (err) {
            console.error('Erreur lors de l\'échange du code:', err)
            setError('Erreur lors de la connexion')
            setTimeout(() => router.push('/sheets'), 2000)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                {error ? (
                    <>
                        <div className="text-6xl mb-4">❌</div>
                        <p className="text-red-600 mb-2">{error}</p>
                        <p className="text-gray-500 text-sm">Redirection...</p>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Connexion en cours...</p>
                        <p className="text-gray-500 text-sm mt-2">Échange du code d'autorisation</p>
                    </>
                )}
            </div>
        </div>
    )
}

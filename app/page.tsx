'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function Home() {
    const router = useRouter()

    useEffect(() => {
        // Vérifier si l'utilisateur est connecté
        const checkAuth = async () => {
            const hasSession = localStorage.getItem('supabase_session')

            // Petit délai pour le splash screen
            await new Promise(resolve => setTimeout(resolve, 1500))

            if (hasSession) {
                router.push('/sheets')
            } else {
                router.push('/login')
            }
        }

        checkAuth()
    }, [router])

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <div className="text-center">
                <div className="mb-8">
                    <h1 className="text-5xl font-bold text-white mb-2">📊</h1>
                    <h2 className="text-3xl font-bold text-white">Sheets Manager</h2>
                </div>
                <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto" />
            </div>
        </div>
    )
}

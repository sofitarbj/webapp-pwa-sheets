'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { listGoogleSheets } from '@/lib/googleApi'
import { getGoogleAuthUrl, getStoredGoogleToken } from '@/lib/googleOAuth'
import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'
import SheetCard from '@/components/SheetCard'
import Loader from '@/components/Loader'

interface GoogleSheet {
    id: string
    name: string
    createdTime: string
    modifiedTime: string
}

export default function SheetsPage() {
    const router = useRouter()
    const [sheets, setSheets] = useState<GoogleSheet[]>([])
    const [filteredSheets, setFilteredSheets] = useState<GoogleSheet[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [needsGoogleAuth, setNeedsGoogleAuth] = useState(false)

    useEffect(() => {
        checkAuthAndLoad()
    }, [])

    useEffect(() => {
        // Filtrer les sheets selon la recherche
        if (searchTerm) {
            const filtered = sheets.filter(sheet =>
                sheet.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredSheets(filtered)
        } else {
            setFilteredSheets(sheets)
        }
    }, [searchTerm, sheets])

    const checkAuthAndLoad = async () => {
        // Vérifier l'authentification Supabase
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            router.push('/login')
            return
        }

        // Vérifier si on a un token Google stocké
        const googleToken = getStoredGoogleToken()

        if (googleToken) {
            await loadSheets(googleToken)
        } else {
            setNeedsGoogleAuth(true)
            setLoading(false)
        }
    }

    const handleGoogleAuthorize = () => {
        // Rediriger vers Google OAuth
        const authUrl = getGoogleAuthUrl()
        window.location.href = authUrl
    }

    const loadSheets = async (token: string) => {
        try {
            setLoading(true)
            setError(null)

            // Récupérer la liste des sheets avec le token Google
            const sheetsList = await listGoogleSheets(token)
            setSheets(sheetsList)
            setFilteredSheets(sheetsList)
        } catch (err) {
            console.error('Erreur:', err)
            // Si le token est expiré, demander une nouvelle autorisation
            if (err instanceof Error && err.message.includes('403')) {
                setNeedsGoogleAuth(true)
                setError('Votre session Google a expiré. Veuillez vous reconnecter.')
            } else {
                setError('Erreur lors du chargement des sheets. Veuillez réessayer.')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleSheetClick = (sheetId: string) => {
        // Passer le token via sessionStorage pour la page de détail
        const googleToken = getStoredGoogleToken()
        if (googleToken) {
            sessionStorage.setItem('google_sheets_token', googleToken)
        }
        router.push(`/sheets/${sheetId}`)
    }

    if (needsGoogleAuth) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header title="Mes Google Sheets" />

                <div className="container mx-auto px-4 py-12 max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Autorisation Google requise
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Pour accéder à vos Google Sheets, nous avons besoin de votre autorisation.
                        </p>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}
                        <button
                            onClick={handleGoogleAuthorize}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                        >
                            Autoriser l'accès à Google Drive & Sheets
                        </button>
                        <p className="text-sm text-gray-500 mt-4">
                            Vous serez redirigé vers Google pour autoriser l'accès
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="Mes Google Sheets" />

            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Barre de recherche */}
                <div className="mb-6">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Rechercher un sheet..."
                    />
                </div>

                {/* Contenu */}
                {loading ? (
                    <Loader />
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={handleGoogleAuthorize}
                            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Réautoriser
                        </button>
                    </div>
                ) : filteredSheets.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <p className="text-gray-600">
                            {searchTerm ? 'Aucun sheet trouvé' : 'Aucun Google Sheet disponible'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredSheets.map((sheet) => (
                            <SheetCard
                                key={sheet.id}
                                id={sheet.id}
                                name={sheet.name}
                                modifiedTime={sheet.modifiedTime}
                                onClick={() => handleSheetClick(sheet.id)}
                            />
                        ))}
                    </div>
                )}

                {/* Compteur */}
                {!loading && !error && (
                    <div className="mt-6 text-center text-sm text-gray-500">
                        {filteredSheets.length} sheet{filteredSheets.length > 1 ? 's' : ''} affiché{filteredSheets.length > 1 ? 's' : ''}
                    </div>
                )}
            </div>
        </div>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getSheetData, getSpreadsheetInfo } from '@/lib/googleApi'
import { parseDynamicSheetData, ColumnInfo, ParsedRow, findPrimaryColumn } from '@/lib/sheetParser'
import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'
import DynamicCard from '@/components/DynamicCard'
import Loader from '@/components/Loader'

export default function SheetDetailPage() {
    const params = useParams()
    const router = useRouter()
    const sheetId = params.id as string

    const [sheetName, setSheetName] = useState('')
    const [columns, setColumns] = useState<ColumnInfo[]>([])
    const [rows, setRows] = useState<ParsedRow[]>([])
    const [filteredRows, setFilteredRows] = useState<ParsedRow[]>([])
    const [primaryColumn, setPrimaryColumn] = useState<ColumnInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadSheetData()
    }, [sheetId])

    useEffect(() => {
        // Filtrer les données selon la recherche
        if (searchTerm) {
            const filtered = rows.filter(row => {
                return Object.values(row).some(value =>
                    String(value).toLowerCase().includes(searchTerm.toLowerCase())
                )
            })
            setFilteredRows(filtered)
        } else {
            setFilteredRows(rows)
        }
    }, [searchTerm, rows])

    const loadSheetData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Récupérer le token Google depuis sessionStorage
            const googleToken = sessionStorage.getItem('google_sheets_token') || localStorage.getItem('google_sheets_token')

            if (!googleToken) {
                setError('Token Google non disponible. Veuillez retourner à la liste des sheets.')
                setTimeout(() => router.push('/sheets'), 2000)
                return
            }

            // Récupérer les infos du spreadsheet
            const info = await getSpreadsheetInfo(googleToken, sheetId)
            setSheetName(info.properties?.title || 'Sheet')

            // Récupérer les données du premier sheet
            const firstSheetName = info.sheets?.[0]?.properties?.title || 'Sheet1'
            const sheetData = await getSheetData(googleToken, sheetId, firstSheetName)

            // Parser les données dynamiquement
            const { columns: detectedColumns, rows: parsedRows } = parseDynamicSheetData(sheetData.values || [])

            setColumns(detectedColumns)
            setRows(parsedRows)
            setFilteredRows(parsedRows)

            // Identifier la colonne principale
            const primary = findPrimaryColumn(detectedColumns)
            setPrimaryColumn(primary)

        } catch (err) {
            console.error('Erreur:', err)
            setError('Erreur lors du chargement des données. Veuillez réessayer.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title={sheetName} showBack />

            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Barre de recherche */}
                <div className="mb-6">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Rechercher dans les données..."
                    />
                </div>

                {/* Contenu */}
                {loading ? (
                    <Loader />
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                        <p className="text-red-600">{error}</p>
                    </div>
                ) : filteredRows.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <p className="text-gray-600">
                            {searchTerm ? 'Aucune donnée trouvée' : 'Aucune donnée disponible'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Liste des données */}
                        <div className="space-y-3">
                            {filteredRows.map((row, index) => (
                                <DynamicCard
                                    key={index}
                                    row={row}
                                    columns={columns}
                                    primaryColumn={primaryColumn}
                                />
                            ))}
                        </div>

                        {/* Compteur */}
                        <div className="mt-6 text-center text-sm text-gray-500">
                            {filteredRows.length} résultat{filteredRows.length > 1 ? 's' : ''} affiché{filteredRows.length > 1 ? 's' : ''}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

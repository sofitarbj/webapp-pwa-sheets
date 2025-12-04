/**
 * Utilitaires pour parser dynamiquement les données des Google Sheets
 */

export interface ColumnInfo {
    name: string
    type: 'text' | 'email' | 'phone' | 'date' | 'url' | 'number'
    index: number
}

export interface ParsedRow {
    [key: string]: any
}

/**
 * Détecte le type d'une colonne en analysant ses valeurs
 */
function detectColumnType(values: string[]): 'text' | 'email' | 'phone' | 'date' | 'url' | 'number' {
    const sampleValues = values.filter(v => v && v.trim()).slice(0, 10)

    if (sampleValues.length === 0) return 'text'

    // Compter les patterns
    let emailCount = 0
    let phoneCount = 0
    let urlCount = 0
    let numberCount = 0
    let dateCount = 0

    for (const value of sampleValues) {
        const str = String(value).trim()

        // Email
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
            emailCount++
        }
        // Téléphone (formats variés)
        else if (/^[\d\s\-\+\(\)]{8,}$/.test(str) && /\d{6,}/.test(str.replace(/\D/g, ''))) {
            phoneCount++
        }
        // URL
        else if (/^https?:\/\//i.test(str)) {
            urlCount++
        }
        // Date
        else if (/^\d{4}-\d{2}-\d{2}/.test(str) || /^\d{2}\/\d{2}\/\d{4}/.test(str)) {
            dateCount++
        }
        // Nombre
        else if (/^\d+(\.\d+)?$/.test(str)) {
            numberCount++
        }
    }

    const total = sampleValues.length

    // Si plus de 70% des valeurs correspondent à un type
    if (emailCount / total > 0.7) return 'email'
    if (phoneCount / total > 0.7) return 'phone'
    if (urlCount / total > 0.7) return 'url'
    if (dateCount / total > 0.7) return 'date'
    if (numberCount / total > 0.7) return 'number'

    return 'text'
}

/**
 * Parse les données du sheet de manière dynamique
 */
export function parseDynamicSheetData(values: any[][]): {
    columns: ColumnInfo[]
    rows: ParsedRow[]
} {
    if (!values || values.length === 0) {
        return { columns: [], rows: [] }
    }

    // La première ligne contient les noms des colonnes
    const headers = values[0]
    const dataRows = values.slice(1)

    // Détecter les types de colonnes
    const columns: ColumnInfo[] = headers.map((header, index) => {
        const columnValues = dataRows.map(row => row[index])
        const type = detectColumnType(columnValues)

        return {
            name: String(header || `Colonne ${index + 1}`),
            type,
            index
        }
    })

    // Parser les lignes
    const rows: ParsedRow[] = dataRows
        .filter(row => row.some(cell => cell)) // Ignorer les lignes vides
        .map(row => {
            const parsedRow: ParsedRow = {}

            columns.forEach(col => {
                const value = row[col.index]
                parsedRow[col.name] = value || ''
            })

            return parsedRow
        })

    return { columns, rows }
}

/**
 * Formate un numéro de téléphone pour WhatsApp
 */
export function formatPhoneForWhatsApp(phone: string): string {
    // Supprimer tous les caractères non numériques
    const cleaned = phone.replace(/\D/g, '')

    // Si le numéro commence par 0, le remplacer par l'indicatif du pays (ex: 229 pour Bénin)
    if (cleaned.startsWith('0')) {
        return '229' + cleaned.substring(1)
    }

    return cleaned
}

/**
 * Identifie la colonne principale (nom, titre, etc.)
 */
export function findPrimaryColumn(columns: ColumnInfo[]): ColumnInfo | null {
    // Chercher des colonnes avec des noms communs pour le titre
    const primaryNames = ['nom', 'name', 'titre', 'title', 'nom complet', 'full name', 'client', 'customer']

    for (const name of primaryNames) {
        const col = columns.find(c =>
            c.name.toLowerCase().includes(name.toLowerCase())
        )
        if (col) return col
    }

    // Sinon, prendre la première colonne de type texte
    return columns.find(c => c.type === 'text') || columns[0] || null
}

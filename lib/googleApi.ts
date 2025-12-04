/**
 * Fonctions pour interagir avec les Google APIs
 */

interface GoogleSheet {
    id: string
    name: string
    createdTime: string
    modifiedTime: string
}

interface SheetData {
    values: any[][]
}

/**
 * Récupère la liste des Google Sheets de l'utilisateur
 */
export async function listGoogleSheets(accessToken: string): Promise<GoogleSheet[]> {
    try {
        const response = await fetch(
            "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'&fields=files(id,name,createdTime,modifiedTime)&orderBy=modifiedTime desc",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )

        if (!response.ok) {
            throw new Error(`Erreur Google Drive API: ${response.statusText}`)
        }

        const data = await response.json()
        return data.files || []
    } catch (error) {
        console.error('Erreur lors de la récupération des sheets:', error)
        throw error
    }
}

/**
 * Récupère le contenu d'un Google Sheet spécifique
 */
export async function getSheetData(
    accessToken: string,
    spreadsheetId: string,
    range: string = 'A1:Z1000'
): Promise<SheetData> {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )

        if (!response.ok) {
            throw new Error(`Erreur Google Sheets API: ${response.statusText}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error)
        throw error
    }
}

/**
 * Récupère les informations d'un spreadsheet
 */
export async function getSpreadsheetInfo(
    accessToken: string,
    spreadsheetId: string
) {
    try {
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )

        if (!response.ok) {
            throw new Error(`Erreur Google Sheets API: ${response.statusText}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Erreur lors de la récupération des infos:', error)
        throw error
    }
}

/**
 * Helper pour générer des liens WhatsApp
 */

import { ParsedRow } from './sheetParser'

/**
 * Génère un message WhatsApp personnalisé
 */
export function generateWhatsAppMessage(row: ParsedRow): string {
    let message = 'Bonjour'

    if (row.name) {
        message += ` ${row.name}`
    }

    message += ',\n\n'

    if (row.model) {
        message += `Je vous contacte concernant : ${row.model}\n\n`
    }

    message += 'Merci de me recontacter.\n\nCordialement'

    return encodeURIComponent(message)
}

/**
 * Génère l'URL WhatsApp complète
 */
export function getWhatsAppUrl(phone: string, message: string): string {
    // Enlever le + du numéro pour wa.me
    const cleanPhone = phone.replace('+', '')
    return `https://wa.me/${cleanPhone}?text=${message}`
}

/**
 * Génère l'URL WhatsApp pour une ligne de données
 */
export function getWhatsAppUrlForRow(row: ParsedRow): string | null {
    if (!row.phone) return null

    const message = generateWhatsAppMessage(row)
    return getWhatsAppUrl(row.phone, message)
}

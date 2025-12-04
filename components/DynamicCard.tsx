import { ColumnInfo, ParsedRow, formatPhoneForWhatsApp } from '@/lib/sheetParser'

interface DynamicCardProps {
    row: ParsedRow
    columns: ColumnInfo[]
    primaryColumn: ColumnInfo | null
    onClick?: () => void
}

export default function DynamicCard({ row, columns, primaryColumn, onClick }: DynamicCardProps) {
    // Trouver le titre principal
    const title = primaryColumn ? row[primaryColumn.name] : Object.values(row)[0]

    // Séparer les colonnes par type
    const emailColumns = columns.filter(c => c.type === 'email')
    const phoneColumns = columns.filter(c => c.type === 'phone')
    const otherColumns = columns.filter(c =>
        c.type !== 'email' &&
        c.type !== 'phone' &&
        c !== primaryColumn
    )

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-5 cursor-pointer border border-gray-100"
        >
            {/* Titre principal */}
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">👤</span>
                {title || 'Sans titre'}
            </h3>

            {/* Autres informations */}
            <div className="space-y-2 mb-4">
                {otherColumns.map(col => {
                    const value = row[col.name]
                    if (!value) return null

                    return (
                        <div key={col.name} className="flex items-start gap-2 text-sm">
                            <span className="text-gray-500 min-w-[100px]">{col.name}:</span>
                            <span className="text-gray-900 font-medium">{value}</span>
                        </div>
                    )
                })}
            </div>

            {/* Emails */}
            {emailColumns.map(col => {
                const email = row[col.name]
                if (!email) return null

                return (
                    <div key={col.name} className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span className="text-lg">📧</span>
                        <span>{email}</span>
                    </div>
                )
            })}

            {/* Actions */}
            <div className="flex gap-2 mt-4">
                {/* Boutons Email */}
                {emailColumns.map(col => {
                    const email = row[col.name]
                    if (!email) return null

                    return (
                        <a
                            key={`email-${col.name}`}
                            href={`mailto:${email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                        >
                            <span>✉️</span>
                            <span>Email</span>
                        </a>
                    )
                })}

                {/* Boutons WhatsApp */}
                {phoneColumns.map(col => {
                    const phone = row[col.name]
                    if (!phone) return null

                    const whatsappNumber = formatPhoneForWhatsApp(String(phone))

                    return (
                        <a
                            key={`whatsapp-${col.name}`}
                            href={`https://wa.me/${whatsappNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            <span>💬</span>
                            <span>WhatsApp</span>
                        </a>
                    )
                })}
            </div>
        </div>
    )
}

import { User, Phone, Mail, Package, MapPin, Calendar, MessageCircle } from 'lucide-react'
import { ParsedRow } from '@/lib/sheetParser'
import { getWhatsAppUrlForRow } from '@/lib/whatsappHelper'

interface DataCardProps {
    data: ParsedRow
}

export default function DataCard({ data }: DataCardProps) {
    const whatsappUrl = getWhatsAppUrlForRow(data)

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100">
            <div className="space-y-3">
                {/* Nom */}
                {data.name && (
                    <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="font-semibold text-gray-900">{data.name}</span>
                    </div>
                )}

                {/* Téléphone */}
                {data.phone && (
                    <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <a
                            href={`tel:${data.phone}`}
                            className="text-gray-700 hover:text-primary transition-colors"
                        >
                            {data.phone}
                        </a>
                    </div>
                )}

                {/* Email */}
                {data.email && (
                    <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <a
                            href={`mailto:${data.email}`}
                            className="text-gray-700 hover:text-primary transition-colors truncate"
                        >
                            {data.email}
                        </a>
                    </div>
                )}

                {/* Modèle */}
                {data.model && (
                    <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-700">{data.model}</span>
                    </div>
                )}

                {/* Ville */}
                {data.city && (
                    <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-700">{data.city}</span>
                    </div>
                )}

                {/* Date */}
                {data.date && (
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-700">{data.date}</span>
                    </div>
                )}
            </div>

            {/* Boutons d'action */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                {whatsappUrl && (
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                    </a>
                )}

                {data.phone && (
                    <a
                        href={`tel:${data.phone}`}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        <Phone className="w-4 h-4" />
                        <span>Appeler</span>
                    </a>
                )}

                {data.email && (
                    <a
                        href={`mailto:${data.email}`}
                        className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        <Mail className="w-4 h-4" />
                    </a>
                )}
            </div>
        </div>
    )
}

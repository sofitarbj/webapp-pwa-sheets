import { FileSpreadsheet, Clock } from 'lucide-react'

interface SheetCardProps {
    id: string
    name: string
    modifiedTime: string
    onClick: () => void
}

export default function SheetCard({ id, name, modifiedTime, onClick }: SheetCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date)
    }

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 p-5 cursor-pointer border-2 border-transparent hover:border-primary group"
        >
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <FileSpreadsheet className="w-6 h-6 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate mb-1">
                        {name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(modifiedTime)}</span>
                    </div>
                </div>

                <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                </div>
            </div>
        </div>
    )
}

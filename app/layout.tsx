import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Sheets Manager',
    description: 'Gérez vos Google Sheets facilement',
    manifest: '/manifest.json',
    themeColor: '#1826A3',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Sheets Manager',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr">
            <head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
            </head>
            <body>{children}</body>
        </html>
    )
}

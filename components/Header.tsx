'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LogOut, User } from 'lucide-react'
import { useEffect, useState } from 'react'

interface HeaderProps {
    title?: string
    showBack?: boolean
}

export default function Header({ title = 'Sheets Manager', showBack = false }: HeaderProps) {
    const router = useRouter()
    const [userEmail, setUserEmail] = useState<string>('')

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserEmail(user.email || '')
            }
        }
        getUser()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        localStorage.removeItem('supabase_session')
        router.push('/login')
    }

    return (
        <header className="bg-primary text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {showBack && (
                            <button
                                onClick={() => router.back()}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                ←
                            </button>
                        )}
                        <h1 className="text-xl font-bold">{title}</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {userEmail && (
                            <div className="hidden sm:flex items-center gap-2 text-sm">
                                <User className="w-4 h-4" />
                                <span>{userEmail}</span>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            title="Déconnexion"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Déconnexion</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

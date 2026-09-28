"use client"
// provider precisa ser client
import { SessionProvider, SessionProviderProps } from 'next-auth/react'

export const AuthProvider = ({ children }: SessionProviderProps) => {
    return(
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}
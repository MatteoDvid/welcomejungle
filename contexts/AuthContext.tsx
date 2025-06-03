"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { AuthService, User } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string, role: User["role"]) => Promise<boolean>
  logout: () => void
  hasAccess: (route: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const loggedInUser = await AuthService.login(email, password)
      
      if (loggedInUser) {
        setUser(loggedInUser)
        
        // Redirect based on role
        const route = AuthService.getRouteForRole(loggedInUser.role)
        router.push(route)
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, role: User["role"]): Promise<boolean> => {
    try {
      setIsLoading(true)
      const newUser = await AuthService.signUp(email, password, role)
      
      if (newUser) {
        setUser(newUser)
        
        // Redirect based on role
        const route = AuthService.getRouteForRole(newUser.role)
        router.push(route)
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Sign up error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    AuthService.logout()
    setUser(null)
    router.push('/login')
  }

  const hasAccess = (route: string): boolean => {
    if (!user) return false
    return AuthService.hasAccessToRoute(user.role, route)
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signUp,
    logout,
    hasAccess
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
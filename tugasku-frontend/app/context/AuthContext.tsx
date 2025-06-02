"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authAPI } from "../services/api"
import { toast } from "react-toastify"

interface User {
  id: number
  username: string
  email: string
  created_at: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Check for stored token on app start
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token")
      const storedUser = localStorage.getItem("user")

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))

        // Verify token is still valid
        authAPI
          .getProfile()
          .then((response) => {
            setUser(response.data.user)
          })
          .catch(() => {
            // Token is invalid, clear storage
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            setToken(null)
            setUser(null)
          })
      }

      setLoading(false)
    }
  }, [mounted])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await authAPI.login({ username, password })

      const { user: userData, token: userToken } = response.data

      setUser(userData)
      setToken(userToken)

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", userToken)
        localStorage.setItem("user", JSON.stringify(userData))
      }

      toast.success("Login berhasil!")
      return true
    } catch (err: unknown) {
      const message = err instanceof Error && "response" in err ? (err as any).response?.data?.error : "Login gagal"
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await authAPI.register({ username, email, password })

      const { user: userData, token: userToken } = response.data

      setUser(userData)
      setToken(userToken)

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", userToken)
        localStorage.setItem("user", JSON.stringify(userData))
      }

      toast.success("Registrasi berhasil!")
      return true
    } catch (err: unknown) {
      const message =
        err instanceof Error && "response" in err ? (err as any).response?.data?.error : "Registrasi gagal"
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
    toast.info("Anda telah logout")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }
    }
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

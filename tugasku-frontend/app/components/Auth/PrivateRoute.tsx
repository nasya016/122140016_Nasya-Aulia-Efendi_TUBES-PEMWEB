"use client"

import type React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { LoadingSpinner } from "../ui/loading-spinner"

interface PrivateRouteProps {
  children: React.ReactNode
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-3 text-muted">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

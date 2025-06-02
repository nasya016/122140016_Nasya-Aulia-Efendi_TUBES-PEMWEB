"use client"
import { Component, type ReactNode } from "react"
import type React from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="container mt-5">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Oops! Something went wrong</h4>
              <p>We&apos;re sorry, but something unexpected happened. Please try refreshing the page.</p>
              <hr />
              <p className="mb-0">
                <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
                  Refresh Page
                </button>
              </p>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}

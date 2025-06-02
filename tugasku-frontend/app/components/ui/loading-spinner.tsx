interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "spinner-border-sm",
    md: "",
    lg: "spinner-border-lg",
  }

  return (
    <div className={`spinner-border text-primary ${sizeClasses[size]} ${className}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  )
}

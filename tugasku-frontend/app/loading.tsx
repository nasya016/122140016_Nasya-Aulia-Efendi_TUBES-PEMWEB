import { LoadingSpinner } from "./components/ui/loading-spinner"

export default function Loading() {
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-3 text-muted">Loading...</p>
      </div>
    </div>
  )
}

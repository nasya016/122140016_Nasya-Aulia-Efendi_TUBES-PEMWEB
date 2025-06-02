import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container mt-5 text-center">
      <h1 className="display-1">404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link href="/" className="btn btn-primary">
        Return Home
      </Link>
    </div>
  )
}

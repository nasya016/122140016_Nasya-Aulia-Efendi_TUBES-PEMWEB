"use client"

import dynamic from "next/dynamic"
import { LoadingSpinner } from "./components/ui/loading-spinner"
import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Layout/Navbar"
import Home from "./components/Home/Home"
import About from "./components/Home/About"
import Login from "./components/Auth/Login"
import Register from "./components/Auth/Register"
import Dashboard from "./components/Dashboard/Dashboard"
import TaskList from "./components/Tasks/TaskList"
import TaskForm from "./components/Tasks/TaskForm"
import TaskDetail from "./components/Tasks/TaskDetail"
import CategoryList from "./components/Categories/CategoryList"
import Profile from "./components/Account/Profile"
import PrivateRoute from "./components/Auth/PrivateRoute"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Dynamically import the App component with no SSR
const DynamicApp = dynamic(() => import("./components/App"), {
  ssr: false,
  loading: () => (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-3 text-muted">Loading...</p>
      </div>
    </div>
  ),
})

export default function Page() {
  return <DynamicApp />
}

function App() {
  // Fix for React Router DOM in Next.js
  useEffect(() => {
    // This ensures React Router DOM only runs on the client side
    require("bootstrap/dist/js/bootstrap.bundle.min.js")
  }, [])

  return (
    <AuthProvider>
      <Router>
        <div className="min-vh-100 d-flex flex-column">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <PrivateRoute>
                    <TaskList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tasks/new"
                element={
                  <PrivateRoute>
                    <TaskForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tasks/:id"
                element={
                  <PrivateRoute>
                    <TaskDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tasks/:id/edit"
                element={
                  <PrivateRoute>
                    <TaskForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <PrivateRoute>
                    <CategoryList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>

          <footer className="bg-dark text-white text-center py-3 mt-auto">
            <div className="container">
              <small>© {new Date().getFullYear()} TugasKu. Dibuat dengan ❤️ untuk tugas besar Pemrograman Web.</small>
            </div>
          </footer>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </AuthProvider>
  )
}

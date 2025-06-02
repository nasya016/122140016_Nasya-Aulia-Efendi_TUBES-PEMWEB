"use client"

import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "../context/AuthContext"
import Navbar from "./Layout/Navbar"
import Home from "./Home/Home"
import About from "./Home/About"
import Login from "./Auth/Login"
import Register from "./Auth/Register"
import Dashboard from "./Dashboard/Dashboard"
import TaskList from "./Tasks/TaskList"
import TaskForm from "./Tasks/TaskForm"
import TaskDetail from "./Tasks/TaskDetail"
import CategoryList from "./Categories/CategoryList"
import Profile from "./Account/Profile"
import PrivateRoute from "./Auth/PrivateRoute"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function App() {
  useEffect(() => {
    // Load Bootstrap JavaScript only on client side
    if (typeof window !== "undefined") {
      require("bootstrap/dist/js/bootstrap.bundle.min.js")
    }
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

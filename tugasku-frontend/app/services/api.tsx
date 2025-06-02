import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: (data: { username: string; password: string }) => api.post("/auth/login", data),

  register: (data: { username: string; email: string; password: string }) => api.post("/auth/register", data),

  getProfile: () => api.get("/auth/profile"),
}

// Tasks API
export const tasksAPI = {
  getTasks: (params?: {
    search?: string
    category_id?: number
    status?: string
    priority?: string
    sort_by?: string
    sort_order?: string
  }) => api.get("/tasks", { params }),

  getTask: (id: number) => api.get(`/tasks/${id}`),

  createTask: (data: {
    title: string
    description?: string
    status?: string
    priority?: string
    due_date?: string
    category_id?: number
  }) => api.post("/tasks", data),

  updateTask: (
    id: number,
    data: {
      title?: string
      description?: string
      status?: string
      priority?: string
      due_date?: string
      category_id?: number
      status_notes?: string
    },
  ) => api.put(`/tasks/${id}`, data),

  deleteTask: (id: number) => api.delete(`/tasks/${id}`),
}

// Categories API
export const categoriesAPI = {
  getCategories: () => api.get("/categories"),

  createCategory: (data: { name: string; description?: string }) => api.post("/categories", data),

  updateCategory: (id: number, data: { name?: string; description?: string }) => api.put(`/categories/${id}`, data),

  deleteCategory: (id: number) => api.delete(`/categories/${id}`),
}

// Dashboard API
export const dashboardAPI = {
  getDashboard: () => api.get("/dashboard"),
}

export default api

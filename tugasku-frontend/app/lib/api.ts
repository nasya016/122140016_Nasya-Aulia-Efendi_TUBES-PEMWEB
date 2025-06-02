import axios, { type AxiosResponse } from "axios"
import type {
  User,
  Task,
  Category,
  DashboardData,
  LoginForm,
  RegisterForm,
  TaskForm,
  CategoryForm,
  TaskFilters,
} from "../types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response: { status: number } }
      if (axiosError.response?.status === 401) {
        // Token expired or invalid
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          // Use Next.js router instead of directly manipulating window.location
          // We'll handle this in the component level
        }
      }
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: (data: LoginForm): Promise<AxiosResponse<{ user: User; token: string; message: string }>> =>
    api.post("/auth/login", data),

  register: (data: RegisterForm): Promise<AxiosResponse<{ user: User; token: string; message: string }>> =>
    api.post("/auth/register", data),

  getProfile: (): Promise<AxiosResponse<{ user: User }>> => api.get("/auth/profile"),
}

// Tasks API
export const tasksAPI = {
  getTasks: (params?: TaskFilters): Promise<AxiosResponse<{ tasks: Task[]; pagination: any }>> =>
    api.get("/tasks", { params }),

  getTask: (id: number): Promise<AxiosResponse<{ task: Task }>> => api.get(`/tasks/${id}`),

  createTask: (data: TaskForm): Promise<AxiosResponse<{ task: Task; message: string }>> => api.post("/tasks", data),

  updateTask: (
    id: number,
    data: Partial<TaskForm> & { status_notes?: string },
  ): Promise<AxiosResponse<{ task: Task; message: string }>> => api.put(`/tasks/${id}`, data),

  deleteTask: (id: number): Promise<AxiosResponse<{ message: string }>> => api.delete(`/tasks/${id}`),
}

// Categories API
export const categoriesAPI = {
  getCategories: (): Promise<AxiosResponse<{ categories: Category[] }>> => api.get("/categories"),

  createCategory: (data: CategoryForm): Promise<AxiosResponse<{ category: Category; message: string }>> =>
    api.post("/categories", data),

  updateCategory: (id: number, data: CategoryForm): Promise<AxiosResponse<{ category: Category; message: string }>> =>
    api.put(`/categories/${id}`, data),

  deleteCategory: (id: number): Promise<AxiosResponse<{ message: string }>> => api.delete(`/categories/${id}`),
}

// Dashboard API
export const dashboardAPI = {
  getDashboard: (): Promise<AxiosResponse<DashboardData>> => api.get("/dashboard"),
}

export default api

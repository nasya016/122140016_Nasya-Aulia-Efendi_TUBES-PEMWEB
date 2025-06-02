// User types
export interface User {
  id: number
  username: string
  email: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Task types
export interface Task {
  id: number
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  due_date?: string
  created_at: string
  updated_at: string
  user: User
  category?: Category
  logs?: TaskLog[]
}

export type TaskStatus = "pending" | "in_progress" | "completed"
export type TaskPriority = "low" | "medium" | "high"

// Category types
export interface Category {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
  task_count: number
}

// Task Log types
export interface TaskLog {
  id: number
  task_id: number
  old_status?: string
  new_status: string
  changed_by: string
  changed_at: string
  notes?: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    page_size: number
    total: number
    pages: number
    has_next: boolean
    has_prev: boolean
  }
}

// Form types
export interface LoginForm {
  username: string
  password: string
}

export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface TaskForm {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string
  category_id?: number
}

export interface CategoryForm {
  name: string
  description?: string
}

// Dashboard types
export interface DashboardStats {
  total_tasks: number
  pending_tasks: number
  in_progress_tasks: number
  completed_tasks: number
}

export interface DashboardData {
  statistics: DashboardStats
  recent_tasks: Task[]
  category_stats: Array<{
    category: Category
    task_count: number
  }>
}

// Filter types
export interface TaskFilters {
  search?: string
  category_id?: number
  status?: TaskStatus
  priority?: TaskPriority
  sort_by?: string
  sort_order?: "asc" | "desc"
  page?: number
  page_size?: number
}

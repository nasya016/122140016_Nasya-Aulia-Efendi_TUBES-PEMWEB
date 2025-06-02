"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useTasks } from "../../hooks/useTasks"
import { useCategories } from "../../hooks/useCategories"
import type { TaskFilters, TaskStatus, TaskPriority } from "../../types"
import { LoadingSpinner } from "../ui/loading-spinner"

export default function TaskList() {
  const [filters, setFilters] = useState<TaskFilters>({
    page: 1,
    page_size: 20,
  })

  const { tasks, loading, pagination, fetchTasks, deleteTask } = useTasks(filters)
  const { categories } = useCategories()

  const handleFilterChange = (newFilters: Partial<TaskFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }
    setFilters(updatedFilters)
    fetchTasks(updatedFilters)
  }

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page }
    setFilters(updatedFilters)
    fetchTasks(updatedFilters)
  }

  const handleDeleteTask = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(id)
    }
  }

  const getStatusBadgeClass = (status: TaskStatus) => {
    const classes = {
      pending: "bg-warning text-dark",
      in_progress: "bg-info text-white",
      completed: "bg-success text-white",
    }
    return classes[status] || "bg-secondary"
  }

  const getPriorityBadgeClass = (priority: TaskPriority) => {
    const classes = {
      low: "bg-light text-dark",
      medium: "bg-primary text-white",
      high: "bg-danger text-white",
    }
    return classes[priority] || "bg-secondary"
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="display-5 fw-bold text-primary">📝 My Tasks</h1>
            <Link to="/tasks/new" className="btn btn-primary">
              <span className="me-2">➕</span>
              New Task
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Search</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search tasks..."
                    value={filters.search || ""}
                    onChange={(e) => handleFilterChange({ search: e.target.value })}
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={filters.category_id || ""}
                    onChange={(e) =>
                      handleFilterChange({
                        category_id: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      })
                    }
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={filters.status || ""}
                    onChange={(e) =>
                      handleFilterChange({
                        status: (e.target.value as TaskStatus) || undefined,
                      })
                    }
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="col-md-2">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={filters.priority || ""}
                    onChange={(e) =>
                      handleFilterChange({
                        priority: (e.target.value as TaskPriority) || undefined,
                      })
                    }
                  >
                    <option value="">All Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="col-md-2">
                  <label className="form-label">Sort By</label>
                  <select
                    className="form-select"
                    value={`${filters.sort_by || "created_at"}_${filters.sort_order || "desc"}`}
                    onChange={(e) => {
                      const [sort_by, sort_order] = e.target.value.split("_")
                      handleFilterChange({ sort_by, sort_order: sort_order as "asc" | "desc" })
                    }}
                  >
                    <option value="created_at_desc">Newest First</option>
                    <option value="created_at_asc">Oldest First</option>
                    <option value="title_asc">Title A-Z</option>
                    <option value="title_desc">Title Z-A</option>
                    <option value="due_date_asc">Due Date</option>
                    <option value="priority_desc">Priority High-Low</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="row">
        <div className="col-12">
          {loading ? (
            <div className="text-center py-5">
              <LoadingSpinner size="lg" />
              <p className="mt-3 text-muted">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <span className="display-1">📝</span>
                <h3 className="mt-3">No tasks found</h3>
                <p className="text-muted">
                  {Object.keys(filters).some((key) => filters[key as keyof TaskFilters])
                    ? "Try adjusting your filters or create a new task."
                    : "Get started by creating your first task!"}
                </p>
                <Link to="/tasks/new" className="btn btn-primary">
                  Create New Task
                </Link>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Task</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Due Date</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task.id}>
                          <td>
                            <div>
                              <Link to={`/tasks/${task.id}`} className="fw-semibold text-decoration-none">
                                {task.title}
                              </Link>
                              {task.description && (
                                <div className="text-muted small mt-1">
                                  {task.description.length > 100
                                    ? `${task.description.substring(0, 100)}...`
                                    : task.description}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            {task.category ? (
                              <span className="badge bg-light text-dark">{task.category.name}</span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                              {task.status.replace("_", " ")}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>{task.priority}</span>
                          </td>
                          <td>
                            {task.due_date ? (
                              <span className="small">{new Date(task.due_date).toLocaleDateString()}</span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            <span className="small text-muted">{new Date(task.created_at).toLocaleDateString()}</span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <Link to={`/tasks/${task.id}`} className="btn btn-outline-primary" title="View">
                                👁️
                              </Link>
                              <Link to={`/tasks/${task.id}/edit`} className="btn btn-outline-secondary" title="Edit">
                                ✏️
                              </Link>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="btn btn-outline-danger"
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${!pagination.has_prev ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.has_prev}
                  >
                    Previous
                  </button>
                </li>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <li key={page} className={`page-item ${page === pagination.page ? "active" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(page)}>
                      {page}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${!pagination.has_next ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.has_next}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  )
}

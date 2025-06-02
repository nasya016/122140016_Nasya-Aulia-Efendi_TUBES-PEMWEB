"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { tasksAPI } from "../../lib/api"
import type { Task } from "../../types"
import { LoadingSpinner } from "../ui/loading-spinner"
import { toast } from "react-toastify"

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return

      try {
        setLoading(true)
        const response = await tasksAPI.getTask(Number(id))
        setTask(response.data.task)
      } catch (error: any) {
        toast.error("Failed to load task")
        navigate("/tasks")
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [id, navigate])

  const handleDelete = async () => {
    if (!task || !window.confirm("Are you sure you want to delete this task?")) {
      return
    }

    try {
      await tasksAPI.deleteTask(task.id)
      toast.success("Task deleted successfully")
      navigate("/tasks")
    } catch (error: any) {
      toast.error("Failed to delete task")
    }
  }

  const getStatusBadgeClass = (status: string) => {
    const classes = {
      pending: "bg-warning text-dark",
      in_progress: "bg-info text-white",
      completed: "bg-success text-white",
    }
    return classes[status as keyof typeof classes] || "bg-secondary"
  }

  const getPriorityBadgeClass = (priority: string) => {
    const classes = {
      low: "bg-light text-dark",
      medium: "bg-primary text-white",
      high: "bg-danger text-white",
    }
    return classes[priority as keyof typeof classes] || "bg-secondary"
  }

  if (loading) {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!task) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">Task not found</div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/tasks" className="text-decoration-none">
                    Tasks
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {task.title}
                </li>
              </ol>
            </nav>

            <div className="btn-group">
              <Link to={`/tasks/${task.id}/edit`} className="btn btn-outline-primary">
                ✏️ Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-outline-danger">
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white">
              <h1 className="h3 mb-0">{task.title}</h1>
            </div>
            <div className="card-body">
              {task.description ? (
                <div className="mb-4">
                  <h6 className="text-muted mb-2">Description</h6>
                  <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                    {task.description}
                  </p>
                </div>
              ) : (
                <p className="text-muted mb-4">No description provided.</p>
              )}

              <div className="row">
                <div className="col-md-6 mb-3">
                  <h6 className="text-muted mb-2">Status</h6>
                  <span className={`badge ${getStatusBadgeClass(task.status)} fs-6`}>
                    {task.status.replace("_", " ")}
                  </span>
                </div>

                <div className="col-md-6 mb-3">
                  <h6 className="text-muted mb-2">Priority</h6>
                  <span className={`badge ${getPriorityBadgeClass(task.priority)} fs-6`}>{task.priority}</span>
                </div>

                <div className="col-md-6 mb-3">
                  <h6 className="text-muted mb-2">Category</h6>
                  {task.category ? (
                    <span className="badge bg-light text-dark fs-6">{task.category.name}</span>
                  ) : (
                    <span className="text-muted">No category</span>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <h6 className="text-muted mb-2">Due Date</h6>
                  {task.due_date ? (
                    <span className="text-dark">
                      {new Date(task.due_date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  ) : (
                    <span className="text-muted">No due date</span>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <h6 className="text-muted mb-2">Created</h6>
                  <span className="text-dark">
                    {new Date(task.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="col-md-6 mb-3">
                  <h6 className="text-muted mb-2">Last Updated</h6>
                  <span className="text-dark">
                    {new Date(task.updated_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Task Logs */}
          {task.logs && task.logs.length > 0 && (
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">📋 Activity Log</h5>
              </div>
              <div className="card-body">
                <div className="timeline">
                  {task.logs.map((log, index) => (
                    <div key={log.id} className={`timeline-item ${index === 0 ? "timeline-item-latest" : ""}`}>
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <span className="fw-semibold">
                            {log.old_status ? (
                              <>
                                {log.old_status} → {log.new_status}
                              </>
                            ) : (
                              log.new_status
                            )}
                          </span>
                          <small className="text-muted">
                            {new Date(log.changed_at).toLocaleDateString("id-ID", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </small>
                        </div>
                        <div className="text-muted small">by {log.changed_by}</div>
                        {log.notes && <div className="text-muted small mt-1">{log.notes}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

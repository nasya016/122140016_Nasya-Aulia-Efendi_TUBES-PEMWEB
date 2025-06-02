"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { dashboardAPI } from "../../lib/api"
import type { DashboardData } from "../../types"
import { LoadingSpinner } from "../ui/loading-spinner"
import { toast } from "react-toastify"

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardAPI.getDashboard()
        setData(response.data)
      } catch (err) {
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">Failed to load dashboard data</div>
      </div>
    )
  }

  const { statistics, recent_tasks, category_stats } = data

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <h1 className="display-5 fw-bold text-primary mb-4">📊 Dashboard</h1>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-gradient-primary text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Total Tasks</h6>
                  <h2 className="mb-0">{statistics.total_tasks}</h2>
                </div>
                <div className="align-self-center">
                  <span className="display-4">📝</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-gradient-warning text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Pending</h6>
                  <h2 className="mb-0">{statistics.pending_tasks}</h2>
                </div>
                <div className="align-self-center">
                  <span className="display-4">⏳</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-gradient-info text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">In Progress</h6>
                  <h2 className="mb-0">{statistics.in_progress_tasks}</h2>
                </div>
                <div className="align-self-center">
                  <span className="display-4">🔄</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-gradient-success text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Completed</h6>
                  <h2 className="mb-0">{statistics.completed_tasks}</h2>
                </div>
                <div className="align-self-center">
                  <span className="display-4">✅</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Recent Tasks */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">📋 Recent Tasks</h5>
                <Link to="/tasks" className="btn btn-sm btn-outline-primary">
                  View All
                </Link>
              </div>
            </div>
            <div className="card-body">
              {recent_tasks.length === 0 ? (
                <p className="text-muted text-center py-4">No tasks yet. Create your first task!</p>
              ) : (
                <div className="list-group list-group-flush">
                  {recent_tasks.map((task) => (
                    <div key={task.id} className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">
                            <Link to={`/tasks/${task.id}`} className="text-decoration-none">
                              {task.title}
                            </Link>
                          </h6>
                          <p className="mb-1 text-muted small">{task.description}</p>
                          <small className="text-muted">
                            {task.category?.name && (
                              <span className="badge bg-light text-dark me-2">{task.category.name}</span>
                            )}
                            <span className={`badge badge-${task.status}`}>{task.status}</span>
                          </small>
                        </div>
                        <small className="text-muted">{new Date(task.created_at).toLocaleDateString()}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Statistics */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">📂 Categories</h5>
                <Link to="/categories" className="btn btn-sm btn-outline-primary">
                  Manage
                </Link>
              </div>
            </div>
            <div className="card-body">
              {category_stats.length === 0 ? (
                <p className="text-muted text-center py-4">No categories yet.</p>
              ) : (
                <div className="list-group list-group-flush">
                  {category_stats.map((stat) => (
                    <div key={stat.category.id} className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">{stat.category.name}</h6>
                          <small className="text-muted">{stat.category.description}</small>
                        </div>
                        <span className="badge bg-primary rounded-pill">{stat.task_count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">🚀 Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <Link to="/tasks/new" className="btn btn-primary w-100">
                    <span className="me-2">➕</span>
                    New Task
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/categories" className="btn btn-outline-primary w-100">
                    <span className="me-2">📂</span>
                    Manage Categories
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/tasks?status=pending" className="btn btn-outline-warning w-100">
                    <span className="me-2">⏳</span>
                    Pending Tasks
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link to="/profile" className="btn btn-outline-secondary w-100">
                    <span className="me-2">👤</span>
                    Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

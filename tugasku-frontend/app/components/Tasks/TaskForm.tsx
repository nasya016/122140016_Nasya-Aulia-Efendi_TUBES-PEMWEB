"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useCategories } from "../../hooks/useCategories"
import { tasksAPI } from "../../lib/api"
import type { Task, TaskForm as TaskFormType } from "../../types"
import { LoadingSpinner } from "../ui/loading-spinner"
import { toast } from "react-toastify"

export default function TaskForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const { categories } = useCategories()
  const [loading, setLoading] = useState(false)
  const [task, setTask] = useState<Task | null>(null)

  const [formData, setFormData] = useState<TaskFormType>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    due_date: "",
    category_id: undefined,
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (isEdit && id) {
      const fetchTask = async () => {
        try {
          setLoading(true)
          const response = await tasksAPI.getTask(Number(id))
          const taskData = response.data.task
          setTask(taskData)
          setFormData({
            title: taskData.title,
            description: taskData.description || "",
            status: taskData.status,
            priority: taskData.priority,
            due_date: taskData.due_date ? taskData.due_date.split("T")[0] : "",
            category_id: taskData.category?.id,
          })
        } catch (err) {
          toast.error("Failed to load task")
          navigate("/tasks")
        } finally {
          setLoading(false)
        }
      }
      fetchTask()
    }
  }, [isEdit, id, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "category_id" ? (value ? Number(value) : undefined) : value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    } else if (formData.title.length > 255) {
      newErrors.title = "Title must be less than 255 characters"
    }

    if (formData.description && formData.description.length > 2000) {
      newErrors.description = "Description must be less than 2000 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      const submitData = {
        ...formData,
        due_date: formData.due_date || undefined,
      }

      if (isEdit && id) {
        await tasksAPI.updateTask(Number(id), submitData)
        toast.success("Task updated successfully")
      } else {
        await tasksAPI.createTask(submitData)
        toast.success("Task created successfully")
      }

      navigate("/tasks")
    } catch (err: unknown) {
      const message =
        err instanceof Error && "response" in err
          ? (err as any).response?.data?.error
          : `Failed to ${isEdit ? "update" : "create"} task`
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (isEdit && loading && !task) {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h2 className="mb-0">{isEdit ? "✏️ Edit Task" : "➕ Create New Task"}</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-8 mb-3">
                    <label htmlFor="title" className="form-label">
                      Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.title ? "is-invalid" : ""}`}
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter task title"
                      disabled={loading}
                      maxLength={255}
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label htmlFor="category_id" className="form-label">
                      Category
                    </label>
                    <select
                      className="form-select"
                      id="category_id"
                      name="category_id"
                      value={formData.category_id || ""}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="">No Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className={`form-control ${errors.description ? "is-invalid" : ""}`}
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter task description (optional)"
                    disabled={loading}
                    maxLength={2000}
                  />
                  {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                  <div className="form-text">{(formData.description || '').length}/2000 characters</div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label htmlFor="priority" className="form-label">
                      Priority
                    </label>
                    <select
                      className="form-select"
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label htmlFor="due_date" className="form-label">
                      Due Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="due_date"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleChange}
                      disabled={loading}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div className="d-flex gap-2 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/tasks")}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" className="me-2" />
                        {isEdit ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>{isEdit ? "✏️ Update Task" : "➕ Create Task"}</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

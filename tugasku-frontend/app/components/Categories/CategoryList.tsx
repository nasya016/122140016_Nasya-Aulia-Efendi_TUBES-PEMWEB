"use client"

import type React from "react"
import { useState } from "react"
import { useCategories } from "../../hooks/useCategories"
import type { Category } from "../../types"
import { LoadingSpinner } from "../ui/loading-spinner"
import { toast } from "react-toastify"

export default function CategoryList() {
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories()

  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [submitting, setSubmitting] = useState(false)

  const resetForm = () => {
    setFormData({ name: "", description: "" })
    setErrors({})
    setShowForm(false)
    setEditingCategory(null)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (category: Category) => {
    if (category.task_count > 0) {
      toast.error(`Cannot delete category "${category.name}". It has ${category.task_count} associated tasks.`)
      return
    }

    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      await deleteCategory(category.id)
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters"
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters"
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
      setSubmitting(true)

      if (editingCategory) {
        await updateCategory(editingCategory.id, formData)
      } else {
        await createCategory(formData)
      }

      resetForm()
    } catch {
      // Error is handled by the hook
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="display-5 fw-bold text-primary">📂 Categories</h1>
            <button onClick={() => setShowForm(true)} className="btn btn-primary" disabled={showForm}>
              <span className="me-2">➕</span>
              New Category
            </button>
          </div>
        </div>
      </div>

      {/* Category Form */}
      {showForm && (
        <div className="row mb-4">
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">{editingCategory ? "✏️ Edit Category" : "➕ Create New Category"}</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter category name"
                      disabled={submitting}
                      maxLength={100}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      className={`form-control ${errors.description ? "is-invalid" : ""}`}
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter category description (optional)"
                      disabled={submitting}
                      maxLength={500}
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                    <div className="form-text">{formData.description.length}/500 characters</div>
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? (
                        <>
                          <LoadingSpinner size="sm" className="me-2" />
                          {editingCategory ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>{editingCategory ? "✏️ Update" : "➕ Create"}</>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn btn-outline-secondary"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="row">
        <div className="col-12">
          {loading ? (
            <div className="text-center py-5">
              <LoadingSpinner size="lg" />
              <p className="mt-3 text-muted">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <span className="display-1">📂</span>
                <h3 className="mt-3">No categories yet</h3>
                <p className="text-muted">Create your first category to organize your tasks!</p>
                <button onClick={() => setShowForm(true)} className="btn btn-primary" disabled={showForm}>
                  Create Category
                </button>
              </div>
            </div>
          ) : (
            <div className="row">
              {categories.map((category) => (
                <div key={category.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title mb-0">{category.name}</h5>
                        <span className="badge bg-primary rounded-pill">{category.task_count}</span>
                      </div>

                      {category.description && (
                        <p className="card-text text-muted small mb-3">{category.description}</p>
                      )}

                      <div className="text-muted small mb-3">
                        Created: {new Date(category.created_at).toLocaleDateString("id-ID")}
                      </div>
                    </div>

                    <div className="card-footer bg-transparent">
                      <div className="btn-group w-100">
                        <button
                          onClick={() => handleEdit(category)}
                          className="btn btn-outline-primary btn-sm"
                          disabled={showForm}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category)}
                          className="btn btn-outline-danger btn-sm"
                          disabled={category.task_count > 0}
                          title={category.task_count > 0 ? "Cannot delete category with tasks" : "Delete category"}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

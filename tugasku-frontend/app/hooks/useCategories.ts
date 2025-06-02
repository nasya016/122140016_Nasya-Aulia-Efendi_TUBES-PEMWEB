"use client"

import { useState, useEffect } from "react"
import { categoriesAPI } from "../lib/api"
import type { Category } from "../types"
import { toast } from "react-toastify"

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await categoriesAPI.getCategories()
      setCategories(response.data.categories)
    } catch (err: unknown) {
      const message =
        err instanceof Error && "response" in err ? (err as any).response?.data?.error : "Failed to fetch categories"
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (categoryData: { name: string; description?: string }) => {
    try {
      const response = await categoriesAPI.createCategory(categoryData)
      setCategories((prev) => [...prev, response.data.category])
      toast.success(response.data.message)
      return response.data.category
    } catch (err: unknown) {
      const message =
        err instanceof Error && "response" in err ? (err as any).response?.data?.error : "Failed to create category"
      toast.error(message)
      throw err
    }
  }

  const updateCategory = async (id: number, categoryData: { name: string; description?: string }) => {
    try {
      const response = await categoriesAPI.updateCategory(id, categoryData)
      setCategories((prev) => prev.map((cat) => (cat.id === id ? response.data.category : cat)))
      toast.success(response.data.message)
      return response.data.category
    } catch (err: unknown) {
      const message =
        err instanceof Error && "response" in err ? (err as any).response?.data?.error : "Failed to update category"
      toast.error(message)
      throw err
    }
  }

  const deleteCategory = async (id: number) => {
    try {
      const response = await categoriesAPI.deleteCategory(id)
      setCategories((prev) => prev.filter((cat) => cat.id !== id))
      toast.success(response.data.message)
    } catch (err: unknown) {
      const message =
        err instanceof Error && "response" in err ? (err as any).response?.data?.error : "Failed to delete category"
      toast.error(message)
      throw err
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: () => fetchCategories(),
  }
}

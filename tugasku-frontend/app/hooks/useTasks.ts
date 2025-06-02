"use client"

import { useState, useEffect, useCallback } from "react"
import { tasksAPI } from "../lib/api"
import type { Task, TaskFilters, TaskForm } from "../types"
import { toast } from "react-toastify"

export function useTasks(filters?: TaskFilters) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<any>(null)

  const fetchTasks = useCallback(
    async (newFilters?: TaskFilters) => {
      try {
        setLoading(true)
        setError(null)
        const response = await tasksAPI.getTasks({ ...filters, ...newFilters })
        setTasks(response.data.tasks)
        setPagination(response.data.pagination)
      } catch (err: unknown) {
        const message =
          err instanceof Error && "response" in err ? (err as any).response?.data?.error : "Failed to fetch tasks"
        setError(message)
        toast.error(message)
      } finally {
        setLoading(false)
      }
    },
    [filters],
  )

  const createTask = async (taskData: TaskForm) => {
    try {
      const response = await tasksAPI.createTask(taskData)
      setTasks((prev) => [response.data.task, ...prev])
      toast.success(response.data.message)
      return response.data.task
    } catch (err: unknown) {
      const message =
        err instanceof Error && "response" in err ? (err as any).response?.data?.error : "Failed to create task"
      toast.error(message)
      throw err
    }
  }

  const updateTask = async (id: number, taskData: Partial<TaskForm>) => {
    try {
      const response = await tasksAPI.updateTask(id, taskData)
      setTasks((prev) => prev.map((task) => (task.id === id ? response.data.task : task)))
      toast.success(response.data.message)
      return response.data.task
    } catch (err: unknown) {
      const message =
        err instanceof Error && "response" in err ? (err as any).response?.data?.error : "Failed to update task"
      toast.error(message)
      throw err
    }
  }

  const deleteTask = async (id: number) => {
    try {
      const response = await tasksAPI.deleteTask(id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
      toast.success(response.data.message)
    } catch (err: unknown) {
      const message =
        err instanceof Error && "response" in err ? (err as any).response?.data?.error : "Failed to delete task"
      toast.error(message)
      throw err
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return {
    tasks,
    loading,
    error,
    pagination,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    refetch: () => fetchTasks(),
  }
}

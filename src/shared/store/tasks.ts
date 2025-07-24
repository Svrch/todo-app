import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ITask, TTaskStatus } from '../../widgets/TaskCard/types'

export const useTasksStore = defineStore('tasks', () => {

  const tasks = ref<ITask[]>([
    {
      id: '1',
      title: 'First task',
      status: 'todo',
      subtasks: [],
      createdAt: new Date(2025, 5, 5),
      updatedAt: new Date(2025, 6, 6),
      tags: ['read', 'write'],
    },
    {
      id: '2',
      title: 'Second task',
      status: 'in-progress',
      subtasks: [],
      createdAt: new Date(2025, 3, 11),
      updatedAt: new Date(2025, 5, 6),
      tags: ['write'],
    },
    {
      id: '3',
      title: 'Third task',
      status: 'done',
      subtasks: [],
      createdAt: new Date(2025, 2, 16),
      updatedAt: new Date(2025, 3, 26),
      tags: ['outside'],
    },
  ])

  const updateTaskStatus = (taskId: string, newStatus: TTaskStatus) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) task.status = newStatus
  }

  const deleteTask = (taskId: string) => {
    tasks.value = tasks.value.filter(t => t.id !== taskId)
  }

  const addTagToTask = (taskId: string, tag: string) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task && !task.tags.includes(tag)) {
      task.tags.push(tag)
    }
  }

  const removeTagFromTask = (taskId: string, tag: string) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.tags = task.tags.filter(t => t !== tag)
    }
  }

  const addSubtask = (taskId: string, title: string) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.subtasks.push({
        id: Date.now().toString(), // Генерируем ID
        title,
        status: 'todo',
        subtasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
      })
    }
  }

  const updateTaskTitle = (taskId: string, newTitle: string) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) task.title = newTitle
  }

  const updateSubtaskStatus = (taskId: string, subtaskId: string, status: TTaskStatus) => {
    const task = tasks.value.find(t => t.id === taskId)
    const subtask = task?.subtasks.find(s => s.id === subtaskId)
    if (subtask) {
      subtask.status = status
    }
  }

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.subtasks = task.subtasks.filter(s => s.id !== subtaskId)
    }
  }

  return {
    tasks,
    updateTaskStatus,
    deleteTask,
    addTagToTask,
    removeTagFromTask,
    addSubtask,
    updateTaskTitle,
    updateSubtaskStatus,
    deleteSubtask,
  }
})

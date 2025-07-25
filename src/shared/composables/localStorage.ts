import type { Project } from '../../widgets/TaskCard/types'

interface AppData {
  projects: Project[]
  filters: {
    statuses: string[]
    tags: string[]
    search: string
  }
}

const STORAGE_KEY = 'todo_app_data'

export const loadFromStorage = (): AppData | null => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : null
}

export const saveToStorage = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

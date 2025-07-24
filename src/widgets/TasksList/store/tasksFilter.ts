import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useTasksStore } from '../../../shared/store/tasks.ts'

export const useTasksFilterStore = defineStore('tasks-filter', () => {

  const tasksStore = useTasksStore()
  const { tasks } = storeToRefs(tasksStore)

  const searchQuery = ref('')
  const selectedStatuses = ref<string[]>([])
  const selectedTags = ref<string[]>([])

  const statusOptions = [
    { key: 'todo', name: 'To Do' },
    { key: 'in-progress', name: 'In Progress' },
    { key: 'done', name: 'Done' },
  ]

  // Получение уникальных тегов
  const allTags = computed(() => {
    const tags = new Set<string>()
    tasks.value.forEach(task => {
      task.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags)
  })

  // Фильтрация задач
  const filteredTasks = computed(() => {
    return tasks.value.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesStatus = selectedStatuses.value.length === 0 ||
                selectedStatuses.value.includes(task.status)
      const matchesTags = selectedTags.value.length === 0 ||
                task.tags.some(tag => selectedTags.value.includes(tag))
      return matchesSearch && matchesStatus && matchesTags
    })
  })

  // Методы для управления фильтрами
  const toggleStatus = (status: string) => {
    const index = selectedStatuses.value.indexOf(status)
    if (index === -1) {
      selectedStatuses.value.push(status)
    } else {
      selectedStatuses.value.splice(index, 1)
    }
  }

  const toggleTag = (tag: string) => {
    const index = selectedTags.value.indexOf(tag)
    if (index === -1) {
      selectedTags.value.push(tag)
    } else {
      selectedTags.value.splice(index, 1)
    }
  }

  const resetFilters = () => {
    searchQuery.value = ''
    selectedStatuses.value = []
    selectedTags.value = []
  }

  return {
    tasks,
    searchQuery,
    selectedStatuses,
    selectedTags,
    statusOptions,
    allTags,
    filteredTasks,
    toggleStatus,
    toggleTag,
    resetFilters,
  }
})

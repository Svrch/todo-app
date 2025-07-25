// store/tasks-filter.ts
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useTasksStore } from '../../../shared/store/tasks.ts'
import type { TTaskStatus } from '../../TaskCard/types'

export const useTasksFilterStore = defineStore('tasks-filter', () => {
  const tasksStore = useTasksStore()
  const { currentTasks } = storeToRefs(tasksStore)

  // Состояние фильтров
  const searchQuery = ref('')
  const selectedStatuses = ref<TTaskStatus[]>([])
  const selectedTags = ref<string[]>([])


  // Получение уникальных тегов для текущего проекта
  const allTags = computed(() => {
    const tags = new Set<string>()
    currentTasks.value.forEach(task => {
      task.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  })

  // Фильтрация задач текущего проекта
  const filteredTasks = computed(() => {
    return currentTasks.value.filter(task => {
      // Поиск по названию
      const matchesSearch = searchQuery.value === '' ||
          task.title.toLowerCase().includes(searchQuery.value.toLowerCase())

      // Фильтр по статусам
      const matchesStatus = selectedStatuses.value.length === 0 ||
          selectedStatuses.value.includes(task.status)

      // Фильтр по тегам
      const matchesTags = selectedTags.value.length === 0 ||
          selectedTags.value.some(tag => task.tags.includes(tag))

      return matchesSearch && matchesStatus && matchesTags
    })
  })

  // Количество отфильтрованных задач
  const filteredCount = computed(() => filteredTasks.value.length)

  // Методы управления фильтрами
  const toggleStatus = (status: TTaskStatus) => {
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

  // Проверка активных фильтров
  const hasActiveFilters = computed(() => {
    return searchQuery.value !== '' ||
        selectedStatuses.value.length > 0 ||
        selectedTags.value.length > 0
  })

  return {
    // Состояние
    searchQuery,
    selectedStatuses,
    selectedTags,

    // Геттеры
    allTags,
    filteredTasks,
    filteredCount,
    hasActiveFilters,

    // Методы
    toggleStatus,
    toggleTag,
    resetFilters,
  }
})

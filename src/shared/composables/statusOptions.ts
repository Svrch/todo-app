import type { TTaskStatus } from '../../widgets/TaskCard/types'

export const statusOptions: { key: TTaskStatus; name: string }[] = [
  { key: 'todo', name: 'To Do' },
  { key: 'in-progress', name: 'In Progress' },
  { key: 'done', name: 'Done' },
]

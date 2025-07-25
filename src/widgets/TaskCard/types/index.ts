export type TTaskStatus = 'todo' | 'in-progress' | 'done'

export interface Project {
  id: string
  name: string
  tasks: ITask[]
}

export interface ITask {
  id: string
  title: string
  status: TTaskStatus
  tags: string[]
  subtasks: ITask[]
  createdAt: Date
  updatedAt: Date
}

import { encryptData, decryptData } from './crypto.ts'

export const exportToFile = (password: string, data: string): void => {
  const encrypted = encryptData(data, password)
  const blob = new Blob([encrypted], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `todo_backup_${new Date().toISOString().split('T')[0]}.tdb`
  a.click()
  URL.revokeObjectURL(url)
}

export const importFromFile = async (file: File, password: string): Promise<string> => {
  const encrypted = await file.text()
  return decryptData(encrypted, password)
}

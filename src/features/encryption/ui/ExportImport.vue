<script setup lang="ts">
import { ref } from 'vue'
import { exportToFile, importFromFile } from '../composables/data-export.ts'
import { loadFromStorage } from '../../../shared/composables/localStorage.ts'
import { UiButton } from '../../../shared/components/UiButton'
import { UiInput } from '../../../shared/components/UiInput'

const exportPassword = ref('')
const importPassword = ref('')
const importFile = ref<File | null>(null)
const showImportDialog = ref(false)
const showExportDialog = ref(false)
const error = ref('')

const handleExport = () => {
  try {
    const data = localStorage.getItem('todo_app_data') || '{}'
    exportToFile(exportPassword.value, data)
    exportPassword.value = ''
    error.value = ''
  } catch (e) {
    error.value = 'Export failed'
  }
}

const handleImport = async () => {
  try {
    if (!importFile.value) throw new Error('Select file')

    const decrypted = await importFromFile(importFile.value, importPassword.value)
    const parsed = JSON.parse(decrypted)

    if (!parsed.projects) throw new Error('Invalid data format')

    localStorage.setItem('todo_app_data', decrypted)
    loadFromStorage()
    showImportDialog.value = false
    error.value = ''
  } catch (e) {
    error.value = 'Import failed: ' + (e instanceof Error ? e.message : 'Wrong password')
  }
}
</script>

<template>
  <div class="flex justify-end gap-3">
    <!-- Экспорт -->
    <UiButton @click="showExportDialog = true" variant="secondary">
      Export
    </UiButton>
    <!-- Диалог экспорта' -->
    <div v-if="showExportDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div class="flex flex-col gap-3 bg-white p-6 rounded-lg max-w-md w-full">
        <h3 class="text-lg font-bold mb-4">Export Data</h3>
        <UiInput
          v-model="exportPassword"
          placeholder="Export password"
          type="password"
        />
        <div class="flex justify-end gap-2">
          <UiButton
            variant="danger"
            @click="showExportDialog = false"
            class="px-4 py-2 rounded"
          >
            Cancel
          </UiButton>
          <UiButton
            :disabled="!exportPassword.length"
            @click="handleExport"
            class="px-4 py-2 rounded"
          >
            Export
          </UiButton>
        </div>
      </div>
    </div>

    <!-- Импорт -->
    <UiButton @click="showImportDialog = true" variant="secondary">
      Import
    </UiButton>
    <!-- Диалог импорта -->
    <div v-if="showImportDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div class="flex flex-col gap-3 bg-white p-6 rounded-lg max-w-md w-full">
        <h3 class="text-lg font-bold mb-4">Import Data</h3>
        <UiInput
          v-model="importPassword"
          placeholder="Import password"
          type="password"
        />
        <input
          type="file"
          @change="e => importFile = e.target.files?.[0] || null"
          class="mb-4 cursor-pointer"
        />
        <div v-if="error" class="text-red-500">
          {{ error }}
        </div>
        <div class="flex justify-end gap-2">
          <UiButton
            variant="danger"
            @click="showImportDialog = false"
            class="px-4 py-2 rounded"
          >
            Cancel
          </UiButton>
          <UiButton
            :disabled="!importPassword.length || importFile === null"
            @click="handleImport"
            class="px-4 py-2 rounded"
          >
            Import
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

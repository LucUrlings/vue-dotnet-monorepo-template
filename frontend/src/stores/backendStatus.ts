import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getBackendStatus, type BackendStatus } from '@/api/status'

const requestTimeoutMilliseconds = 8_000

export const useBackendStatusStore = defineStore('backendStatus', () => {
  const status = ref<BackendStatus | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isConnected = computed(() => status.value?.status === 'ok')
  let activeRequest: AbortController | null = null
  let latestRequestId = 0

  async function checkConnection(): Promise<void> {
    activeRequest?.abort()
    const controller = new AbortController()
    const requestId = ++latestRequestId
    activeRequest = controller
    const timeout = globalThis.setTimeout(
      () => controller.abort(),
      requestTimeoutMilliseconds,
    )

    loading.value = true
    error.value = null

    try {
      const response = await getBackendStatus(controller.signal)

      if (requestId === latestRequestId) {
        status.value = response
      }
    } catch (cause) {
      if (requestId === latestRequestId) {
        status.value = null
        error.value = controller.signal.aborted
          ? 'The backend status request timed out.'
          : cause instanceof Error
            ? cause.message
            : 'Unable to reach the backend service.'
      }
    } finally {
      globalThis.clearTimeout(timeout)

      if (requestId === latestRequestId) {
        activeRequest = null
        loading.value = false
      }
    }
  }

  return { status, loading, error, isConnected, checkConnection }
})

import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, vi } from 'vitest'
import { useBackendStatusStore } from '@/stores/backendStatus'
import * as statusApi from '@/api/status'

describe('backend status store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('stores a successful response', async () => {
    vi.spyOn(statusApi, 'getBackendStatus').mockResolvedValue({
      status: 'ok',
      service: 'VueDotnet.Api',
      environment: 'Test',
      timestamp: '2026-01-01T12:00:00Z',
    })
    const store = useBackendStatusStore()

    await store.checkConnection()

    expect(store.isConnected).toBe(true)
    expect(store.status?.service).toBe('VueDotnet.Api')
    expect(store.error).toBeNull()
  })

  it('records a request failure', async () => {
    vi.spyOn(statusApi, 'getBackendStatus').mockRejectedValue(
      new Error('Connection refused'),
    )
    const store = useBackendStatusStore()

    await store.checkConnection()

    expect(store.status).toBeNull()
    expect(store.error).toBe('Connection refused')
    expect(store.loading).toBe(false)
  })

  it('ignores a stale response when a newer check starts', async () => {
    let resolveFirst: ((value: statusApi.BackendStatus) => void) | undefined
    const firstResponse = new Promise<statusApi.BackendStatus>((resolve) => {
      resolveFirst = resolve
    })
    const latestResponse = {
      status: 'ok',
      service: 'Latest.Api',
      environment: 'Test',
      timestamp: '2026-01-01T12:00:00Z',
    }
    vi.spyOn(statusApi, 'getBackendStatus')
      .mockReturnValueOnce(firstResponse)
      .mockResolvedValueOnce(latestResponse)
    const store = useBackendStatusStore()

    const firstCheck = store.checkConnection()
    await store.checkConnection()
    resolveFirst?.({
      ...latestResponse,
      service: 'Stale.Api',
    })
    await firstCheck

    expect(store.status?.service).toBe('Latest.Api')
    expect(store.loading).toBe(false)
  })
})

import { getBackendStatus } from '@/api/status'

describe('status API', () => {
  it('returns a validated status response', async () => {
    const backendStatus = {
      status: 'ok',
      service: 'VueDotnet.Api',
      environment: 'Test',
      timestamp: '2026-01-01T12:00:00Z',
    }
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify(backendStatus)))

    await expect(getBackendStatus()).resolves.toEqual(backendStatus)
    expect(fetchMock).toHaveBeenCalledWith('/api/status', {
      headers: { Accept: 'application/json' },
      signal: undefined,
    })
  })

  it('rejects a response that does not match the API contract', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok' })),
    )

    await expect(getBackendStatus()).rejects.toThrow(
      'Backend status response was not valid.',
    )
  })

  it('throws a useful error for a non-success response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 503 }),
    )

    await expect(getBackendStatus()).rejects.toThrow('HTTP 503')
  })

  it('propagates network failures', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(
      new TypeError('Failed to fetch'),
    )

    await expect(getBackendStatus()).rejects.toThrow('Failed to fetch')
  })
})

import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import BackendStatusCard from '@/components/BackendStatusCard.vue'
import { useBackendStatusStore } from '@/stores/backendStatus'

describe('BackendStatusCard', () => {
  it('announces that the connection check is in progress', () => {
    const wrapper = mount(BackendStatusCard, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
            initialState: {
              backendStatus: {
                loading: true,
                error: null,
                status: null,
              },
            },
          }),
        ],
      },
    })

    expect(wrapper.text()).toContain('Checking the ASP.NET Core API')
  })

  it('renders a successful backend response', async () => {
    const wrapper = mount(BackendStatusCard, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
            initialState: {
              backendStatus: {
                loading: false,
                error: null,
                status: {
                  status: 'ok',
                  service: 'VueDotnet.Api',
                  environment: 'Test',
                  timestamp: '2026-01-01T12:00:00Z',
                },
              },
            },
          }),
        ],
      },
    })

    expect(wrapper.text()).toContain('Connected and ready.')
    expect(wrapper.text()).toContain('VueDotnet.Api')
    expect(wrapper.text()).toContain('Test')
  })

  it('offers a retry when the backend is unavailable', async () => {
    const wrapper = mount(BackendStatusCard, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: true,
            initialState: {
              backendStatus: {
                loading: false,
                status: null,
                error: 'Network unavailable',
              },
            },
          }),
        ],
      },
    })
    const store = useBackendStatusStore()

    await wrapper.get('button').trigger('click')

    expect(wrapper.text()).toContain('The API is unavailable.')
    expect(store.checkConnection).toHaveBeenCalledTimes(2)
  })
})

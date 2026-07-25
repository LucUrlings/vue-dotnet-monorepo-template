import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router'

describe('router', () => {
  it('navigates to the about view', async () => {
    await router.push('/about')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router],
      },
    })

    expect(wrapper.get('h1').text()).toContain('complete delivery path')
  })

  it('renders a helpful page for an unknown route', async () => {
    await router.push('/missing-page')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router],
      },
    })

    expect(wrapper.get('h1').text()).toBe('This route does not exist.')
  })
})

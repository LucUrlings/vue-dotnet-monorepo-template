<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useBackendStatusStore } from '@/stores/backendStatus'

const store = useBackendStatusStore()
const { status, loading, error, isConnected } = storeToRefs(store)

onMounted(() => {
  void store.checkConnection()
})
</script>

<template>
  <section class="status-card" aria-labelledby="connection-title">
    <div class="status-heading">
      <div>
        <p class="eyebrow">Live integration</p>
        <h2 id="connection-title">Backend connection</h2>
      </div>
      <span
        class="status-indicator"
        :class="{ connected: isConnected, failed: error }"
        aria-hidden="true"
      ></span>
    </div>

    <div class="status-content" aria-live="polite">
      <p v-if="loading">Checking the ASP.NET Core API…</p>

      <template v-else-if="status">
        <p class="status-message">Connected and ready.</p>
        <dl>
          <div>
            <dt>Service</dt>
            <dd>{{ status.service }}</dd>
          </div>
          <div>
            <dt>Environment</dt>
            <dd>{{ status.environment }}</dd>
          </div>
        </dl>
      </template>

      <template v-else-if="error">
        <p class="status-message error">The API is unavailable.</p>
        <p class="muted">{{ error }}</p>
        <button type="button" @click="store.checkConnection">Try again</button>
      </template>
    </div>
  </section>
</template>

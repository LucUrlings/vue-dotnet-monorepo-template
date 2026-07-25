<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/" aria-label="VueDotnet Monorepo home">
        <span class="brand-mark" aria-hidden="true">VD</span>
        <span>VueDotnet</span>
      </RouterLink>

      <nav aria-label="Primary navigation">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <footer>
      <p>Vue 3 meets ASP.NET Core, without unnecessary layers.</p>
    </footer>
  </div>
</template>

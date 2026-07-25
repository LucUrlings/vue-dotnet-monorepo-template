<script setup lang="ts">
import BackendStatusCard from '@/components/BackendStatusCard.vue'
</script>

<template>
  <div class="page home-page">
    <section class="hero" aria-labelledby="hero-title">
      <p class="eyebrow">A practical full-stack foundation</p>
      <h1 id="hero-title">
        Build the product.<br />Keep the architecture clear.
      </h1>
      <p class="hero-copy">
        VueDotnet Monorepo brings a focused Vue 3 client and a lightweight
        ASP.NET Core API together with tested local and container workflows.
      </p>
      <div class="hero-actions">
        <a class="button primary" href="#connection">Check the integration</a>
        <RouterLink class="button secondary" to="/about"
          >Explore the stack</RouterLink
        >
      </div>
    </section>

    <section id="connection" class="integration-grid">
      <div class="section-intro">
        <p class="eyebrow">Ready from day one</p>
        <h2>One repository, two deliberately simple applications.</h2>
        <p>
          Start with hot reload, typed API boundaries, automated tests, and
          production container builds. Add domain architecture only when the
          application earns it.
        </p>
      </div>
      <BackendStatusCard />
    </section>
  </div>
</template>

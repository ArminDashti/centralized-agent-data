<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { clearToken, getToken } from '@/lib/api'

const route = useRoute()
const router = useRouter()
const authed = computed(() => !!getToken() && route.name !== 'login')

function logout() {
  clearToken()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen">
    <header v-if="authed" class="border-b border-border bg-card/60 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <RouterLink to="/sessions" class="text-sm font-semibold tracking-wide text-primary">
          Centralized Agent Data
        </RouterLink>
        <nav class="flex gap-4 text-sm text-muted-foreground">
          <RouterLink class="hover:text-foreground" to="/sessions">Sessions</RouterLink>
        </nav>
        <button class="ml-auto text-sm text-muted-foreground hover:text-foreground" @click="logout">
          Sign out
        </button>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-6">
      <RouterView />
    </main>
  </div>
</template>

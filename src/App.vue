<script setup lang="ts">
import { RouterView } from 'vue-router'
import RoomPanel from './components/feature/Room/RoomPanel.vue'
</script>

<template>
  <div class="grid grid-cols-12 h-screen bg-[#ffffff] relative overflow-hidden">
    <aside class="col-span-12 md:col-span-4">
      <RoomPanel />
    </aside>
    <main class="max-h-screen overflow-y-auto col-span-12 md:col-span-8">
      <RouterView />
    </main>
  </div>
</template>

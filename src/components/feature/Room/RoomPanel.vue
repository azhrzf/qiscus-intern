<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'
import { useUIStore } from '@/stores/ui'
import RoomSearch from './RoomSearch.vue'
import RoomList from './RoomList.vue'

const route = useRoute()
const chatStore = useChatStore()
const uiStore = useUIStore()

const { rooms } = storeToRefs(chatStore)
const { showChatView } = storeToRefs(uiStore)

const searchInput = ref('')

const filteredRooms = computed(() => {
  if (!searchInput.value.trim()) {
    return rooms.value
  }

  const query = searchInput.value.toLowerCase()
  return rooms.value.filter(
    (room) =>
      room.name.toLowerCase().includes(query) ||
      room.participant.some(p => p.name.toLowerCase().includes(query)),
  )
})
</script>

<template>
  <aside
    class="col-span-12 md:col-span-4 flex flex-col h-screen border-r border-[#e8e8e8] bg-[#fafafa] absolute md:relative inset-0 transition-transform duration-300 ease-in-out z-10"
    :class="showChatView ? '-translate-x-full md:translate-x-0' : 'translate-x-0'">
    <div class="sticky top-0 z-10 p-5 border-b border-[#e8e8e8] bg-[#fafafa]">
      <RoomSearch v-model="searchInput" />
    </div>

    <div class="flex-1 overflow-y-auto">
      <div v-if="filteredRooms.length > 0">
        <div v-for="room in filteredRooms" :key="room.id" class="cursor-pointer border-b border-[#f5f5f5]" :class="{
          'bg-[#DFDFDF]': parseInt(route.params.roomId as string) === room.id,
        }">
          <RouterLink :to="`/chat/${room.id}`" class="block">
            <RoomList :room="room" />
          </RouterLink>
        </div>
      </div>

      <div v-else-if="searchInput.trim()" class="p-4 text-center text-[#4f5665]">
        <p class="mb-2">No rooms found for "{{ searchInput }}"</p>
        <button @click="searchInput = ''" class="text-[#21978b] hover:underline text-sm">
          Clear search
        </button>
      </div>

      <div v-else class="p-4 text-center text-[#4f5665]">
        <p>No conversations available</p>
      </div>
    </div>
  </aside>
</template>
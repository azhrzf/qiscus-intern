<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'
import { useUIStore } from '@/stores/ui'
import MessageList from '@/components/feature/Message/MessageList.vue'
import MessageProfile from '@/components/feature/Message/MessageProfile.vue'
import MessageInput from '@/components/feature/Message/MessageInput.vue'

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()
const uiStore = useUIStore()

const { selectedRoom, currentMessages, error } = storeToRefs(chatStore)
const { showChatView } = storeToRefs(uiStore)

watch(() => route.params.roomId, (roomId) => {
  if (roomId && typeof roomId === 'string') {
    const numericRoomId = parseInt(roomId)
    chatStore.selectRoom(numericRoomId)
    uiStore.toggleChatView(true)
  } else {
    uiStore.toggleChatView(false)
  }
}, { immediate: true })

const backToList = () => {
  router.push('/chat')
  uiStore.toggleChatView(false)
}
</script>

<template>
  <main class="h-full flex-1 flex flex-col absolute md:relative inset-0 transition-transform duration-300 ease-in-out"
    :class="showChatView ? 'translate-x-0' : 'translate-x-full md:translate-x-0'">
    <div v-if="error" class="p-4 bg-red-100 border-b border-red-200 text-red-700">
      {{ error }}
    </div>

    <div v-if="selectedRoom" class="p-4 border-b border-[#e8e8e8] bg-white">
      <MessageProfile :selectedRoom="selectedRoom" :backToList="backToList" />
    </div>

    <div class="flex-1 overflow-y-auto p-5 space-y-4">
      <MessageList v-for="message in currentMessages" :key="message.id" :message="message" />
      <div v-if="!currentMessages.length" class="text-center text-gray-500 mt-8">
        No messages yet. Start the conversation!
      </div>
    </div>

    <div v-if="selectedRoom" class="p-4 border-t border-[#e8e8e8] bg-white">
      <MessageInput />
    </div>

    <div v-else class="flex-1 flex items-center justify-center text-gray-500">
      <p>Select a room to start chatting</p>
    </div>
  </main>
</template>
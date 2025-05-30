<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import { Button } from '@/components/ui/button'
import { X, SendHorizontal, Package } from 'lucide-vue-next'
import MessageInputProduct from './MessageInputProduct.vue'

const inputValue = ref('')
const chatStore = useChatStore()

const sendMessage = () => {
  if (inputValue.value.trim()) {
    const success = chatStore.sendMessage(inputValue.value.trim())
    if (success) {
      inputValue.value = ''
    }
  }
}

const clearInput = () => {
  inputValue.value = ''
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}
</script>

<template>
  <div class="flex items-center gap-3">
    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="Agent avatar"
      class="w-10 h-10 rounded-full" />

    <div class="flex-1 flex items-center gap-2">
      <div class="flex-1 relative">
        <input v-model="inputValue" type="text" placeholder="Start a new message" aria-label="Message input"
          @keypress="handleKeyPress"
          class="w-full py-3 pr-12 pl-4 border border-[#e8e8e8] bg-[#fbfbfd] placeholder:text-[#c4c4c4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21978b]" />
        <button v-if="inputValue" @click="clearInput" type="button" aria-label="Clear input"
          class="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-[#c4c4c4] hover:text-[#21978b]">
          <X class="w-4 h-4" />
        </button>
      </div>

      <MessageInputProduct>
        <Button size="sm" variant="ghost" class="h-10 w-10 p-0 text-[#4f5665] hover:text-[#21978b] hover:bg-[#f5f5f5]"
          aria-label="Send product">
          <Package class="w-4 h-4" />
        </Button>
      </MessageInputProduct>

      <Button @click="sendMessage" :disabled="!inputValue.trim()" size="sm"
        class="cursor-pointer flex justify-center items-center rounded-full bg-[#21978b] hover:bg-[#1a7a6f] disabled:opacity-50 disabled:cursor-not-allowed h-10 w-10 p-0">
        <SendHorizontal class="w-4 h-4 text-white" />
      </Button>
    </div>
  </div>
</template>
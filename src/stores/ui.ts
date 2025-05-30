import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
    const showChatView = ref(false)

    function toggleChatView(value?: boolean) {
        if (value !== undefined) {
            showChatView.value = value
        } else {
            showChatView.value = !showChatView.value
        }
    }

    return {
        showChatView,
        toggleChatView
    }
})
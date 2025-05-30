import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import chatDataJson from '@/data/chat_data.json'

export interface Participant {
  id: string
  name: string
  role: 0 | 1 | 2
}

export interface Room {
  name: string
  id: number
  image_url: string
  participant: Participant[]
}

export interface Comment {
  id: number
  type: string
  message: string
  sender: string
}

export interface ChatData {
  room: Room
  comments: Comment[]
}

export interface ProductMessage {
  name: string
  price: number
  image: string
}

export const useChatStore = defineStore('chat', () => {
  const chatResults = ref<ChatData[]>(chatDataJson.results as ChatData[])
  const selectedRoomId = ref<number | null>(null)
  const error = ref<string | null>(null)

  const rooms = computed(() =>
    chatResults.value.map(result => result.room)
  )

  const selectedRoom = computed(() =>
    selectedRoomId.value
      ? rooms.value.find((room) => room.id === selectedRoomId.value) || null
      : null
  )

  const currentMessages = computed(() => {
    if (!selectedRoomId.value) return []

    const chatData = chatResults.value.find(result => result.room.id === selectedRoomId.value)
    return chatData ? chatData.comments : []
  })

  const getMessagesByRoomId = computed(() => (roomId: number) => {
    const chatData = chatResults.value.find(result => result.room.id === roomId)
    return chatData ? chatData.comments : []
  })

  function selectRoom(roomId: number) {
    if (rooms.value.find((room) => room.id === roomId)) {
      selectedRoomId.value = roomId
      error.value = null
    } else {
      error.value = `Room with ID ${roomId} not found`
    }
  }

  function sendMessage(text: string, product?: ProductMessage) {
    if (!selectedRoomId.value) {
      error.value = 'No room selected'
      return false
    }

    if (!text.trim() && !product) {
      error.value = 'Message cannot be empty'
      return false
    }

    try {
      const newComment: Comment = {
        id: Date.now(),
        type: product ? 'product' : 'text',
        message: product ? text || product.name : text.trim(),
        sender: 'agent@mail.com'
      }

      const chatData = chatResults.value.find(result => result.room.id === selectedRoomId.value)
      if (chatData) {
        chatData.comments.push(newComment)
      }

      error.value = null
      return true
    } catch (err) {
      error.value = 'Failed to send message'
      return false
    }
  }

  return {
    rooms,
    selectedRoomId,
    error,
    selectedRoom,
    currentMessages,
    getMessagesByRoomId,
    selectRoom,
    sendMessage,
  }
})
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import roomsDataJson from '@/data/list_rooms.json'
import messageDataJson from '@/data/list_messages.json'

export interface Room {
  channel_id: number
  contact_id: number | null
  id: number
  is_calling: boolean
  is_handled_by_bot: boolean
  is_resolved: boolean
  is_waiting: boolean
  last_comment_sender: string
  last_comment_sender_type: string
  last_comment_text: string
  last_comment_timestamp: string
  last_customer_comment_text: string | null
  last_customer_timestamp: string
  name: string
  room_badge: string | null
  room_id: string
  room_type: string
  source: string
  user_avatar_url: string
  user_id: string
}

export interface ProductMessage {
  name: string
  price: number
  image: string
}

export interface Message {
  id: string
  room_id: string
  sender_id: string
  sender_type: string
  text: string
  timestamp: string
  type?: 'text' | 'product'
  product?: ProductMessage
}

export const useChatStore = defineStore('chat', () => {
  const rooms = ref<Room[]>(roomsDataJson.data.customer_rooms)
  const messageData: Record<string, Message[]> = messageDataJson as Record<string, Message[]>
  const mergedRoomsMessages = (() => {
    const merged: Record<string, Message[]> = {}

    Object.keys(messageData).forEach((roomId) => {
      merged[roomId] = [...messageData[roomId]]
    })

    rooms.value.forEach((room) => {
      const roomId = room.room_id

      if (!merged[roomId]) {
        merged[roomId] = []
      }

      const lastCommentExists = merged[roomId].some(
        (msg) =>
          msg.timestamp === room.last_comment_timestamp &&
          msg.sender_id === room.last_comment_sender &&
          msg.text === room.last_comment_text,
      )

      if (!lastCommentExists && room.last_comment_text) {
        const lastCommentMessage: Message = {
          id: `room-last-${roomId}`,
          room_id: roomId,
          sender_id: room.last_comment_sender,
          sender_type: room.last_comment_sender_type as 'customer' | 'agent' | 'system',
          text: room.last_comment_text,
          timestamp: room.last_comment_timestamp,
          type: 'text',
        }

        merged[roomId].push(lastCommentMessage)
      }

      merged[roomId].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      )
    })

    return merged
  })()

  const roomMessages = ref<Record<string, Message[]>>(mergedRoomsMessages)
  const selectedRoomId = ref<string | null>(null)
  const error = ref<string | null>(null)

  const selectedRoom = computed(() =>
    selectedRoomId.value
      ? rooms.value.find((room) => room.room_id === selectedRoomId.value) || null
      : null,
  )

  const currentMessages = computed(() =>
    selectedRoomId.value ? roomMessages.value[selectedRoomId.value] || [] : [],
  )

  const getMessagesByRoomId = computed(() => (roomId: string) => roomMessages.value[roomId] || [])

  function selectRoom(roomId: string) {
    if (rooms.value.find((room) => room.room_id === roomId)) {
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
      const newMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        room_id: selectedRoomId.value,
        sender_id: 'me',
        sender_type: 'agent',
        text: product ? text || product.name : text.trim(),
        timestamp: new Date().toISOString(),
        type: product ? 'product' : 'text',
        ...(product && { product }),
      }

      if (!roomMessages.value[selectedRoomId.value]) {
        roomMessages.value[selectedRoomId.value] = []
      }

      roomMessages.value[selectedRoomId.value].push(newMessage)
      updateRoomLastMessage(selectedRoomId.value, newMessage)

      error.value = null
      return true
    } catch (err) {
      error.value = 'Failed to send message'
      return false
    }
  }

  function updateRoomLastMessage(roomId: string, message: Message) {
    const room = rooms.value.find((r) => r.room_id === roomId)
    if (room) {
      room.last_comment_sender = 'agent@example.com'
      room.last_comment_sender_type = 'agent'
      room.last_comment_text = message.text
      room.last_comment_timestamp = message.timestamp
    }
  }

  return {
    rooms,
    roomMessages,
    selectedRoomId,
    error,
    selectedRoom,
    currentMessages,
    getMessagesByRoomId,
    selectRoom,
    sendMessage,
  }
})

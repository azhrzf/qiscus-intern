<script setup lang="ts">
import { ref } from 'vue'
import type { Room } from '@/stores/chat';
import { formatTimestamp } from '@/lib/utils';

interface MessageListProps {
    room: Room;
    selectedRoomId?: string;
}

defineProps<MessageListProps>();

const fallbackImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
const imageError = ref<Record<string, boolean>>({})

const handleImageError = (roomId: string) => {
    imageError.value[roomId] = true
}

const getImageSrc = (room: Room) => {
    if (imageError.value[room.room_id] || !room.user_avatar_url) {
        return fallbackImage
    }
    return room.user_avatar_url
}
</script>

<template>
    <div class="flex items-center gap-3 p-4">
        <img :src="getImageSrc(room)" :alt="room.name" @error="handleImageError(room.room_id)"
            class="w-10 h-10 rounded-full object-cover" />
        <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
                <p class="font-semibold text-[#141414]">{{ room.name }}</p>
                <span class="text-[#4f5665] text-xs">{{ formatTimestamp(room.last_comment_timestamp) }}</span>
            </div>
            <p class="text-[#4f5665] text-xs truncate">{{ room.last_comment_text }}</p>
        </div>
    </div>
</template>

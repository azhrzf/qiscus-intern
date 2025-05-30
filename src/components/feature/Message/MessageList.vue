<script setup lang="ts">
import { computed } from 'vue'
import type { Comment } from '@/stores/chat';

const props = defineProps<{
    message: Comment
}>();

const isAgentMessage = computed(() => {
    return props.message.sender.includes('agent')
})

const isCustomerMessage = computed(() => {
    return props.message.sender.includes('customer')
})

const isSystemMessage = computed(() => {
    return props.message.sender.includes('admin')
})
</script>

<template>
    <div class="flex w-full" :class="{
        'justify-start': isCustomerMessage,
        'justify-end': isAgentMessage,
        'justify-center': isSystemMessage
    }">
        <div class="rounded-2xl mb-1" :class="{
            'bg-[#f5f5f5] rounded-tl-md p-3 mr-10 lg:max-w-6/12': isCustomerMessage,
            'bg-[#21978b] rounded-tr-md p-3 ml-10 lg:max-w-6/12': isAgentMessage,
            'bg-[#f5f5f5] rounded-md p-2 mr-0 lg:max-w-5/12': isSystemMessage
        }">
            <p :class="{
                'text-[#141414] text-sm': isCustomerMessage,
                'text-white text-sm': isAgentMessage,
                'text-[#4f5665] text-xs': isSystemMessage
            }">{{ message.message }}</p>
        </div>
    </div>
</template>
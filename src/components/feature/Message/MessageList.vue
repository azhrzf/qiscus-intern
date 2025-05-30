<script setup lang="ts">
import { computed } from 'vue'
import { formatTimestamp } from '@/lib/utils';
import type { Message } from '@/stores/chat';

const props = defineProps<{
    message: Message
}>();

const fileUrl = computed(() => {
    if (!props.message.text.includes('[file]')) return null
    return props.message.text
        .replace('[file]', '')
        .replace('[/file]', '')
        .trim()
})

const isFileMessage = computed(() => {
    return props.message.text.includes('[file]') && props.message.text.includes('[/file]')
})

const isProductMessage = computed(() => {
    return props.message.type === 'product' && props.message.product
})

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(price)
}
</script>

<template>
    <div class="flex w-full" :class="{
        'justify-start': message.sender_type === 'customer' || !message.sender_type,
        'justify-end': message.sender_type === 'agent',
        'justify-center': message.sender_type === 'system'
    }">
        <div class="rounded-2xl mb-1" :class="{
            'bg-[#f5f5f5] rounded-tl-md p-3 mr-10 lg:max-w-6/12': message.sender_type === 'customer' || !message.sender_type,
            'bg-[#21978b] rounded-tr-md p-3 ml-10 lg:max-w-6/12': message.sender_type === 'agent',
            'bg-[#f5f5f5] rounded-md p-2 mr-0 lg:max-w-5/12': message.sender_type === 'system'
        }">
            <!-- Product Message -->
            <div v-if="isProductMessage && message.product">
                <img :src="message.product.image" :alt="message.product.name"
                    class="w-full h-auto mb-2 rounded-md max-w-xs object-cover" />
                <h4 class="font-semibold mb-1" :class="{
                    'text-[#141414]': message.sender_type === 'customer' || !message.sender_type,
                    'text-white': message.sender_type === 'agent',
                    'text-[#4f5665]': message.sender_type === 'system'
                }">{{ message.product.name }}</h4>
                <p class="text-sm font-medium" :class="{
                    'text-[#21978b]': message.sender_type === 'customer' || !message.sender_type,
                    'text-white': message.sender_type === 'agent',
                    'text-[#4f5665]': message.sender_type === 'system'
                }">{{ formatPrice(message.product.price) }}</p>
            </div>

            <div v-else-if="isFileMessage && fileUrl">
                <img :src="fileUrl" alt="File Attachment" class="w-full h-auto mb-2 rounded-md max-w-xs" />
                <p class="text-xs opacity-75" :class="{
                    'text-[#141414]': message.sender_type === 'customer' || !message.sender_type,
                    'text-white': message.sender_type === 'agent',
                    'text-[#4f5665]': message.sender_type === 'system'
                }">File attachment</p>
            </div>

            <p v-else :class="{
                'text-[#141414] text-sm': message.sender_type === 'customer' || !message.sender_type,
                'text-white text-sm': message.sender_type === 'agent',
                'text-[#4f5665] text-xs': message.sender_type === 'system'
            }">{{ message.text }}</p>

            <span v-if="message.sender_type !== 'system'" class="text-[10px] block mt-1" :class="{
                'text-[#141414]': message.sender_type === 'customer' || !message.sender_type,
                'text-white': message.sender_type === 'agent'
            }">
                {{ formatTimestamp(message.timestamp) }}
            </span>
        </div>
    </div>
</template>
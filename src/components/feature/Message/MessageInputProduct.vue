<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'
import type { ProductMessage } from '@/stores/chat'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import productData from '@/data/list_products.json'

const chatStore = useChatStore()
const { error } = storeToRefs(chatStore)

const isOpen = ref(false)
const products = ref(productData.data.products)

const sendProduct = (product: ProductMessage) => {
    const success = chatStore.sendMessage(`[product] ${product.name} [/product]`, product)
    if (success) {
        isOpen.value = false
    }
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(price)
}
</script>

<template>
    <Dialog v-model:open="isOpen">
        <DialogTrigger as-child>
            <slot />
        </DialogTrigger>
        <DialogContent class="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Select Product</DialogTitle>
                <DialogDescription>
                    Choose a product to share with the customer.
                </DialogDescription>
            </DialogHeader>

            <div v-if="error" class="p-3 bg-red-100 border border-red-200 rounded-md mb-4">
                {{ error }}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div v-for="product in products" :key="product.name"
                    class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <img :src="product.image" :alt="product.name" class="w-full h-48 object-cover" />
                    <div class="p-4">
                        <h3 class="font-semibold text-lg mb-2">{{ product.name }}</h3>
                        <p class="text-lg font-bold text-[#21978b] mb-3">
                            {{ formatPrice(product.price) }}
                        </p>
                        <Button @click="sendProduct(product)" class="w-full bg-[#21978b] hover:bg-[#1a7a6f]">
                            Send Product
                        </Button>
                    </div>
                </div>
            </div>
            <div v-if="products.length === 0" class="text-center py-8 text-gray-500">
                <p>No products available at the moment.</p>
            </div>
            <DialogFooter>
                <Button variant="outline" @click="isOpen = false">
                    Cancel
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

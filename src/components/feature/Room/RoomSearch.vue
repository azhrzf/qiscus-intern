<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-vue-next'

const searchInput = defineModel<string>({ default: '' })

const clearSearch = () => {
    searchInput.value = ''
}
</script>

<template>
    <div class="relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4f5665] w-4 h-4" />
        <Input v-model="searchInput" placeholder="Search people or message"
            class="pl-10 pr-10 bg-white border-[#e8e8e8] text-[#4f5665] placeholder:text-[#c4c4c4]" />
        <button v-if="searchInput" @click="clearSearch" type="button"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4f5665] hover:text-[#21978b] cursor-pointer">
            <X class="w-4 h-4" />
        </button>
    </div>
</template>
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MessagePanelView from '@/views/MessagePanelView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/chat/:roomId',
      name: 'chatRoom',
      component: MessagePanelView,
      props: true,
    },
  ],
})

export default router

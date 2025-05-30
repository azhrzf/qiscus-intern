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
      path: '/chat/:roomId(\\d+)',
      name: 'chatRoom',
      component: MessagePanelView,
      props: route => ({ roomId: parseInt(route.params.roomId as string) }),
    },
  ],
})

export default router
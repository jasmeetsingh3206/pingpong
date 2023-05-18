import { createRouter, createWebHashHistory } from 'vue-router'
import startingPage from '@/components/startingPage.vue'
import mainGame from '@/components/mainGame.vue'
import gameOver from '@/components/gameOver.vue'
import gameLose from '@/components/gameLose.vue'

const routes = [
  {
    path: '/',
    name: 'StartingPage',
    component: startingPage
  },
  {
    path: '/game',
    name: 'Game',
    component: mainGame
  },
  {
    path:'/gameover',
    name:'Gameover',
    component:gameOver

  },
  {
    path:'/gamelose',
    name:'GameLose',
    component:gameLose

  } 

]
const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export default router

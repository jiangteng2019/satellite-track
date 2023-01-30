import { createRouter, createWebHistory } from 'vue-router'
import SatelliteTrack from '../views/satellite-track/SatelliteTrack.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: SatelliteTrack
		},
		// {
		// 	path: '/about',
		// 	name: 'about',
		// 	component: () => import('../views/AboutView.vue')
		// }
	]
})

export default router

import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import BasicRequestView from '@/views/BasicRequestView.vue';
import AuthView from '@/views/AuthView.vue';
import UploadView from '@/views/UploadView.vue';
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/basic', name: 'basic', component: BasicRequestView },
        { path: '/auth', name: 'auth', component: AuthView },
        { path: '/upload', name: 'upload', component: UploadView },
    ],
});
export default router;

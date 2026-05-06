import { defineStore } from 'pinia';
export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('fbp_access_token') ?? '',
        username: '',
    }),
    actions: {
        setToken(token) {
            this.token = token;
            localStorage.setItem('fbp_access_token', token);
        },
        logout() {
            this.token = '';
            this.username = '';
            localStorage.removeItem('fbp_access_token');
        },
    },
});

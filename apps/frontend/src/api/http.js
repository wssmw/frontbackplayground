import axios from 'axios';
export const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
    timeout: 10_000,
});
http.interceptors.request.use((config) => {
    const token = localStorage.getItem('fbp_access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
http.interceptors.response.use((response) => response.data, (error) => {
    const message = error.response?.data?.message ?? error.message ?? '请求失败';
    return Promise.reject(new Error(message));
});
export function getHealth() {
    return http.get('/health');
}
export function getBasicEcho(params) {
    return http.get('/basic/echo', { params });
}
export function postBasicEcho(body) {
    return http.post('/basic/echo', body);
}
export function login(data) {
    return http.post('/auth/login', data);
}
export function getProfile() {
    return http.get('/auth/profile');
}

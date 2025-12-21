import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/$/, "");

const api = axios.create({
    baseURL: API_BASE,
});
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;

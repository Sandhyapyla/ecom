import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL: API_BASE,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("token");
  }
}

// Initialize token from storage if present
const existing = localStorage.getItem("token");
if (existing) setAuthToken(existing);

export const AuthAPI = {
  signup: (email, password) => api.post("/auth/signup", { email, password }),
  login: (email, password) => api.post("/auth/login", { email, password }),
};

export const ItemsAPI = {
  list: (params) => api.get("/items", { params }),
  get: (id) => api.get(`/items/${id}`),
};

export const CartAPI = {
  list: () => api.get("/cart"),
  add: (itemId, quantity = 1) => api.post("/cart/add", { itemId, quantity }),
  remove: (itemId, quantity) => api.post("/cart/remove", { itemId, quantity }),
  clear: () => api.post("/cart/clear"),
};

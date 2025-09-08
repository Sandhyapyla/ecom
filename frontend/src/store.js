import { CartAPI, setAuthToken } from "@/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: ({ user, token }) => {
        setAuthToken(token);
        set({ user, token });
      },
      logout: () => {
        setAuthToken(null);
        set({ user: null, token: null });
      },
    }),
    { name: "auth" }
  )
);

export const useCartStore = create((set) => ({
  items: [], // [{ itemId, quantity, item }]
  setItems: (items) => set({ items }),
  syncFromServer: async () => {
    const { data } = await CartAPI.list();
    set({ items: data.items || [] });
  },
  add: async (itemId, qty = 1) => {
    await CartAPI.add(itemId, qty);
    const { data } = await CartAPI.list();
    set({ items: data.items || [] });
  },
  remove: async (itemId, qty) => {
    await CartAPI.remove(itemId, qty);
    const { data } = await CartAPI.list();
    set({ items: data.items || [] });
  },
  clear: async () => {
    await CartAPI.clear();
    set({ items: [] });
  },
}));

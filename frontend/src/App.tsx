import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { LoginPage, SignupPage } from "@/pages/Auth";
import CartPage from "@/pages/Cart";
import ItemsPage from "@/pages/Items";
import { useAuthStore, useCartStore } from "@/store";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-6">
          <InitSync />
          <Routes>
            <Route path="/" element={<Navigate to="/items" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/items" element={<ItemsPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;

function InitSync() {
  const syncFromServer = useCartStore((s) => s.syncFromServer);
  const token = useAuthStore((s) => s.token);
  useEffect(() => {
    if (token) syncFromServer();
  }, [token]);
  return null;
}

import { useAuthStore, useCartStore } from "@/store";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, c) => sum + c.quantity, 0);
  const navigate = useNavigate();

  return (
    <header className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">
          eCom
        </Link>
        <input id="nav-toggle" type="checkbox" className="hidden peer" />
        <label
          htmlFor="nav-toggle"
          className="md:hidden cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </label>
        <nav className="flex items-center gap-4 max-md:absolute max-md:left-0 max-md:right-0 max-md:top-full max-md:bg-background max-md:border-t max-md:hidden peer-checked:max-md:flex max-md:flex-col max-md:p-4">
          <Link to="/items">Items</Link>
          <Link to="/cart">Cart ({count})</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate("/items");
                }}
                className="underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

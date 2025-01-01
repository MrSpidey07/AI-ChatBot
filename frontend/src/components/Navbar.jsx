import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Menu } from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            {/* Drawer trigger button for mobile/tablet */}
            <label htmlFor="my-drawer" className="btn btn-ghost lg:hidden">
              <Menu className="size-6" />
            </label>

            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <img src="/eliora.png" alt="Eliora" className="w-28 h-18" />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {authUser && (
              <button
                className="btn btn-ghost btn-sm flex gap-2 items-center"
                onClick={logout}
              >
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

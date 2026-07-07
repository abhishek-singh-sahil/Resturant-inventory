import {
  LogOut,
  UserCircle2,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#e3e3e9] bg-[#FDFCFA]/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left */}

        <div className="flex items-center gap-4">

          {/* Mobile Hamburger */}

          <button
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
            className="rounded-xl p-2 text-[#012A36] transition hover:bg-[#EAEDF0] lg:hidden"
          >
            {sidebarOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

          <div>
            <h1 className="text-xl font-bold text-[#012A36]">
              Restaurant Inventory
            </h1>

            <p className="text-xs text-[#747293]">
              Store & Kitchen Management
            </p>
          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-4">

          <div className="hidden items-center gap-3 rounded-2xl bg-[#FAF5EF] px-4 py-2 sm:flex">

            <UserCircle2
              size={36}
              className="text-[#012A36]"
            />

            <div>

              <h3 className="font-semibold text-[#012A36]">
                {user?.name || "Admin"}
              </h3>

              <p className="text-xs capitalize text-[#747293]">
                {user?.role || "Admin"}
              </p>

            </div>

          </div>

          <button
            onClick={logout}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-600 transition hover:scale-105"
          >
            <LogOut size={20} />
          </button>

        </div>

      </div>
    </header>
  );
};

export default Navbar;
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  Store,
  ShoppingCart,
  Warehouse,
  ChefHat,
  FileBarChart2,
  X,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Items",
    path: "/items",
    icon: Boxes,
  },
  {
    title: "Vendors",
    path: "/vendors",
    icon: Store,
  },
  {
    title: "Purchase",
    path: "/purchase",
    icon: ShoppingCart,
  },
  {
    title: "Store",
    path: "/store",
    icon: Warehouse,
  },
  {
    title: "Kitchen",
    path: "/kitchen",
    icon: ChefHat,
  },
  {
    title: "Reports",
    path: "/reports",
    icon: FileBarChart2,
  },
];

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  return (
    <>
      {/* ================= Mobile Backdrop ================= */}

      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          sidebarOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* ================= Sidebar ================= */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col justify-between border-r border-[#e3e3e9] bg-[#FAF5EF] shadow-2xl transition-transform duration-300 lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100vh-64px)] lg:translate-x-0 lg:shadow-none

        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Top */}

        <div className="p-5">

          {/* Mobile Header */}

          <div className="mb-6 flex items-center justify-between lg:hidden">

            <div>

              <h2 className="text-lg font-bold text-[#012A36]">
                Menu
              </h2>

              <p className="text-xs text-[#747293]">
                Restaurant Inventory
              </p>

            </div>

            <button
              onClick={() =>
                setSidebarOpen(false)
              }
              className="rounded-xl p-2 transition hover:bg-[#EAEDF0]"
            >
              <X size={22} />
            </button>

          </div>

          {/* Desktop Title */}

          <h2 className="mb-6 hidden text-xs font-semibold uppercase tracking-[0.25em] text-[#747293] lg:block">
            Navigation
          </h2>

          {/* Navigation */}

          <nav className="space-y-2">

            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() =>
                    setSidebarOpen(false)
                  }
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#012A36] text-white shadow-lg"
                        : "text-[#5F313B] hover:bg-[#EAEDF0]"
                    }`
                  }
                >
                  <Icon size={20} />

                  <span>{item.title}</span>
                </NavLink>
              );
            })}

          </nav>

        </div>

        {/* Bottom */}

        <div className="p-5">

          <div className="rounded-2xl bg-[#012A36] p-5">

            <h3 className="text-lg font-bold text-white">
              Restaurant Inventory
            </h3>

            <p className="mt-2 text-sm text-gray-300">
              Store & Kitchen Management
            </p>

          </div>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;
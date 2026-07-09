import {
  LogOut,
  UserCircle2,
  Menu,
  X,
  KeyRound,
  ChevronDown,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import ChangePasswordModal from "./ChangePasswordModal";

const Navbar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [openMenu, setOpenMenu] =
    useState(false);

  const [openPasswordModal, setOpenPasswordModal] =
    useState(false);

  const menuRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpenMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <>
      <ChangePasswordModal
        open={openPasswordModal}
        onClose={() =>
          setOpenPasswordModal(false)
        }
      />

      <header className="sticky top-0 z-50 border-b border-[#e3e3e9] bg-[#FDFCFA]/90 backdrop-blur-md">

        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Left */}

          <div className="flex items-center gap-4">

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

          <div
            className="relative"
            ref={menuRef}
          >

            <button
              onClick={() =>
                setOpenMenu(!openMenu)
              }
              className="flex items-center gap-3 rounded-2xl bg-[#FAF5EF] px-4 py-2 transition hover:bg-[#F2ECE4]"
            >

              <UserCircle2
                size={38}
                className="text-[#012A36]"
              />

              <div className="hidden text-left sm:block">

                <h3 className="font-semibold text-[#012A36]">

                  {user?.name}

                </h3>

                <p className="text-xs capitalize text-[#747293]">

                  {user?.role}

                </p>

              </div>

              <ChevronDown
                size={18}
                className={`transition ${
                  openMenu
                    ? "rotate-180"
                    : ""
                }`}
              />

            </button>

            {openMenu && (

              <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl">

                <div className="border-b border-[#F1F1F1] p-4">

                  <h3 className="font-semibold text-[#012A36]">

                    {user?.name}

                  </h3>

                  <p className="text-sm text-[#747293]">

                    {user?.email}

                  </p>

                </div>

                <button
                  onClick={() => {
                    setOpenMenu(false);
                    setOpenPasswordModal(true);
                  }}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-[#F8FAFC]"
                >

                  <KeyRound
                    size={20}
                    className="text-[#012A36]"
                  />

                  Change Password

                </button>

                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left text-red-600 transition hover:bg-red-50"
                >

                  <LogOut size={20} />

                  Logout

                </button>

              </div>

            )}

          </div>

        </div>

      </header>
    </>
  );
};

export default Navbar;
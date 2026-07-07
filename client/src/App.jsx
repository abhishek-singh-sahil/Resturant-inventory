import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import Vendors from "./pages/Vendors";
import Purchase from "./pages/Purchase";
import Store from "./pages/Store";
import Kitchen from "./pages/Kitchen";
import Reports from "./pages/Reports";

function Layout() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#FDFCFA] text-[#012A36]">

      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex">

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/items" element={<Items />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/store" element={<Store />} />
            <Route path="/kitchen" element={<Kitchen />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>

      </div>

    </div>
  );
}

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {token ? (
        <Route path="/*" element={<Layout />} />
      ) : (
        <>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />
        </>
      )}
    </Routes>
  );
}

export default App;
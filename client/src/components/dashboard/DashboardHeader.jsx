import { LayoutDashboard } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#012A36] text-white shadow-lg">
            <LayoutDashboard size={28} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-[#012A36]">
              Dashboard
            </h1>

            <p className="mt-1 text-[#747293]">
              Restaurant Inventory Overview
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4 shadow-sm">
        <p className="text-xs uppercase tracking-wider text-[#747293]">
          System Status
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-500"></span>

          <span className="font-semibold text-green-700">
            Online
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
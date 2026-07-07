import { useEffect, useMemo, useState } from "react";

import {
  Warehouse,
  ChefHat,
  ShoppingCart,
  ArrowRightLeft,
  Search,
} from "lucide-react";

import DataTable from "../components/DataTable";

import {
  getStoreReport,
  getKitchenReport,
  getPurchaseReport,
  getTransferReport,
  getConsumptionReport,
} from "../services/api";

const tabs = [
  {
    id: "store",
    label: "Store",
    icon: Warehouse,
  },
  {
    id: "kitchen",
    label: "Kitchen",
    icon: ChefHat,
  },
  {
    id: "purchase",
    label: "Purchase",
    icon: ShoppingCart,
  },
  {
    id: "transfer",
    label: "Transfer",
    icon: ArrowRightLeft,
  },
  {
    id: "consumption",
    label: "Consumption",
    icon: ChefHat,
  },
];

const Reports = () => {
  const [activeTab, setActiveTab] =
    useState("store");

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [rows, setRows] = useState([]);

  const loadReport = async () => {
    try {
      setLoading(true);

      let response;

      switch (activeTab) {
        case "store":
          response =
            await getStoreReport();
          setRows(response.data.report || []);
          break;

        case "kitchen":
          response =
            await getKitchenReport();
          setRows(response.data.report || []);
          break;

        case "purchase":
          response =
            await getPurchaseReport();
          setRows(
            response.data.purchases || []
          );
          break;

        case "transfer":
          response =
            await getTransferReport();
          setRows(
            response.data.transfers || []
          );
          break;

        case "consumption":
          response =
            await getConsumptionReport();
          setRows(
            response.data.consumptions ||
              []
          );
          break;

        default:
          setRows([]);
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to load report."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [activeTab]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const item =
        row.item?.name ||
        row.name ||
        "";

      return item
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [rows, search]);

  const columns = useMemo(() => {
    switch (activeTab) {
      case "store":
        return [
          {
            key: "item",
            header: "Item",
            render: (row) =>
              row.item?.name,
          },
          {
            key: "opening",
            header: "Opening",
          },
          {
            key: "purchased",
            header: "Purchased",
          },
          {
            key: "transferred",
            header: "Transferred",
          },
          {
            key: "closing",
            header: "Closing",
          },
        ];

      case "kitchen":
        return [
          {
            key: "item",
            header: "Item",
            render: (row) =>
              row.item?.name,
          },
          {
            key: "opening",
            header: "Opening",
          },
          {
            key: "received",
            header: "Received",
          },
          {
            key: "consumed",
            header: "Consumed",
          },
          {
            key: "closing",
            header: "Closing",
          },
        ];

      case "purchase":
        return [
          {
            key: "item",
            header: "Item",
            render: (row) =>
              row.item?.name,
          },
          {
            key: "vendor",
            header: "Vendor",
            render: (row) =>
              row.vendor?.name,
          },
          {
            key: "quantity",
            header: "Quantity",
          },
          {
            key: "rate",
            header: "Rate",
          },
          {
            key: "totalAmount",
            header: "Amount",
          },
        ];

      case "transfer":
        return [
          {
            key: "item",
            header: "Item",
            render: (row) =>
              row.item?.name,
          },
          {
            key: "quantity",
            header: "Transferred",
          },
          {
            key: "remarks",
            header: "Remarks",
          },
        ];

      case "consumption":
        return [
          {
            key: "item",
            header: "Item",
            render: (row) =>
              row.item?.name,
          },
          {
            key: "quantity",
            header: "Consumed",
          },
          {
            key: "remarks",
            header: "Remarks",
          },
        ];

      default:
        return [];
    }
  }, [activeTab]);
    return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-[#012A36]">
          Reports
        </h1>

        <p className="mt-2 text-[#747293]">
          View Store, Kitchen, Purchase, Transfer and Consumption Reports.
        </p>
      </div>

      {/* Tabs */}

      <div className="overflow-x-auto rounded-3xl border border-[#E5E7EB] bg-white p-2 shadow-sm">

        <div className="flex min-w-max gap-2">

          {tabs.map((tab) => {

            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id)
                }
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[#012A36] text-white"
                    : "text-[#012A36] hover:bg-[#F4F6F8]"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );

          })}

        </div>

      </div>

      {/* Search */}

      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm">

        <div className="relative">

          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#747293]"
          />

          <input
            type="text"
            placeholder="Search Item..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="h-12 w-full rounded-2xl border border-[#D7D7DF] pl-12 pr-4 outline-none focus:border-[#012A36]"
          />

        </div>

      </div>

      {/* Table */}

      <DataTable
        columns={columns}
        data={filteredRows}
        emptyMessage={
          loading
            ? "Loading Report..."
            : "No Data Available."
        }
      />

    </div>
  );
};

export default Reports;
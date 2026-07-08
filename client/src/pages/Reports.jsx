import { useEffect, useMemo, useState } from "react";

import {
  Warehouse,
  ChefHat,
  ShoppingCart,
  ArrowRightLeft,
  Search,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

import DataTable from "../components/DataTable";
import DateSelector from "../components/DateSelector";

import {
  getStoreReport,
  getKitchenReport,
  getPurchaseReport,
  getTransferReport,
  getConsumptionReport,
  getPurchaseByCategory,
  getConsumptionByCategory,
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

  const [rows, setRows] =
    useState([]);

  const [selectedDate, setSelectedDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [showByCategory, setShowByCategory] =
    useState(false);

  /* ==========================================
                LOAD REPORT
  ========================================== */

  const loadReport = async () => {
    try {
      setLoading(true);

      let response;

      switch (activeTab) {
        case "store":
          response =
            await getStoreReport(
              selectedDate
            );

          setRows(
            response.data.report || []
          );
          break;

        case "kitchen":
          response =
            await getKitchenReport(
              selectedDate
            );

          setRows(
            response.data.report || []
          );
          break;

        case "purchase":
          if (showByCategory) {
            response =
              await getPurchaseByCategory(
                selectedDate
              );
            setRows(
              response.data.report || []
            );
          } else {
            response =
              await getPurchaseReport(
                selectedDate
              );
            setRows(
              response.data.purchases ||
                []
            );
          }
          break;

        case "transfer":
          response =
            await getTransferReport(
              selectedDate
            );

          setRows(
            response.data.transfers ||
              []
          );
          break;

        case "consumption":
          if (showByCategory) {
            response =
              await getConsumptionByCategory(
                selectedDate
              );
            setRows(
              response.data.report || []
            );
          } else {
            response =
              await getConsumptionReport(
                selectedDate
              );
            setRows(
              response.data.consumptions ||
                []
            );
          }
          break;

        default:
          setRows([]);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to load report."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [activeTab, selectedDate, showByCategory]);

  /* ==========================================
                FILTERED DATA
  ========================================== */

  const filteredRows = useMemo(() => {
    if (showByCategory && ["purchase", "consumption"].includes(activeTab)) {
      // For category view, search in category name
      return rows.filter((row) => {
        return row.category
          ? row.category
              .toLowerCase()
              .includes(search.toLowerCase())
          : row.items?.some((item) =>
              item.item?.name
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                )
            );
      });
    }

    return rows.filter((row) => {
      const item =
        row.item?.name ||
        row.name ||
        "";

      return item
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [rows, search, showByCategory, activeTab]);

  /* ==========================================
                  TOTALS
  ========================================== */

  const purchaseTotal = useMemo(() => {
    if (showByCategory && activeTab === "purchase") {
      return filteredRows.reduce(
        (sum, row) =>
          sum +
          Number(row.totalAmount || 0),
        0
      );
    }
    return filteredRows.reduce(
      (sum, row) =>
        sum +
        Number(row.totalAmount || 0),
      0
    );
  }, [filteredRows, showByCategory, activeTab]);

  const consumptionTotal =
    useMemo(() => {
      if (showByCategory && activeTab === "consumption") {
        return filteredRows.reduce(
          (sum, row) =>
            sum +
            Number(row.totalCost || 0),
          0
        );
      }
      return filteredRows.reduce(
        (sum, row) =>
          sum +
          Number(row.cost || 0),
        0
      );
    }, [filteredRows, showByCategory, activeTab]);

  /* ==========================================
                TABLE DATA
  ========================================== */

  const tableData = useMemo(() => {
    const data = [...filteredRows];

    if (
      activeTab === "purchase" &&
      !showByCategory
    ) {
      data.push({
        isTotal: true,
        item: {
          name: "TOTAL",
        },
      });
    }

    if (
      activeTab === "consumption" &&
      !showByCategory
    ) {
      data.push({
        isTotal: true,
        item: {
          name: "TOTAL",
        },
      });
    }

    if (
      (activeTab === "purchase" ||
        activeTab === "consumption") &&
      showByCategory
    ) {
      data.push({
        isTotal: true,
        category: "TOTAL",
      });
    }

    return data;
  }, [
    filteredRows,
    activeTab,
    showByCategory,
  ]);

  /* ==========================================
                FORMAT TIME
  ========================================== */

  const formatTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* ==========================================
                COLUMNS
  ========================================== */

  const columns = useMemo(() => {
    if (
      (activeTab === "purchase" ||
        activeTab === "consumption") &&
      showByCategory
    ) {
      // Category-wise columns
      if (activeTab === "purchase") {
        return [
          {
            key: "category",
            header: "Category",
            render: (row) =>
              row.isTotal ? (
                <span className="font-bold text-[#012A36]">
                  TOTAL
                </span>
              ) : (
                <span className="font-medium">
                  {row.category}
                </span>
              ),
          },
          {
            key: "items",
            header: "Item Count",
            render: (row) =>
              row.isTotal
                ? "-"
                : row.items?.length || 0,
          },
          {
            key: "totalQuantity",
            header: "Total Quantity",
            render: (row) =>
              row.isTotal
                ? "-"
                : row.totalQuantity || 0,
          },
          {
            key: "totalAmount",
            header: "Total Amount",
            render: (row) =>
              row.isTotal ? (
                <span className="font-bold text-green-700">
                  ₹
                  {purchaseTotal.toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </span>
              ) : (
                `₹${Number(
                  row.totalAmount || 0
                ).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                  }
                )}`
              ),
          },
        ];
      } else {
        // Consumption by category with FIFO
        return [
          {
            key: "category",
            header: "Category",
            render: (row) =>
              row.isTotal ? (
                <span className="font-bold text-[#012A36]">
                  TOTAL
                </span>
              ) : (
                <span className="font-medium">
                  {row.category}
                </span>
              ),
          },
          {
            key: "items",
            header: "Item Count",
            render: (row) =>
              row.isTotal
                ? "-"
                : row.items?.length || 0,
          },
          {
            key: "totalConsumed",
            header: "Total Consumed (Qty)",
            render: (row) =>
              row.isTotal
                ? "-"
                : row.totalConsumed || 0,
          },
          {
            key: "totalCost",
            header: "Total FIFO Cost (₹)",
            render: (row) =>
              row.isTotal ? (
                <span className="font-bold text-red-700">
                  ₹
                  {consumptionTotal.toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </span>
              ) : (
                `₹${Number(
                  row.totalCost || 0
                ).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                  }
                )}`
              ),
          },
        ];
      }
    }

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
              row.isTotal ? (
                <span className="font-bold text-[#012A36]">
                  TOTAL
                </span>
              ) : (
                row.item?.name
              ),
          },
          {
            key: "vendor",
            header: "Vendor",
            render: (row) =>
              row.isTotal
                ? "-"
                : row.vendor?.name,
          },
          {
            key: "quantity",
            header: "Qty",
            render: (row) =>
              row.isTotal
                ? "-"
                : row.quantity,
          },
          {
            key: "rate",
            header: "Rate",
            render: (row) =>
              row.isTotal
                ? "-"
                : `₹${Number(
                    row.rate || 0
                  ).toFixed(2)}`,
          },
          {
            key: "totalAmount",
            header: "Amount",
            render: (row) =>
              row.isTotal ? (
                <span className="font-bold text-green-700">
                  ₹
                  {purchaseTotal.toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </span>
              ) : (
                `₹${Number(
                  row.totalAmount || 0
                ).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                  }
                )}`
              ),
          },
          {
            key: "time",
            header: "Time",
            render: (row) =>
              row.isTotal
                ? "-"
                : formatTime(
                    row.purchaseDate
                  ),
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
            key: "transferred",
            header: "Transferred",
          },
          {
            key: "closing",
            header: "Closing",
          },
        ];

      case "consumption":
        return [
          {
            key: "item",
            header: "Item",
            render: (row) =>
              row.isTotal ? (
                <span className="font-bold text-[#012A36]">
                  TOTAL
                </span>
              ) : (
                row.item?.name
              ),
          },
          {
            key: "consumed",
            header: "Consumed (Qty)",
            render: (row) =>
              row.isTotal
                ? "-"
                : row.consumed,
          },
          {
            key: "rate",
            header: "FIFO Rate (₹)",
            render: (row) =>
              row.isTotal
                ? "-"
                : `₹${Number(
                    row.rate || 0
                  ).toFixed(2)}`,
          },
          {
            key: "cost",
            header: "FIFO Cost (₹)",
            render: (row) =>
              row.isTotal ? (
                <span className="font-bold text-red-700">
                  ₹
                  {consumptionTotal.toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </span>
              ) : (
                `₹${Number(
                  row.cost || 0
                ).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                  }
                )}`
              ),
          },
        ];

      default:
        return [];
    }
  }, [
    activeTab,
    purchaseTotal,
    consumptionTotal,
    showByCategory,
  ]);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* ===================== HEADER ===================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#012A36] sm:text-3xl">
            Reports
          </h1>

          <p className="mt-2 text-sm text-[#747293] sm:text-base">
            View Store, Kitchen, Purchase,
            Transfer and Consumption Reports.
          </p>
        </div>
      </div>

      {/* ===================== TABS ===================== */}

      <div className="overflow-x-auto rounded-3xl border border-[#E5E7EB] bg-white p-2 shadow-sm">
        <div className="flex min-w-max gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSearch("");
                  setShowByCategory(false);
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 lg:px-5 ${
                  activeTab === tab.id
                    ? "bg-[#012A36] text-white shadow-md"
                    : "text-[#012A36] hover:bg-[#F4F6F8]"
                }`}
              >
                <Icon size={18} />

                <span className="whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================== DATE SELECTOR ===================== */}

      {[
        "purchase",
        "transfer",
        "consumption",
      ].includes(activeTab) && (
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
          <DateSelector
            selectedDate={selectedDate}
            onChange={setSelectedDate}
          />
        </div>
      )}

      {/* ===================== CATEGORY VIEW TOGGLE ===================== */}

      {["purchase", "consumption"].includes(
        activeTab
      ) && (
        <div className="flex items-center gap-3 rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
          <Eye size={20} className="text-[#747293]" />

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showByCategory}
              onChange={(e) =>
                setShowByCategory(
                  e.target.checked
                )
              }
              className="h-5 w-5 rounded border-[#c7c7d4] text-[#012A36] focus:ring-[#012A36]"
            />

            <span className="font-medium text-[#012A36]">
              Show by Category
            </span>
          </label>
        </div>
      )}

      {/* ===================== SEARCH ===================== */}

      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#747293]"
          />

          <input
            type="text"
            placeholder={
              showByCategory &&
              ["purchase", "consumption"].includes(
                activeTab
              )
                ? "Search Category..."
                : "Search Item..."
            }
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="h-12 w-full rounded-2xl border border-[#D7D7DF] pl-12 pr-4 text-sm outline-none transition-all duration-300 focus:border-[#012A36] sm:text-base"
          />
        </div>
      </div>

      {/* ===================== TABLE ===================== */}

      <DataTable
        columns={columns}
        data={tableData}
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

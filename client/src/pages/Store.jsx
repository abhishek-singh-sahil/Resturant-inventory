import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Package,
  Search,
} from "lucide-react";

import DataTable from "../components/DataTable";

import {
  getStoreItems,
  transferToKitchen,
} from "../services/api";

const Store = () => {
  const [inventory, setInventory] = useState([]);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState({});

  const loadInventory = async () => {
    try {
      setLoading(true);

      const { data } = await getStoreItems();

      setInventory(data.items || []);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to load store inventory."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [inventory, search]);

  const toggleSelect = (id) => {
    setSelected((prev) => ({
      ...prev,
      [id]: prev[id]
        ? undefined
        : {
            quantity: "",
            remarks: "",
          },
    }));
  };

  const updateTransfer = (
    id,
    field,
    value
  ) => {
    setSelected((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleTransfer = async () => {
    const transfers = Object.entries(
      selected
    )
      .filter(([_, value]) => value)
      .map(([itemId, value]) => ({
        itemId,
        quantity: Number(value.quantity),
        remarks: value.remarks,
      }))
      .filter(
        (item) =>
          item.quantity &&
          item.quantity > 0
      );

    if (!transfers.length) {
      return alert(
        "Please enter transfer quantity."
      );
    }

    try {
      setSaving(true);

      await transferToKitchen({
        transfers,
      });

      alert(
        "Items transferred successfully."
      );

      setSelected({});

      loadInventory();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Transfer failed."
      );
    } finally {
      setSaving(false);
    }
  };
    const columns = [
    {
      key: "select",
      header: "",
      render: (row) => (
        <input
          type="checkbox"
          checked={!!selected[row._id]}
          onChange={() => toggleSelect(row._id)}
          className="h-5 w-5 accent-[#012A36]"
        />
      ),
    },

    {
      key: "item",
      header: "Item",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Package
            size={18}
            className="text-[#012A36]"
          />

          <div>
            <p className="font-semibold text-[#012A36]">
              {row.name}
            </p>

            <p className="text-xs text-[#747293]">
              {row.unit}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "opening",
      header: "Opening",
      render: (row) => (
        <span className="font-medium">
          {row.opening} {row.unit}
        </span>
      ),
    },

    {
      key: "purchased",
      header: "Purchased",
      render: (row) => (
        <span className="font-medium text-green-700">
          + {row.purchased} {row.unit}
        </span>
      ),
    },

    {
      key: "transfer",
      header: "Transfer",
      render: (row) =>
        selected[row._id] ? (
          <input
            type="number"
            min="0"
            max={row.closing}
            value={selected[row._id].quantity}
            onChange={(e) =>
              updateTransfer(
                row._id,
                "quantity",
                e.target.value
              )
            }
            className="h-11 w-24 rounded-xl border border-[#d7d7df] px-3 outline-none focus:border-[#012A36]"
          />
        ) : (
          <span className="text-[#b1b1bc]">
            --
          </span>
        ),
    },

    {
      key: "closing",
      header: "Closing",
      render: (row) => {
        const entered =
          Number(
            selected[row._id]?.quantity || 0
          );

        const closing =
          row.closing - entered;

        return (
          <span
            className={`font-bold ${
              closing <= row.lowStockLimit
                ? "text-red-600"
                : "text-[#012A36]"
            }`}
          >
            {closing < 0 ? 0 : closing}{" "}
            {row.unit}
          </span>
        );
      },
    },

    {
      key: "remarks",
      header: "Remarks",
      render: (row) =>
        selected[row._id] ? (
          <input
            type="text"
            value={selected[row._id].remarks}
            onChange={(e) =>
              updateTransfer(
                row._id,
                "remarks",
                e.target.value
              )
            }
            placeholder="Optional"
            className="h-11 w-48 rounded-xl border border-[#d7d7df] px-3 outline-none focus:border-[#012A36]"
          />
        ) : (
          <span className="text-[#b1b1bc]">
            --
          </span>
        ),
    },
  ];
    return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-[#012A36]">
            Store Inventory
          </h1>

          <p className="mt-2 text-[#747293]">
            Daily Store Opening, Purchase, Transfer and Closing Stock
          </p>
        </div>

        <button
          onClick={handleTransfer}
          disabled={saving}
          className="flex items-center gap-2 rounded-2xl bg-[#012A36] px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-[#5F313B] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowRight size={20} />

          {saving
            ? "Saving..."
            : "Transfer to Kitchen"}
        </button>
      </div>

      {/* Summary */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <p className="text-sm text-[#747293]">
            Opening Stock
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#012A36]">
            {inventory.reduce(
              (sum, item) => sum + item.opening,
              0
            )}
          </h2>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <p className="text-sm text-[#747293]">
            Purchased Today
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {inventory.reduce(
              (sum, item) => sum + item.purchased,
              0
            )}
          </h2>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <p className="text-sm text-[#747293]">
            Transferred
          </p>

          <h2 className="mt-2 text-3xl font-bold text-orange-600">
            {inventory.reduce(
              (sum, item) => sum + item.transferred,
              0
            )}
          </h2>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <p className="text-sm text-[#747293]">
            Closing Stock
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#012A36]">
            {inventory.reduce(
              (sum, item) => sum + item.closing,
              0
            )}
          </h2>
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
            className="h-12 w-full rounded-2xl border border-[#d7d7df] pl-12 pr-4 outline-none focus:border-[#012A36]"
          />

        </div>

      </div>

      {/* Inventory Table */}

      <DataTable
        columns={columns}
        data={filteredInventory}
        emptyMessage={
          loading
            ? "Loading Store Inventory..."
            : "No Items Found."
        }
      />

    </div>
  );
  };

export default Store;
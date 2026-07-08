import { useEffect, useMemo, useState } from "react";
import {
  Package,
  Search,
  Edit2,
  Check,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import DataTable from "../components/DataTable";

import {
  getStoreItems,
  updateStoreClosing,
} from "../services/api";

const Store = () => {
  const [inventory, setInventory] = useState([]);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [editClosing, setEditClosing] = useState("");

  const loadInventory = async () => {
    try {
      setLoading(true);

      const { data } = await getStoreItems();

      setInventory(data.items || []);
    } catch (err) {
      toast.error(
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

  const handleEditClosing = (row) => {
    setEditingId(row._id);
    setEditClosing(row.closing.toString());
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditClosing("");
  };

  const handleSaveClosing = async (itemId, row) => {
    const newClosing = Number(editClosing);

    if (isNaN(newClosing) || newClosing < 0) {
      toast.error("Invalid closing value.");
      return;
    }

    const available = row.opening + row.purchased;
    if (newClosing > available) {
      toast.error(
        `Closing cannot exceed available stock (${available} ${row.unit})`
      );
      return;
    }

    try {
      setSaving(true);

      await updateStoreClosing(itemId, {
        closing: newClosing,
      });

      toast.success("Closing weight updated successfully.");

      setEditingId(null);
      setEditClosing("");

      loadInventory();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to update closing value."
      );
    } finally {
      setSaving(false);
    }
  };
  const columns = [
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
      key: "available",
      header: "Available",
      render: (row) => {
        const available = row.opening + row.purchased;
        return (
          <span className="font-semibold text-[#012A36]">
            {available} {row.unit}
          </span>
        );
      },
    },

    {
      key: "closing",
      header: "Closing (Edit Weight)",
      render: (row) =>
        editingId === row._id ? (
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              value={editClosing}
              onChange={(e) =>
                setEditClosing(e.target.value)
              }
              className="h-11 w-24 rounded-xl border border-[#012A36] px-3 outline-none"
              disabled={saving}
            />
            <button
              onClick={() =>
                handleSaveClosing(row._id, row)
              }
              disabled={saving}
              className="rounded-lg bg-green-600 p-2 text-white hover:bg-green-700 disabled:opacity-50"
            >
              <Check size={18} />
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={saving}
              className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700 disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <span
              className={`font-bold ${
                row.closing <=
                row.lowStockLimit
                  ? "text-red-600"
                  : "text-[#012A36]"
              }`}
            >
              {row.closing} {row.unit}
            </span>
            <button
              onClick={() => handleEditClosing(row)}
              className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
            >
              <Edit2 size={16} />
            </button>
          </div>
        ),
    },

    {
      key: "transfer",
      header: "Transfer to Kitchen",
      render: (row) => {
        const transferred =
          row.opening +
          row.purchased -
          row.closing;

        return (
          <span className="font-semibold text-orange-600">
            {Math.max(0, transferred)} {row.unit}
          </span>
        );
      },
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
            Record store closing weight by editing the Closing column. Transfer to kitchen is calculated automatically.
          </p>
        </div>

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
            {inventory.reduce((sum, item) => {
              const transferred =
                item.opening +
                item.purchased -
                item.closing;
              return sum + Math.max(0, transferred);
            }, 0)}
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
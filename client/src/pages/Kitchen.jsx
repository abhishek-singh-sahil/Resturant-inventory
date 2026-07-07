import { useEffect, useMemo, useState } from "react";
import {
  ChefHat,
  Save,
  Search,
} from "lucide-react";

import DataTable from "../components/DataTable";

import {
  getKitchenItems,
  saveConsumption,
} from "../services/api";

const Kitchen = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  // Temporary consumption entered by chef
  const [consumption, setConsumption] = useState({});

  const loadKitchen = async () => {
    try {
      setLoading(true);

      const { data } = await getKitchenItems();

      setInventory(data.items || []);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to load kitchen inventory."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKitchen();
  }, []);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [inventory, search]);

  const handleConsumption = (
    id,
    field,
    value
  ) => {
    setConsumption((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    const consumptions = Object.entries(consumption)
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

    if (!consumptions.length) {
      return alert(
        "Please enter consumption."
      );
    }

    try {
      setSaving(true);

      await saveConsumption({
        consumptions,
      });

      // Reload latest kitchen inventory
      await loadKitchen();

      // Clear input boxes for next consumption entry
      setConsumption({});

      alert(
        "Consumption saved successfully."
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to save consumption."
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
          <ChefHat
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
      key: "received",
      header: "Received",
      render: (row) => (
        <span className="font-medium text-green-700">
          + {row.received} {row.unit}
        </span>
      ),
    },

    // NEW ENTRY ONLY
    {
      key: "consumed",
      header: "Consume Now",
      render: (row) => (
        <input
          type="number"
          min="0"
          max={row.closing}
          value={
            consumption[row._id]?.quantity || ""
          }
          onChange={(e) =>
            handleConsumption(
              row._id,
              "quantity",
              e.target.value
            )
          }
          className="h-11 w-24 rounded-xl border border-[#d7d7df] px-3 outline-none focus:border-[#012A36]"
        />
      ),
    },

    // TOTAL CONSUMED TODAY
    {
      key: "totalConsumed",
      header: "Consumed Today",
      render: (row) => (
        <span className="font-semibold text-orange-600">
          {row.consumed} {row.unit}
        </span>
      ),
    },

    {
      key: "closing",
      header: "Closing",
      render: (row) => {
        const newConsumption = Number(
          consumption[row._id]?.quantity || 0
        );

        const closing =
          row.opening +
          row.received -
          row.consumed -
          newConsumption;

        return (
          <span
            className={`font-bold ${
              closing <= 0
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
      render: (row) => (
        <input
          type="text"
          value={
            consumption[row._id]?.remarks || ""
          }
          onChange={(e) =>
            handleConsumption(
              row._id,
              "remarks",
              e.target.value
            )
          }
          placeholder="Optional"
          className="h-11 w-56 rounded-xl border border-[#d7d7df] px-3 outline-none focus:border-[#012A36]"
        />
      ),
    },
  ];
    return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-[#012A36]">
            Kitchen Inventory
          </h1>

          <p className="mt-2 text-[#747293]">
            Track today's kitchen opening stock, received stock,
            total consumed and remaining closing stock.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-2xl bg-[#012A36] px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-[#5F313B] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? "Saving..." : "Save Consumption"}
        </button>

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

        {/* Opening */}

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

          <p className="text-sm text-[#747293]">
            Opening Stock
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#012A36]">
            {inventory.reduce(
              (sum, row) =>
                sum + Number(row.opening),
              0
            )}
          </h2>

        </div>

        {/* Received */}

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

          <p className="text-sm text-[#747293]">
            Received Today
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {inventory.reduce(
              (sum, row) =>
                sum + Number(row.received),
              0
            )}
          </h2>

        </div>

        {/* Consumed */}

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

          <p className="text-sm text-[#747293]">
            Consumed Today
          </p>

          <h2 className="mt-2 text-3xl font-bold text-orange-600">

            {inventory.reduce((sum, row) => {

              const currentEntry = Number(
                consumption[row._id]?.quantity || 0
              );

              return (
                sum +
                row.consumed +
                currentEntry
              );

            }, 0)}

          </h2>

        </div>

        {/* Closing */}

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

          <p className="text-sm text-[#747293]">
            Closing Stock
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#012A36]">

            {inventory.reduce((sum, row) => {

              const currentEntry = Number(
                consumption[row._id]?.quantity || 0
              );

              const closing =
                row.opening +
                row.received -
                row.consumed -
                currentEntry;

              return sum + closing;

            }, 0)}

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

      {/* Table */}

      <DataTable
        columns={columns}
        data={filteredInventory}
        emptyMessage={
          loading
            ? "Loading Kitchen Inventory..."
            : "No Kitchen Items Found."
        }
      />

    </div>
  );
};

export default Kitchen;
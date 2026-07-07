import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Search,
} from "lucide-react";

import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";

import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "../services/api";

const initialForm = {
  name: "",
  unit: "Kg",
  lowStockLimit: "",
};

const Items = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(initialForm);

  const loadItems = async () => {
    try {
      setLoading(true);

      const { data } = await getItems();

      setItems(data.items || []);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to load items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id);

    setFormData({
      name: item.name,
      unit: item.unit,
      lowStockLimit: item.lowStockLimit,
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (editingId) {
        await updateItem(editingId, formData);
      } else {
        await createItem(formData);
      }

      closeModal();
      loadItems();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Delete this item?"
    );

    if (!ok) return;

    try {
      await deleteItem(id);
      loadItems();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  const columns = [
    {
      key: "name",
      header: "Item",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#012A36]/10 p-2">
            <Package
              size={18}
              className="text-[#012A36]"
            />
          </div>

          <span className="font-medium text-[#012A36]">
            {row.name}
          </span>
        </div>
      ),
    },

    {
      key: "unit",
      header: "Unit",
    },

    {
      key: "lowStockLimit",
      header: "Low Stock",
    },

    {
      key: "action",
      header: "Action",
      render: (row) => (
        <div className="flex gap-3">
          <button
            onClick={() => openEditModal(row)}
            className="rounded-xl bg-blue-100 p-2 text-blue-700 transition hover:scale-105"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => handleDelete(row._id)}
            className="rounded-xl bg-red-100 p-2 text-red-700 transition hover:scale-105"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#012A36]">
            Items
          </h1>

          <p className="mt-2 text-sm text-[#747293]">
            Manage inventory items.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-2xl bg-[#012A36] px-6 py-3 font-semibold text-white transition hover:bg-[#5F313B]"
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      <div className="rounded-3xl border border-[#e3e3e9] bg-[#FDFCFA] p-5 shadow-sm">
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
            className="h-12 w-full rounded-2xl border border-[#c7c7d4] bg-white pl-12 pr-4 outline-none focus:border-[#012A36]"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredItems}
        emptyMessage={
          loading
            ? "Loading..."
            : "No Items Found."
        }
      />

      <FormModal
        isOpen={modalOpen}
        onClose={closeModal}
        title={
          editingId ? "Edit Item" : "Add Item"
        }
        onSubmit={handleSubmit}
        submitText={
          editingId ? "Update" : "Save"
        }
        loading={saving}
      >
        <div className="space-y-5">
          <div>
            <label className="mb-2 block font-medium text-[#5F313B]">
              Item Name
            </label>

            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-[#c7c7d4] px-4 outline-none focus:border-[#012A36]"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-[#5F313B]">
              Unit
            </label>

            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-[#c7c7d4] px-4 outline-none focus:border-[#012A36]"
            >
              <option>Kg</option>
              <option>Gram</option>
              <option>Litre</option>
              <option>Ml</option>
              <option>Piece</option>
              <option>Packet</option>
              <option>Dozen</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium text-[#5F313B]">
              Low Stock Limit
            </label>

            <input
              type="number"
              min="0"
              name="lowStockLimit"
              value={formData.lowStockLimit}
              onChange={handleChange}
              className="h-12 w-full rounded-2xl border border-[#c7c7d4] px-4 outline-none focus:border-[#012A36]"
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default Items;
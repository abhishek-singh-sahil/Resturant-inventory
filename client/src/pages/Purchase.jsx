import { useEffect, useMemo, useState } from "react";
import { useBusinessDay } from "../context/BusinessDayContext";
import { toBusinessDateString } from "../utils/date";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ShoppingCart,
} from "lucide-react";

import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";

import {
  getPurchases,
  createPurchase,
  updatePurchase,
  deletePurchase,
  getItems,
  getVendors,
} from "../services/api";

const Purchase = () => {
  const { businessDate } = useBusinessDay();

const getInitialForm = () => ({
  item: "",
  vendor: "",
  quantity: "",
  rate: "",
  invoiceNo: "",
  purchaseDate: businessDate
    ? toBusinessDateString(businessDate)
    : "",
  remarks: "",
});
  const [purchases, setPurchases] = useState([]);
  const [items, setItems] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(
  getInitialForm()
);

  const loadData = async () => {
    try {
      setLoading(true);

      const [purchaseRes, itemRes, vendorRes] =
        await Promise.all([
          getPurchases(),
          getItems(),
          getVendors(),
        ]);

      setPurchases(purchaseRes.data.purchases || []);
      setItems(itemRes.data.items || []);
      setVendors(vendorRes.data.vendors || []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
  if (!editingId) {
    setFormData((prev) => ({
      ...prev,
      purchaseDate: businessDate
        ? toBusinessDateString(businessDate)
        : "",
    }));
  }
}, [businessDate, editingId]);

  const filteredPurchases = useMemo(() => {
    return purchases.filter((purchase) =>
      purchase.item?.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [purchases, search]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(getInitialForm());
    setModalOpen(true);
  };

  const openEditModal = (purchase) => {
    setEditingId(purchase._id);

    setFormData({
      item: purchase.item._id,
      vendor: purchase.vendor._id,
      quantity: purchase.quantity,
      rate: purchase.rate,
      invoiceNo: purchase.invoiceNo,
      purchaseDate: purchase.purchaseDate.slice(0, 10),
      remarks: purchase.remarks,
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingId(null);
    setFormData(getInitialForm());
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (editingId) {
        await updatePurchase(editingId, formData);
      } else {
        await createPurchase(formData);
      }

      closeModal();
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this purchase?")) return;

    try {
      await deletePurchase(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  const columns = [
    {
      key: "item",
      header: "Item",
      render: (row) => (
        <div className="flex items-center gap-3">
          <ShoppingCart
            size={18}
            className="text-[#012A36]"
          />
          <span className="font-medium text-[#012A36]">
            {row.item?.name}
          </span>
        </div>
      ),
    },
    {
      key: "vendor",
      header: "Vendor",
      render: (row) => row.vendor?.name,
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (row) =>
        `${row.quantity} ${row.item?.unit}`,
    },
    {
      key: "rate",
      header: "Rate",
      render: (row) => `₹${row.rate}`,
    },
    {
      key: "totalAmount",
      header: "Amount",
      render: (row) => `₹${row.totalAmount}`,
    },
    {
      key: "action",
      header: "Action",
      render: (row) => (
        <div className="flex gap-3">
          <button
            onClick={() => openEditModal(row)}
            className="rounded-xl bg-blue-100 p-2 text-blue-700"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => handleDelete(row._id)}
            className="rounded-xl bg-red-100 p-2 text-red-700"
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
            Purchases
          </h1>

          <p className="mt-2 text-sm text-[#747293]">
            Manage purchase entries.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-2xl bg-[#012A36] px-6 py-3 font-semibold text-white"
        >
          <Plus size={20} />
          Add Purchase
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
            placeholder="Search Purchase..."
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
        data={filteredPurchases}
        emptyMessage={
          loading
            ? "Loading..."
            : "No Purchase Found."
        }
      />

      <FormModal
        isOpen={modalOpen}
        onClose={closeModal}
        title={
          editingId
            ? "Edit Purchase"
            : "Add Purchase"
        }
        onSubmit={handleSubmit}
        submitText={
          editingId ? "Update" : "Save"
        }
        loading={saving}
        width="max-w-2xl"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <select
            name="item"
            value={formData.item}
            onChange={handleChange}
            required
            className="h-12 rounded-2xl border border-[#c7c7d4] px-4"
          >
            <option value="">Select Item</option>

            {items.map((item) => (
              <option
                key={item._id}
                value={item._id}
              >
                {item.name}
              </option>
            ))}
          </select>

          <select
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
            required
            className="h-12 rounded-2xl border border-[#c7c7d4] px-4"
          >
            <option value="">Select Vendor</option>

            {vendors.map((vendor) => (
              <option
                key={vendor._id}
                value={vendor._id}
              >
                {vendor.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="h-12 rounded-2xl border border-[#c7c7d4] px-4"
          />

          <input
            type="number"
            name="rate"
            placeholder="Rate"
            value={formData.rate}
            onChange={handleChange}
            required
            className="h-12 rounded-2xl border border-[#c7c7d4] px-4"
          />

          <input
            type="text"
            name="invoiceNo"
            placeholder="Invoice No"
            value={formData.invoiceNo}
            onChange={handleChange}
            className="h-12 rounded-2xl border border-[#c7c7d4] px-4"
          />

          <input
            type="date"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            className="h-12 rounded-2xl border border-[#c7c7d4] px-4"
          />

          <textarea
            rows={3}
            name="remarks"
            placeholder="Remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="md:col-span-2 rounded-2xl border border-[#c7c7d4] p-4"
          />
        </div>
      </FormModal>
    </div>
  );
};

export default Purchase;
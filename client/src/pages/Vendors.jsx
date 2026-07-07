import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Store,
  Phone,
  Search,
} from "lucide-react";

import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";

import {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../services/api";

const initialForm = {
  name: "",
  phone: "",
  address: "",
  gstNumber: "",
};

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(initialForm);

  const loadVendors = async () => {
    try {
      setLoading(true);

      const { data } = await getVendors();

      setVendors(data.vendors || []);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to load vendors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) =>
      vendor.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [vendors, search]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (vendor) => {
    setEditingId(vendor._id);

    setFormData({
      name: vendor.name,
      phone: vendor.phone,
      address: vendor.address,
      gstNumber: vendor.gstNumber,
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (editingId) {
        await updateVendor(editingId, formData);
      } else {
        await createVendor(formData);
      }

      closeModal();
      loadVendors();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vendor?")) return;

    try {
      await deleteVendor(id);
      loadVendors();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  const columns = [
    {
      key: "name",
      header: "Vendor",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#012A36]/10 p-2">
            <Store
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
      key: "phone",
      header: "Phone",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Phone size={16} />
          {row.phone || "-"}
        </div>
      ),
    },
    {
      key: "gstNumber",
      header: "GST",
      render: (row) => row.gstNumber || "-",
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
            Vendors
          </h1>

          <p className="mt-2 text-sm text-[#747293]">
            Manage all suppliers.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-2xl bg-[#012A36] px-6 py-3 font-semibold text-white transition hover:bg-[#5F313B]"
        >
          <Plus size={20} />
          Add Vendor
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
            placeholder="Search Vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-2xl border border-[#c7c7d4] bg-white pl-12 pr-4 outline-none focus:border-[#012A36]"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredVendors}
        emptyMessage={
          loading
            ? "Loading..."
            : "No Vendors Found."
        }
      />

      <FormModal
        isOpen={modalOpen}
        onClose={closeModal}
        title={
          editingId
            ? "Edit Vendor"
            : "Add Vendor"
        }
        onSubmit={handleSubmit}
        submitText={
          editingId ? "Update" : "Save"
        }
        loading={saving}
      >
        <div className="space-y-5">
          <input
            type="text"
            name="name"
            required
            placeholder="Vendor Name"
            value={formData.name}
            onChange={handleChange}
            className="h-12 w-full rounded-2xl border border-[#c7c7d4] px-4 outline-none focus:border-[#012A36]"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="h-12 w-full rounded-2xl border border-[#c7c7d4] px-4 outline-none focus:border-[#012A36]"
          />

          <input
            type="text"
            name="gstNumber"
            placeholder="GST Number"
            value={formData.gstNumber}
            onChange={handleChange}
            className="h-12 w-full rounded-2xl border border-[#c7c7d4] px-4 outline-none focus:border-[#012A36]"
          />

          <textarea
            rows={3}
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full rounded-2xl border border-[#c7c7d4] p-4 outline-none focus:border-[#012A36]"
          />
        </div>
      </FormModal>
    </div>
  );
};

export default Vendors;
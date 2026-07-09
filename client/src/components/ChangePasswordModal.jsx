import { useState } from "react";
import {
  Eye,
  EyeOff,
  KeyRound,
  Lock,
} from "lucide-react";

import { changePassword } from "../services/api";

/* -------------------------------------------------------------------------- */
/*                              PASSWORD INPUT                                */
/* -------------------------------------------------------------------------- */

const PasswordInput = ({
  label,
  name,
  value,
  visible,
  onChange,
  onToggle,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#012A36]">
        {label}
      </label>

      <div className="relative">
        <Lock
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#747293]"
        />

        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete="off"
          required
          className="h-12 w-full rounded-2xl border border-[#D8DCE3] bg-white pl-12 pr-12 outline-none transition-all duration-200 focus:border-[#012A36] focus:ring-2 focus:ring-[#012A36]/10"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#747293] hover:text-[#012A36]"
        >
          {visible ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                          CHANGE PASSWORD MODAL                             */
/* -------------------------------------------------------------------------- */

const ChangePasswordModal = ({
  open,
  onClose,
}) => {
  const [loading, setLoading] =
    useState(false);

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePassword = (field) => {
    setShow((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const clearForm = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShow({
      current: false,
      new: false,
      confirm: false,
    });
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      alert(
        "New Password and Confirm Password do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const { data } =
        await changePassword(formData);

      alert(data.message);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center gap-4 border-b border-[#ECECEC] px-7 py-6">

          <div className="rounded-2xl bg-[#012A36] p-3 text-white">
            <KeyRound size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#012A36]">
              Change Password
            </h2>

            <p className="mt-1 text-sm text-[#747293]">
              Update your account password
            </p>
          </div>

        </div>

        {/* Body */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-7"
        >

          <PasswordInput
            label="Current Password"
            name="currentPassword"
            value={
              formData.currentPassword
            }
            visible={show.current}
            onChange={handleChange}
            onToggle={() =>
              togglePassword("current")
            }
          />

          <PasswordInput
            label="New Password"
            name="newPassword"
            value={formData.newPassword}
            visible={show.new}
            onChange={handleChange}
            onToggle={() =>
              togglePassword("new")
            }
          />

          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={
              formData.confirmPassword
            }
            visible={show.confirm}
            onChange={handleChange}
            onToggle={() =>
              togglePassword("confirm")
            }
          />

          {/* Footer */}

          <div className="flex justify-end gap-4 pt-2">

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-2xl border border-[#D8DCE3] px-6 py-3 font-semibold text-[#012A36] transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-[#012A36] px-7 py-3 font-semibold text-white transition hover:bg-[#02475B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Changing..."
                : "Change Password"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default ChangePasswordModal;
import { AlertTriangle, Loader2 } from "lucide-react";

const ConfirmRolloverModal = ({
  open,
  loading,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="border-b border-gray-100 p-7">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">

              <AlertTriangle
                size={28}
                className="text-red-600"
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-[#012A36]">
                Start Next Business Day
              </h2>

              <p className="mt-1 text-sm text-[#747293]">
                Please confirm before continuing.
              </p>

            </div>

          </div>

        </div>

        {/* Body */}

        <div className="space-y-5 p-7">

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">

            <p className="font-semibold text-amber-800">
              This action will:
            </p>

            <ul className="mt-4 space-y-3 text-sm text-amber-700">

              <li>
                ✅ Close today's Store Inventory
              </li>

              <li>
                ✅ Close today's Kitchen Inventory
              </li>

              <li>
                ✅ Create inventory for the next business day
              </li>

              <li>
                ✅ Carry forward closing stock as opening stock
              </li>

            </ul>

          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

            <p className="font-semibold text-red-700">
              Important
            </p>

            <p className="mt-2 text-sm text-red-600">
              This operation cannot be undone.
              Make sure all entries for today are
              completed before continuing.
            </p>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-4 border-t border-gray-100 p-6">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-2xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-3 rounded-2xl bg-[#012A36] px-7 py-3 font-semibold text-white transition hover:bg-[#01445A] disabled:opacity-60"
          >
            {loading && (
              <Loader2
                size={18}
                className="animate-spin"
              />
            )}

            {loading
              ? "Starting..."
              : "Start Next Day"}

          </button>

        </div>

      </div>

    </div>
  );
};

export default ConfirmRolloverModal;
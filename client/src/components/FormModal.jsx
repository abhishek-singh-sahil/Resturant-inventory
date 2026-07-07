import Modal from "./Modal";

const FormModal = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  submitText = "Save",
  cancelText = "Cancel",
  loading = false,
  width = "max-w-lg",
  children,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width={width}
    >
      <form onSubmit={onSubmit} className="space-y-6">
        {children}

        <div className="flex justify-end gap-3 border-t border-[#e3e3e9] pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-[#c7c7d4] px-5 py-2.5 font-medium text-[#5F313B] transition hover:bg-[#EAEDF0]"
          >
            {cancelText}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-[#012A36] px-6 py-2.5 font-semibold text-white transition hover:bg-[#5F313B] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Please Wait..." : submitText}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FormModal;
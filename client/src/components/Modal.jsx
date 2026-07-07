const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  width = "max-w-lg",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        className={`w-full ${width} rounded-3xl bg-[#FDFCFA] shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b border-[#e3e3e9] px-6 py-4">
          <h2 className="text-lg font-bold text-[#012A36]">{title}</h2>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-xl font-semibold text-[#5F313B] transition hover:bg-[#EAEDF0]"
          >
            ×
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
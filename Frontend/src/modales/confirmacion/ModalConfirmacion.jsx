import React from "react";

const ModalConfirmacion = ({
  isOpen,
  title = "Confirmar acción",
  message = "¿Estás seguro?",
  onConfirm,
  onCancel,
  confirmText = "Sí, confirmar",
  cancelText = "Cancelar",
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all">
      <div className="bg-[#232b3b] rounded-xl shadow-2xl max-w-md w-full mx-4 animate-fadeIn scale-100">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-100 mb-2">{title}</h3>
          <p className="text-gray-300 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-md border border-gray-500 text-gray-300 hover:bg-gray-700 transition"
              disabled={loading}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-md bg-[#E60001] text-white font-semibold hover:bg-red-700 transition"
              disabled={loading}
            >
              {loading ? "Eliminando..." : confirmText}
            </button>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95);}
            to { opacity: 1; transform: scale(1);}
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease;
          }
        `}
      </style>
    </div>
  );
};

export default ModalConfirmacion;

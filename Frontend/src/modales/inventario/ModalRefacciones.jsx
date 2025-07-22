import React, { useState } from 'react';
import { X, Package, DollarSign } from 'lucide-react';
import { UsoToast } from '../../contexto/UsoToast';

const ModalRefacciones = ({ isOpen, onClose, onSubmit }) => {
  const { error } = UsoToast();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    cantidad: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateRefaccion = () => {
    // Validar precio no vacío y mayor a 0
    if (!formData.precio || Number(formData.precio) <= 0) {
      error('El precio debe ser mayor a 0');
      return false;
    }
    // Validar cantidad no vacía y mayor a 0
    if (!formData.cantidad || Number(formData.cantidad) < 1) {
      error('El stock debe ser al menos 1');
      return false;
    }
    // Validar nombre no vacío
    if (!formData.nombre?.trim()) {
      error('El nombre de la refacción es obligatorio');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateRefaccion()) return;
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 p-5 overflow-y-auto modal-blur hide-scrollbar">
      <div className="w-full max-w-lg mx-auto my-12 bg-[#1E2837] p-6 rounded-lg shadow-xl border border-gray-700 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors text-2xl"
          aria-label="Cerrar"
        >
          <X size={24} />
        </button>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
            <Package className="text-[#7152EC]" />
            Nueva Refacción
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nombre de la refacción *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                         focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Descripción *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                         focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Precio *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    className="w-full pl-10 p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Cantidad en existencia *
                </label>
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                           focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                  required
                  min="1"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#7152EC] text-white rounded-md hover:bg-purple-700 
                       transform transition-all duration-300 hover:scale-[1.02] flex items-center"
            >
              <Package className="mr-2" size={20} />
              Guardar Refacción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRefacciones;
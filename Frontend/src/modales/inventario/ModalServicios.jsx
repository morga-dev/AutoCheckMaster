import React, { useState, useEffect } from 'react';
import { Wrench, X, DollarSign } from 'lucide-react';
import { UsoToast } from '../../contexto/UsoToast';

const ModalServicios = ({ isOpen, onClose, onSubmit, servicioEditar }) => {
  const { error } = UsoToast();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
  });

  useEffect(() => {
    if (servicioEditar) {
      setFormData({
        nombre: servicioEditar.nombre,
        descripcion: servicioEditar.descripcion,
        precio: servicioEditar.precio.toString(),
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
      });
    }
  }, [servicioEditar, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Validar precio no vacío y mayor a 0
  const validateServicio = () => {
    if (!formData.precio || Number(formData.precio) <= 0) {
      error('El precio debe ser mayor a 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateServicio()) return;
    try {
      const servicioData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio)
      };
      if (onSubmit) {
        await onSubmit(servicioData);
      }
      if (onClose) onClose();
    } catch (error) {
      error(error.message || 'Error al crear el servicio');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 p-5 overflow-y-auto modal-blur hide-scrollbar">
      <div className="w-full max-w-lg mx-auto my-12 bg-[#1E2837] rounded-lg shadow-xl border border-gray-700 relative">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
            <Wrench className="text-[#7152EC]" />
            {servicioEditar ? 'Editar Servicio' : 'Nuevo Servicio'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors text-2xl"
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
        </div>
        {/* Formulario */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nombre del Servicio *
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
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                           focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                  placeholder="Descripción detallada del servicio..."
                />
              </div>
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
            </div>
            <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-700">
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
                         transform transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
              >
                <Wrench size={20} />
                {servicioEditar ? 'Guardar Cambios' : 'Crear Servicio'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalServicios;
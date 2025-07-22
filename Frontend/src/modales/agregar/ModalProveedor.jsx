import React, { useState } from 'react';
import { Truck, Building2, Receipt } from 'lucide-react';
import axios from 'axios';
import { UsoToast } from '../../contexto/UsoToast';

const ModalProveedor = ({ isOpen, onClose, onSubmit }) => {
  const { error } = UsoToast();

  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const [formData, setFormData] = useState({
    // Información General
    nombreEmpresa: '',
    rfc: '',
    telefonoContacto: '',
    email: '',
    direccion: '',
    nombreContacto: '',
    puestoContacto: '',
    tipo: 'Refacciones',
    // Historial de Compras
    fechaCompra: today.toISOString().split('T')[0],
    productoServicio: '',
    cantidad: '',
    costoTotal: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateProveedor = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      error('Formato de email inválido');
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.telefonoContacto)) {
      error('El teléfono debe tener 10 dígitos');
      return false;
    }

    if (!formData.nombreEmpresa?.trim()) {
      error('El nombre de la empresa es obligatorio');
      return false;
    }

    return true;
  };

  // ModalCliente.jsx
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateProveedor() && onSubmit) {
      onSubmit(formData);   // solo envío datos al padre
      onClose?.();
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 p-5 overflow-y-auto hide-scrollbar modal-blur">
      <div className="w-full max-w-3xl mx-auto my-12 bg-[#1E2837] rounded-lg shadow-xl border border-gray-700 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl"
          aria-label="Cerrar"
        >
          ×
        </button>
        <div className="bg-[#1E2837] rounded-lg shadow-xl border border-gray-700 p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">
            <Truck className="inline-block mr-2 text-[#7152EC]" />
            Registro de Proveedor
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información General del Proveedor */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1C64F1] flex items-center">
                <Building2 className="mr-2" />
                Información General del Proveedor
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre de la empresa/proveedor *
                  </label>
                  <input
                    type="text"
                    name="nombreEmpresa"
                    value={formData.nombreEmpresa}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    RFC (13 Caracteres)*
                  </label>
                  <input
                    type="text"
                    name="rfc"
                    value={formData.rfc}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                    maxLength="13"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Teléfono de contacto *
                  </label>
                  <input
                    type="tel"
                    name="telefonoContacto"
                    value={formData.telefonoContacto}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre del contacto *
                  </label>
                  <input
                    type="text"
                    name="nombreContacto"
                    value={formData.nombreContacto}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Puesto del contacto *
                  </label>
                  <input
                    type="text"
                    name="puestoContacto"
                    value={formData.puestoContacto}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Tipo de Proveedor *
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  >
                    <option value="Refacciones">Refacciones</option>
                    <option value="Herramientas">Herramientas</option>
                    <option value="Servicios">Servicios</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Historial de Compras */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#E60001] flex items-center">
                <Receipt className="mr-2" />
                Historial de Compras
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Fecha de la compra *
                  </label>
                  <input
                    type="date"
                    name="fechaCompra"
                    value={formData.fechaCompra}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent
                             [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Producto o servicio adquirido *
                  </label>
                  <input
                    type="text"
                    name="productoServicio"
                    value={formData.productoServicio}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Cantidad *
                  </label>
                  <input
                    type="number"
                    name="cantidad"
                    value={formData.cantidad}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Costo total *
                  </label>
                  <input
                    type="number"
                    name="costoTotal"
                    value={formData.costoTotal}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                    step="0.01"
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
                <Truck className="mr-2" size={20} />
                Registrar Proveedor
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalProveedor;
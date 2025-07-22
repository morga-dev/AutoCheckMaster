import React, { useState } from 'react';
import { User, MapPin, Car, Phone } from 'lucide-react';
import axios from 'axios';
import { UsoToast } from '../../contexto/UsoToast';

const initialFormData = {
  // Datos personales
  nombre: '',
  apellido: '',
  fecha_nacimiento: '',
  // Dirección
  colonia: '',
  calle: '',
  numero_casa: '',
  codigo_postal: '',
  // Contacto
  email: '',
  celular: '',
  telefono_casa: '',
  // Información del vehículo
  modelo: '',
  marca: '',
  placa: '',
  kilometraje: '',
  numero_serie: '',
  anio: ''
};

const ModalCliente = ({ isOpen, onClose, onSubmit }) => {
  const { error } = UsoToast();

  const [formData, setFormData] = useState(initialFormData);

  const [errorMessage, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'placa' || name === 'numero_serie') {
      newValue = value.toUpperCase();
    }
    setFormData(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  };

  const validateForm = () => {
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      error('El formato del correo electrónico no es válido');
      return false;
    }
    // Validar número de serie (17 caracteres exactos)
    if (formData.numero_serie && formData.numero_serie.length !== 17) {
      error('El número de serie debe tener exactamente 17 caracteres');
      return false;
    }
    // Validar código postal (5 caracteres exactos)
    if (formData.codigo_postal && formData.codigo_postal.length !== 5) {
      error('El código postal debe tener exactamente 5 caracteres');
      return false;
    }

    // Validar placa (7 caracteres exactos)
    if (formData.placa && formData.placa.length !== 7) {
      error('La placa debe tener exactamente 7 caracteres');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Si la validación falla, no enviar el formulario
    if (onSubmit) {
      onSubmit(formData);   // solo envío datos al padre
      setFormData(initialFormData); // Resetear formulario
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 p-5 overflow-y-auto modal-blur hide-scrollbar">
      <div className="w-full max-w-3xl mx-auto my-12 bg-[#1E2837] rounded-lg shadow-xl border border-gray-700 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl"
          aria-label="Cerrar"
        >
          ×
        </button>
        <div className="bg-[#1E2837] rounded-lg shadow-xl border border-gray-700 p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">Registro de Cliente</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos Personales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1C64F1] flex items-center">
                <User className="mr-2" size={20} />
                Datos Personales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre *
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
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent
                    [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert "
                  />
                </div>
              </div>
            </div>
            {/* Dirección */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#E60001] flex items-center">
                <MapPin className="mr-2" size={20} />
                Dirección
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Colonia *
                  </label>
                  <input
                    type="text"
                    name="colonia"
                    value={formData.colonia}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Calle *
                  </label>
                  <input
                    type="text"
                    name="calle"
                    value={formData.calle}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    N° de casa *
                  </label>
                  <input
                    type="text"
                    name="numero_casa"
                    value={formData.numero_casa}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Código Postal (5 dígitos)*
                  </label>
                  <input
                    type="text"
                    name="codigo_postal"
                    value={formData.codigo_postal}
                    onChange={handleChange}
                    minLength="5"
                    maxLength="5"
                    pattern="\d{5}"
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
            {/* Contacto */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#0E9E6E] flex items-center">
                <Phone className="mr-2" size={20} />
                Información de Contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Correo Electrónico *
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
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Número Celular*
                  </label>
                  <input
                    type="tel"
                    name="celular"
                    value={formData.celular}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Teléfono Casa
                  </label>
                  <input
                    type="tel"
                    name="telefono_casa"
                    value={formData.telefono_casa}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            {/* Información del Vehículo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#E60001] flex items-center">
                <Car className="mr-2" />
                Datos del Vehículo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Marca *</label>
                  <input
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Modelo *</label>
                  <input
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Placa (7 caracteres)*</label>
                  <input
                    type="text"
                    name="placa"
                    value={formData.placa}
                    onChange={handleChange}
                    minLength="7"
                    maxLength="7"
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">N. de Serie (17 caracteres)*</label>
                  <input
                    type="text"
                    name="numero_serie"
                    value={formData.numero_serie}
                    onChange={handleChange}
                    minLength="17"
                    maxLength="17"
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Año *</label>
                  <input
                    type="number"
                    name="anio"
                    value={formData.anio}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
                    required
                    min={1900}
                    max={2100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Kilometraje *</label>
                  <input
                    type="number"
                    name="kilometraje"
                    value={formData.kilometraje}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
                    required
                    min={0}
                  />
                </div>
              </div>
            </div>
            {/* Botones */}
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
                         transform transition-all duration-300 hover:scale-[1.02]"
              >
                Registrar Cliente
              </button>
            </div>
          </form>
          {/* Error message */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-900 bg-opacity-20 border-l-4 border-[#E60001] rounded">
              <p className="text-sm text-red-400">{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalCliente;
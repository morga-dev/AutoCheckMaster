import React, { useState, useEffect, useRef } from 'react';
import { DollarSign, FileText, User, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { UsoToast } from '../../contexto/UsoToast';

const initialFormData = {
  fecha: "",
  concepto: "",
  categoria: "",
  monto: "",
  metodoPago: "efectivo",
  estado: "completado",
  cliente: {
    tipo: "registrado",
    id: "",
    nombre: ""
  }
};

const ModalIngresos = ({ isOpen, onClose, onSubmit }) => {
  const { error } = UsoToast();

  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

  const [formData, setFormData] = useState(initialFormData);

  const [esClienteRegistrado, setEsClienteRegistrado] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [showClienteOptions, setShowClienteOptions] = useState(false);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const clienteInputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const fetchClientes = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/clientes');
          setClientes(response.data);
          setClientesFiltrados(response.data);
        } catch (error) {
          // Error
        }
      };
      fetchClientes();
    }
  }, [isOpen]);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowClienteOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClienteSearch = (e) => {
    const valor = e.target.value;
    setFormData(prev => ({
      ...prev,
      cliente: {
        ...prev.cliente,
        nombre: valor,
        id: '' // Limpiar ID si se está escribiendo
      }
    }));
    
    // Filtrar clientes basado en el texto ingresado
    if (valor.trim()) {
      const filtrados = clientes.filter(cliente =>
        `${cliente.nombre} ${cliente.apellido}`.toLowerCase().includes(valor.toLowerCase())
      );
      setClientesFiltrados(filtrados);
    } else {
      setClientesFiltrados(clientes);
    }
    
    setShowClienteOptions(true);
  };

  const handleClienteSelect = (cliente) => {
    setFormData(prev => ({
      ...prev,
      cliente: {
        tipo: 'registrado',
        id: cliente.id,
        nombre: `${cliente.nombre} ${cliente.apellido}`
      }
    }));
    setShowClienteOptions(false);
  };

  const handleDropdownToggle = () => {
    setShowClienteOptions(!showClienteOptions);
    if (!showClienteOptions) {
      setClientesFiltrados(clientes);
      setTimeout(() => {
        if (clienteInputRef.current) {
          clienteInputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleInputFocus = () => {
    setShowClienteOptions(true);
    if (clientesFiltrados.length === 0) {
      setClientesFiltrados(clientes);
    }
  };

  const handleTipoClienteChange = (esRegistrado) => {
    setFormData(prev => ({
      ...prev,
      cliente: {
        tipo: esRegistrado ? 'registrado' : 'no_registrado',
        id: '',
        nombre: ''
      }
    }));
    setEsClienteRegistrado(esRegistrado);
    setClientesFiltrados(clientes);
    setShowClienteOptions(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateIngreso = () => {
    if (!formData.monto || Number(formData.monto) <= 0) {
      error('El monto debe ser mayor a 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateIngreso()) return;
    try {
      const ingresoData = {
        fecha: formData.fecha,
        concepto: formData.concepto,
        categoria: formData.categoria,
        monto: Number(formData.monto),
        metodoPago: formData.metodoPago,
        estado: formData.estado,
        cliente: formData.cliente
      };

      if (onSubmit) {
        await onSubmit(ingresoData);
        setFormData(initialFormData); // Resetear formulario
      }
      if (onClose) onClose();
    } catch (error) {
      error('Error al registrar el ingreso');
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
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">
            <DollarSign className="inline-block mr-2 text-[#7152EC]" />
            Registro de Ingreso
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información del Servicio/Producto */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1C64F1] flex items-center">
                <FileText className="mr-2" size={20} />
                Información del Servicio/Producto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent
                             [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Categoría *
                  </label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="Servicio">Servicio</option>
                    <option value="Producto">Producto</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Descripción del servicio/concepto *
                  </label>
                  <textarea
                    name="concepto"
                    value={formData.concepto}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    placeholder="Detalle del servicio o producto..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Información del Cliente */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#E60001] flex items-center">
                <User className="mr-2" size={20} />
                Información del Cliente
              </h3>
              
              {/* Selector de tipo de cliente */}
              <div className="mb-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center text-gray-300">
                    <input
                      type="radio"
                      checked={esClienteRegistrado}
                      onChange={() => handleTipoClienteChange(true)}
                      className="mr-2 accent-[#7152EC]"
                    />
                    Cliente registrado
                  </label>
                  <label className="flex items-center text-gray-300">
                    <input
                      type="radio"
                      checked={!esClienteRegistrado}
                      onChange={() => handleTipoClienteChange(false)}
                      className="mr-2 accent-[#7152EC]"
                    />
                    Cliente no registrado
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {esClienteRegistrado ? (
                  <div className="relative md:col-span-2" ref={dropdownRef}>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Cliente *
                    </label>
                    <div className="relative">
                      <input
                        ref={clienteInputRef}
                        type="text"
                        name="cliente_nombre"
                        value={formData.cliente.nombre}
                        onChange={handleClienteSearch}
                        onFocus={handleInputFocus}
                        className="w-full p-2 pr-10 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                                 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                        placeholder="Escriba o seleccione un cliente..."
                        required
                      />
                      <button
                        type="button"
                        onClick={handleDropdownToggle}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                      >
                        <ChevronDown 
                          className={`h-5 w-5 transition-transform duration-200 ${
                            showClienteOptions ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                    </div>
                    
                    {showClienteOptions && clientesFiltrados.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-[#1E2837] border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {clientesFiltrados.map(cliente => (
                          <div
                            key={cliente.id}
                            className="p-3 hover:bg-[#00132e] cursor-pointer text-gray-200 border-b border-gray-700 last:border-b-0"
                            onClick={() => handleClienteSelect(cliente)}
                          >
                            <div className="font-medium">{`${cliente.nombre} ${cliente.apellido}`}</div>
                            <div className="text-sm text-gray-400">
                              {cliente.email} {cliente.celular && `• ${cliente.celular}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {showClienteOptions && clientesFiltrados.length === 0 && formData.cliente.nombre && (
                      <div className="absolute z-10 w-full mt-1 bg-[#1E2837] border border-gray-700 rounded-md shadow-lg p-3">
                        <div className="text-gray-400 text-sm">
                          No se encontraron clientes con "{formData.cliente.nombre}"
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Nombre del cliente *
                    </label>
                    <input
                      type="text"
                      name="cliente_nombre"
                      value={formData.cliente.nombre}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        cliente: {
                          ...prev.cliente,
                          nombre: e.target.value
                        }
                      }))}
                      className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                               focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                      placeholder="Nombre del cliente"
                      required
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Monto total *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="monto"
                      value={formData.monto}
                      onChange={handleChange}
                      className="w-full pl-10 p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                               focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                      required
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Método de pago *
                  </label>
                  <select
                    name="metodoPago"
                    value={formData.metodoPago}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar método</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Transferencia">Transferencia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Estado *
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Pagado">Pagado</option>
                  </select>
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
                <DollarSign className="mr-2" size={20} />
                Registrar Ingreso
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalIngresos;
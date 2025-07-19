import React, { useState, useEffect, useRef } from "react";
import { DollarSign, Building2, FileText, ChevronDown } from "lucide-react";
import axios from "axios";

const ModalGasto = ({ isOpen, onClose, onSubmit }) => {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

  const [formData, setFormData] = useState({
    fecha: today.toISOString().split("T")[0],
    descripcion: "",
    categoria: "",
    proveedor: "",
    proveedor_nombre: "",
    monto: "",
  });

  const [proveedores, setProveedores] = useState([]);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
  const [esProveedorRegistrado, setEsProveedorRegistrado] = useState(true);
  const [showProveedorOptions, setShowProveedorOptions] = useState(false);

  // Referencias para el dropdown
  const dropdownProveedorRef = useRef(null);
  const proveedorInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const fetchProveedores = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/proveedores"
          );
          const proveedoresActivos = response.data.filter(
            (prov) => prov.estatus === "Activo"
          );
          setProveedores(proveedoresActivos);
          setProveedoresFiltrados(proveedoresActivos);
        } catch (error) {
          // Error
        }
      };
      fetchProveedores();
    }
  }, [isOpen]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownProveedorRef.current &&
        !dropdownProveedorRef.current.contains(event.target)
      ) {
        setShowProveedorOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const gastoData = {
        fecha: formData.fecha,
        descripcion: formData.descripcion,
        categoria: formData.categoria,
        monto: Number(formData.monto),
        proveedor_registrado: esProveedorRegistrado,
        proveedor_id: esProveedorRegistrado ? formData.proveedor : null,
        proveedor_nombre_manual: !esProveedorRegistrado
          ? formData.proveedor_nombre
          : null,
      };

      const response = await axios.post(
        "http://localhost:5000/api/gastos",
        gastoData
      );
      if (response.data) {
        if (onSubmit) onSubmit(response.data);
        if (onClose) onClose();
      }
    } catch (error) {
      alert("Error al registrar el gasto");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Funciones para el manejo del dropdown de proveedores
  const handleProveedorSearch = (e) => {
    const value = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      proveedor_nombre: value,
      proveedor: "", // Limpiar el ID cuando se escribe manualmente
    }));

    // Filtrar proveedores basado en la búsqueda
    const filtered = proveedores.filter((proveedor) =>
      proveedor.nombreEmpresa.toLowerCase().includes(value.toLowerCase())
    );
    setProveedoresFiltrados(filtered);
    setShowProveedorOptions(true);
  };

  const handleProveedorFocus = () => {
    if (esProveedorRegistrado) {
      setShowProveedorOptions(true);
      setProveedoresFiltrados(proveedores);
    }
  };

  const handleProveedorDropdownToggle = () => {
    if (esProveedorRegistrado) {
      setShowProveedorOptions(!showProveedorOptions);
      setProveedoresFiltrados(proveedores);
    }
  };

  const handleProveedorSelect = (proveedor) => {
    setFormData((prevState) => ({
      ...prevState,
      proveedor: proveedor._id,
      proveedor_nombre: proveedor.nombreEmpresa,
    }));
    setShowProveedorOptions(false);
  };

  const handleTipoProveedorChange = (esRegistrado) => {
    setEsProveedorRegistrado(esRegistrado);
    setFormData((prevState) => ({
      ...prevState,
      proveedor: "",
      proveedor_nombre: "",
    }));
    setShowProveedorOptions(false);
  };

  const categorias = [
    "Herramientas",
    "Nóminas",
    "Mantenimiento",
    "Servicios",
    "Materiales",
    "Gastos operativos",
    "Renta",
    "Servicios públicos",
    "Otros",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 p-5 overflow-y-auto hide-scrollbar modal-blur">
      <div className="w-full max-w-3xl sm:max-w-lg md:max-w-xl mx-auto my-12 bg-[#1E2837] rounded-lg shadow-xl border border-gray-700 relative">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-200 text-2xl"
          aria-label="Cerrar"
        >
          ×
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">
            <DollarSign className="inline-block mr-2 text-[#7152EC]" />
            Registro de Gasto
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información del Gasto */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1C64F1] flex items-center">
                <FileText className="mr-2" size={20} />
                Información del Gasto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Fecha del gasto *
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
                    {categorias.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#00132e]">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
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
                    placeholder="Detalle del gasto realizado..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Información del Proveedor */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#E60001] flex items-center">
                <Building2 className="mr-2" size={20} />
                Información del Proveedor
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Proveedor o beneficiario *
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center text-gray-300">
                        <input
                          type="radio"
                          id="proveedorRegistrado"
                          checked={esProveedorRegistrado}
                          onChange={() => handleTipoProveedorChange(true)}
                          className="mr-2 accent-[#7152EC]"
                        />
                        Proveedor registrado
                      </label>
                      <label className="flex items-center text-gray-300">
                        <input
                          type="radio"
                          id="proveedorNuevo"
                          checked={!esProveedorRegistrado}
                          onChange={() => handleTipoProveedorChange(false)}
                          className="mr-2 accent-[#7152EC]"
                        />
                        Otro proveedor
                      </label>
                    </div>

                    {/* Campo de Proveedor con búsqueda */}
                    <div className="relative" ref={dropdownProveedorRef}>
                      <div className="relative">
                        <input
                          ref={proveedorInputRef}
                          type="text"
                          name="proveedor_nombre"
                          value={formData.proveedor_nombre}
                          onChange={
                            esProveedorRegistrado
                              ? handleProveedorSearch
                              : handleChange
                          }
                          onFocus={handleProveedorFocus}
                          placeholder={
                            esProveedorRegistrado
                              ? "Escriba o seleccione un proveedor..."
                              : "Nombre del proveedor o beneficiario"
                          }
                          className="w-full p-2 pr-10 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                                   focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                          required
                        />
                        {esProveedorRegistrado && (
                          <button
                            type="button"
                            onClick={handleProveedorDropdownToggle}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                          >
                            <ChevronDown
                              className={`h-5 w-5 transition-transform duration-200 ${
                                showProveedorOptions ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {esProveedorRegistrado &&
                        showProveedorOptions &&
                        proveedoresFiltrados.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-[#1E2837] border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {proveedoresFiltrados.map((proveedor) => (
                              <div
                                key={proveedor._id}
                                className="p-3 hover:bg-[#00132e] cursor-pointer text-gray-200 border-b border-gray-700 last:border-b-0"
                                onClick={() => handleProveedorSelect(proveedor)}
                              >
                                <div className="font-medium">
                                  {proveedor.nombreEmpresa}
                                </div>
                                {proveedor.contacto && (
                                  <div className="text-sm text-gray-400">
                                    {proveedor.contacto}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                      {esProveedorRegistrado &&
                        showProveedorOptions &&
                        proveedoresFiltrados.length === 0 &&
                        formData.proveedor_nombre && (
                          <div className="absolute z-10 w-full mt-1 bg-[#1E2837] border border-gray-700 rounded-md shadow-lg p-3">
                            <div className="text-gray-400 text-sm">
                              No se encontraron proveedores con "
                              {formData.proveedor_nombre}"
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
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
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={handleClose}
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
                Registrar Gasto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalGasto;

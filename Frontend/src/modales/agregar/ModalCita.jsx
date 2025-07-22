import { useState, useEffect, useRef } from "react";
import { Calendar, User, Car, Wrench, ChevronDown } from "lucide-react";
import axios from "axios";
import { UsoToast } from '../../contexto/UsoToast';
import PropTypes from 'prop-types';

const initialFormData = {
  cliente_id: "",
  cliente_nombre: "",
  correo: "",
  telefono: "",
  tipoCliente: "registrado",
  vehiculo_id: "",
  modelo: "",
  marca: "",
  placa: "",
  numero_serie: "",
  kilometraje: "",
  anio: "",
  servicio_id: "",
  servicio_nombre: "",
  descripcion: "",
  fecha: "",
  hora: "",
  tecnico_id: "",
  tecnico_nombre: "",
  comentarios: "",
  estado: "Pendiente"
};

const ModalCita = ({ isOpen, onClose, onSubmit }) => {
  const { error } = UsoToast();

  const [esClienteRegistrado, setEsClienteRegistrado] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [showClienteOptions, setShowClienteOptions] = useState(false);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const clienteInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownTecnicoRef = useRef(null);
  const tecnicoInputRef = useRef(null);
  const [showTecnicoOptions, setShowTecnicoOptions] = useState(false);
  const [tecnicosFiltrados, setTecnicosFiltrados] = useState([]);

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [clientesRes, serviciosRes, tecnicosRes] = await Promise.all([
            axios.get("http://localhost:5000/api/clientes/with-vehiculos"),
            axios.get("http://localhost:5000/api/servicios"),
            axios.get("http://localhost:5000/api/empleados"),
          ]);
          setClientes(clientesRes.data);
          setServicios(serviciosRes.data);
          setTecnicos(tecnicosRes.data);
          setClientesFiltrados(clientesRes.data); // Inicialmente mostrar todos los clientes
        } catch (error) {
          // Error
        }
      };
      fetchData();
    }
  }, [isOpen]);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowClienteOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClienteSearch = (e) => {
    const valor = e.target.value;
    setFormData((prev) => ({
      ...prev,
      cliente_nombre: valor,
      // Limpiar datos del cliente si se está escribiendo
      cliente_id: "",
      correo: "",
      telefono: "",
      vehiculo_id: "",
      modelo: "",
      marca: "",
      placa: "",
      numero_serie: "",
      kilometraje: "",
      anio: "",
    }));

    // Filtrar clientes basado en el texto ingresado
    if (valor.trim()) {
      const filtrados = clientes.filter((cliente) =>
        `${cliente.nombre} ${cliente.apellido}`
          .toLowerCase()
          .includes(valor.toLowerCase())
      );
      setClientesFiltrados(filtrados);
    } else {
      setClientesFiltrados(clientes); // Mostrar todos si no hay texto
    }

    setShowClienteOptions(true);
  };

  const handleClienteSelect = (cliente) => {
    setFormData((prev) => ({
      ...prev,
      cliente_id: cliente.id,
      cliente_nombre: `${cliente.nombre} ${cliente.apellido}`,
      correo: cliente.email || "",
      telefono: cliente.celular || cliente.telefono_casa || "",
      vehiculo_id: cliente.vehiculo_id || "",
      modelo: cliente.modelo || "",
      marca: cliente.marca || "",
      placa: cliente.placa || "",
      numero_serie: cliente.numero_serie || "",
      kilometraje: cliente.kilometraje || "",
      anio: cliente.anio || "",
    }));
    setShowClienteOptions(false);
  };

  const handleDropdownToggle = () => {
    setShowClienteOptions(!showClienteOptions);
    if (!showClienteOptions) {
      // Si se abre el dropdown, mostrar todos los clientes
      setClientesFiltrados(clientes);
      // Enfocar el input
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
    setFormData((prev) => ({
      ...prev,
      cliente_id: "",
      cliente_nombre: "",
      correo: "",
      telefono: "",
      vehiculo_id: "",
      modelo: "",
      marca: "",
      placa: "",
      numero_serie: "",
      kilometraje: "",
      anio: "",
      tipoCliente: esRegistrado ? "registrado" : "no_registrado",
    }));
    setEsClienteRegistrado(esRegistrado);
    setClientesFiltrados(clientes);
    setShowClienteOptions(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'placa' || name === 'numero_serie') {
      newValue = value.toUpperCase();
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const validateCita = () => {
    // Obtener fecha y hora actual local
    const now = new Date();
    // Validar número de serie (17 caracteres exactos)
    if (!formData.numero_serie || formData.numero_serie.length !== 17) {
      error('El número de serie debe tener exactamente 17 caracteres');
      return false;
    }
    // Validar placa (7 caracteres exactos)
    if (!formData.placa || formData.placa.length !== 7) {
      error('La placa debe tener exactamente 7 caracteres');
      return false;
    }
    // Crear fecha de la cita combinando fecha y hora del formulario
    if (!formData.fecha || !formData.hora) {
      error('Debe seleccionar fecha y hora para la cita');
      return false;
    }
    const [year, month, day] = formData.fecha.split('-');
    const [hour, minute] = formData.hora.split(':');
    const citaDateTime = new Date(year, month - 1, day, hour, minute);

    // Validar que la fecha/hora no sea anterior a ahora
    if (citaDateTime < now) {
      error('La fecha y hora de la cita no puede ser anterior a la actual');
      return false;
    }

    // Validar horario laboral (8am a 18:59)
    const citaHour = parseInt(hour);
    if (citaHour < 8 || citaHour > 18 || (citaHour === 18 && parseInt(minute) > 59)) {
      error('El horario de citas es de 8:00 am a 6:59 pm');
      return false;
    }

    // Solo validar hora si es el mismo día
    const isToday = 
      now.getDate() === parseInt(day) &&
      now.getMonth() === (parseInt(month) - 1) &&
      now.getFullYear() === parseInt(year);

    if (isToday) {
      if (citaDateTime <= now) {
        error('Para citas del mismo día, la hora debe ser posterior a la actual');
        return false;
      }
    }

    // Validar datos del vehículo para clientes no registrados
    if (!esClienteRegistrado && (!formData.marca || !formData.modelo || !formData.placa)) {
      error('Los datos del vehículo son obligatorios');
      return false;
    }

    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateCita()) return;
      const citaData = {
        cliente: {
          tipo: esClienteRegistrado ? "registrado" : "no_registrado",
          id: esClienteRegistrado ? formData.cliente_id : null,
          nombre: formData.cliente_nombre,
          correo: formData.correo,
          telefono: formData.telefono,
        },
        vehiculo: {
          id: formData.vehiculo_id || null,
          modelo: formData.modelo,
          marca: formData.marca,
          placa: formData.placa,
          numero_serie: formData.numero_serie,
          anio: formData.anio ? parseInt(formData.anio) : null,
          kilometraje: formData.kilometraje
            ? parseInt(formData.kilometraje)
            : null,
        },
        servicio_id: parseInt(formData.servicio_id),
        descripcion: formData.descripcion,
        fecha: formData.fecha,
        hora: formData.hora,
        tecnico_id: parseInt(formData.tecnico_id),
        comentarios: formData.comentarios || "",
      };
      if (onSubmit) {
        await onSubmit(citaData);
        setFormData(initialFormData); // Resetear formulario
      }
      if (onClose) onClose();
    } catch (error) {
      error("Error al crear la cita");
    }
  };

  // Filtrar técnicos cuando se escribe en el input
  const handleTecnicoSearch = (e) => {
    const valor = e.target.value;
    setFormData((prev) => ({
      ...prev,
      tecnico_nombre: valor,
      tecnico_id: "",
    }));
    if (valor.trim()) {
      const filtrados = tecnicos.filter((tecnico) =>
        `${tecnico.nombre} ${tecnico.apellido || ""}`
          .toLowerCase()
          .includes(valor.toLowerCase())
      );
      setTecnicosFiltrados(filtrados);
    } else {
      setTecnicosFiltrados(tecnicos);
    }
    setShowTecnicoOptions(true);
  };

  // Al hacer clic en un técnico del listado
  const handleTecnicoSelect = (tecnico) => {
    setFormData((prev) => ({
      ...prev,
      tecnico_id: tecnico.id,
      tecnico_nombre: `${tecnico.nombre} ${tecnico.apellido || ""}`,
    }));
    setShowTecnicoOptions(false);
  };

  // Abrir/cerrar el dropdown
  const handleTecnicoDropdownToggle = () => {
    setShowTecnicoOptions(!showTecnicoOptions);
    if (!showTecnicoOptions) {
      setTecnicosFiltrados(tecnicos);
      setTimeout(() => {
        if (tecnicoInputRef.current) {
          tecnicoInputRef.current.focus();
        }
      }, 100);
    }
  };

  // Mantener opciones visibles al enfocar
  const handleTecnicoFocus = () => {
    setShowTecnicoOptions(true);
    if (tecnicosFiltrados.length === 0) {
      setTecnicosFiltrados(tecnicos);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 p-5 overflow-y-auto modal-blur hide-scrollbar">
      <div className="w-full max-w-4xl mx-auto my-12 bg-[#1E2837] rounded-lg shadow-xl border border-gray-700 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl"
          aria-label="Cerrar"
        >
          ×
        </button>
        <div className="bg-[#1E2837] rounded-lg shadow-xl border border-gray-700 p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">
            <Calendar className="inline-block mr-2 text-[#7152EC]" />
            Cita de Servicio
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Datos del Cliente */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1C64F1] flex items-center">
                <User className="mr-2" />
                Datos del Cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {esClienteRegistrado ? (
                  <>
                    <div className="relative md:col-span-2" ref={dropdownRef}>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Cliente *
                      </label>
                      <div className="relative">
                        <input
                          ref={clienteInputRef}
                          type="text"
                          name="cliente_nombre"
                          value={formData.cliente_nombre}
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
                              showClienteOptions ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {showClienteOptions && clientesFiltrados.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-[#1E2837] border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {clientesFiltrados.map((cliente) => (
                            <div
                              key={cliente.id}
                              className="p-3 hover:bg-[#00132e] cursor-pointer text-gray-200 border-b border-gray-700 last:border-b-0"
                              onClick={() => handleClienteSelect(cliente)}
                            >
                              <div className="font-medium">{`${cliente.nombre} ${cliente.apellido}`}</div>
                              <div className="text-sm text-gray-400">
                                {cliente.email}{" "}
                                {cliente.celular && `• ${cliente.celular}`}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {showClienteOptions &&
                        clientesFiltrados.length === 0 &&
                        formData.cliente_nombre && (
                          <div className="absolute z-10 w-full mt-1 bg-[#1E2837] border border-gray-700 rounded-md shadow-lg p-3">
                            <div className="text-gray-400 text-sm">
                              No se encontraron clientes con &quot;
                              {formData.cliente_nombre}&quot;
                            </div>
                          </div>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Correo
                      </label>
                      <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-400"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-400"
                        readOnly
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        name="cliente_nombre"
                        value={formData.cliente_nombre}
                        onChange={handleChange}
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                                 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Correo *
                      </label>
                      <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-400"
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Datos del Vehículo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#E60001] flex items-center">
                <Car className="mr-2" />
                Datos del Vehículo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {esClienteRegistrado ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Modelo
                      </label>
                      <input
                        type="text"
                        name="modelo"
                        value={formData.modelo}
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-400 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Marca
                      </label>
                      <input
                        type="text"
                        name="marca"
                        value={formData.marca}
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-400 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Placa (7 Caracteres)
                      </label>
                      <input
                        type="text"
                        name="placa"
                        value={formData.placa}
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-400 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Número de Serie (17 caracteres)
                      </label>
                      <input
                        type="text"
                        name="numero_serie"
                        value={formData.numero_serie}
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-400 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Año
                      </label>
                      <input
                        type="number"
                        name="anio"
                        value={formData.anio}
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-400 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Kilometraje
                      </label>
                      <input
                        type="number"
                        name="kilometraje"
                        value={formData.kilometraje}
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-400 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                        readOnly
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Modelo *
                      </label>
                      <input
                        type="text"
                        name="modelo"
                        value={formData.modelo}
                        onChange={handleChange}
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Marca *
                      </label>
                      <input
                        type="text"
                        name="marca"
                        value={formData.marca}
                        onChange={handleChange}
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Placa (7 caracteres)*
                      </label>
                      <input
                        type="text"
                        name="placa"
                        value={formData.placa}
                        onChange={handleChange}
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                        required
                        minLength={7}
                        maxLength={7}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Número de Serie (17 caracteres)*
                      </label>
                      <input
                        type="text"
                        name="numero_serie"
                        value={formData.numero_serie}
                        onChange={handleChange}
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                        required
                        minLength={17}
                        maxLength={17}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Año *
                      </label>
                      <input
                        type="number"
                        name="anio"
                        value={formData.anio}
                        onChange={handleChange}
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                        required
                        min={1900}
                        max={2100}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Kilometraje *
                      </label>
                      <input
                        type="number"
                        name="kilometraje"
                        value={formData.kilometraje}
                        onChange={handleChange}
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                        required
                        min={0}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Fecha y Hora de la Cita */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#0E9E6E] flex items-center">
                <Calendar className="mr-2" />
                Fecha y Hora de la Cita
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
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent
                    [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Hora *
                  </label>
                  <input
                    type="time"
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent
                    [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Tipo de Servicio */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#FE6F00] flex items-center">
                <Wrench className="mr-2" />
                Detalles del Servicio
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Tipo de Servicio *
                  </label>
                  <select
                    name="servicio_id"
                    value={formData.servicio_id}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  >
                    <option value="">Seleccione un tipo</option>
                    {servicios.map((servicio) => (
                      <option key={servicio.id} value={servicio.id}>
                        {servicio.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Campo de Técnico con búsqueda */}
                <div className="relative" ref={dropdownTecnicoRef}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Técnico Asignado *
                  </label>
                  <div className="relative">
                    <input
                      ref={tecnicoInputRef}
                      type="text"
                      name="tecnico_nombre"
                      value={formData.tecnico_nombre}
                      onChange={handleTecnicoSearch}
                      onFocus={handleTecnicoFocus}
                      placeholder="Escriba o seleccione un técnico..."
                      className="w-full p-2 pr-10 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleTecnicoDropdownToggle}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    >
                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-200 ${
                          showTecnicoOptions ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {showTecnicoOptions && tecnicosFiltrados.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-[#1E2837] border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {tecnicosFiltrados.map((tecnico) => (
                        <div
                          key={tecnico.id}
                          className="p-3 hover:bg-[#00132e] cursor-pointer text-gray-200 border-b border-gray-700 last:border-b-0"
                          onClick={() => handleTecnicoSelect(tecnico)}
                        >
                          <div className="font-medium">{`${tecnico.nombre} ${
                            tecnico.apellido || ""
                          }`}</div>
                          <div className="text-sm text-gray-400">{tecnico.especialidades?.join(", ")}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {showTecnicoOptions &&
                    tecnicosFiltrados.length === 0 &&
                    formData.tecnico_nombre && (
                      <div className="absolute z-10 w-full mt-1 bg-[#1E2837] border border-gray-700 rounded-md shadow-lg p-3">
                        <div className="text-gray-400 text-sm">
                          No se encontraron técnicos con &quot;
                          {formData.tecnico_nombre}&quot;
                        </div>
                      </div>
                    )}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Descripción del Servicio
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                  placeholder="Describa el servicio requerido..."
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Comentarios
                </label>
                <textarea
                  name="comentarios"
                  value={formData.comentarios}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                  placeholder="Comentarios adicionales..."
                ></textarea>
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
                         transform transition-all duration-300 hover:scale-[1.02]"
              >
                Agendar Cita
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

ModalCita.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default ModalCita;

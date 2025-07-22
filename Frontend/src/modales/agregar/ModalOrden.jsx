import { useState, useEffect, useRef } from "react";
import { Car, Wrench, ChevronDown } from "lucide-react";
import axios from "axios";
import { UsoToast } from '../../contexto/UsoToast';
import PropTypes from 'prop-types';

function getLocalDateTimeValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const initialFormData = {
  clienteId: "",
  clienteNombre: "",
  correo: "",
  telefono: "",
  numero_serie: "",
  placa: "",
  modelo: "",
  marca: "",
  anio: "",
  kilometraje: "",
  tecnicoId: "",
  tecnicoNombre: "",
  servicioId: "",
  servicioNombre: "",
  descripcionActividad: "",
  insumosUtilizados: "",
  observaciones: "",
  fechaInicio: getLocalDateTimeValue()
};

const ModalOrden = ({ isOpen, onClose, onSubmit }) => {
  const { error } = UsoToast();

  const [esClienteRegistrado, setEsClienteRegistrado] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [showClienteOptions, setShowClienteOptions] = useState(false);
  const clienteInputRef = useRef(null);
  const dropdownClienteRef = useRef(null);

  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicosFiltrados, setTecnicosFiltrados] = useState([]);
  const [showTecnicoOptions, setShowTecnicoOptions] = useState(false);
  const tecnicoInputRef = useRef(null);
  const dropdownTecnicoRef = useRef(null);

  const [servicios, setServicios] = useState([]);

  const [formData, setFormData] = useState(initialFormData);

  // Cargar datos
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, fechaInicio: getLocalDateTimeValue() }));
      const fetchData = async () => {
        try {
          const [clientesRes, tecnicosRes, serviciosRes] = await Promise.all([
            axios.get("http://localhost:5000/api/clientes/with-vehiculos"),
            axios.get("http://localhost:5000/api/empleados"),
            axios.get("http://localhost:5000/api/servicios"),
          ]);
          setClientes(clientesRes.data);
          setClientesFiltrados(clientesRes.data);
          const tecnicosList = tecnicosRes.data.filter(
            emp => emp.especialidades && emp.especialidades.length > 0
          );
          setTecnicos(tecnicosList);
          setServicios(serviciosRes.data);
        } catch (error) {
          // manejar error
        }
      };
      fetchData();
    }
  }, [isOpen]);

  // Cerrar dropdown cliente
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownClienteRef.current && !dropdownClienteRef.current.contains(event.target)) {
        setShowClienteOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar dropdown tecnico
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownTecnicoRef.current && !dropdownTecnicoRef.current.contains(event.target)) {
        setShowTecnicoOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Búsqueda y filtrado de clientes
  const handleClienteSearch = e => {
    const valor = e.target.value;
    setFormData(prev => ({
      ...prev,
      clienteNombre: valor,
      clienteId: "",
      correo: "",
      telefono: "",
      numero_serie: "",
      placa: "",
      modelo: "",
      marca: "",
      anio: "",
      kilometraje: "",
    }));
    if (valor.trim()) {
      setClientesFiltrados(
        clientes.filter(c =>
          `${c.nombre} ${c.apellido}`.toLowerCase().includes(valor.toLowerCase())
        )
      );
    } else {
      setClientesFiltrados(clientes);
    }
    setShowClienteOptions(true);
  };

  const handleClienteSelect = cliente => {
    setFormData(prev => ({
      ...prev,
      clienteId: cliente.id,
      clienteNombre: `${cliente.nombre} ${cliente.apellido}`,
      correo: cliente.email || "",
      telefono: cliente.celular || cliente.telefono_casa || "",
      numero_serie: cliente.numero_serie || "",
      placa: cliente.placa || "",
      modelo: cliente.modelo || "",
      marca: cliente.marca || "",
      anio: cliente.anio || "",
      kilometraje: cliente.kilometraje || "",
    }));
    setShowClienteOptions(false);
  };

  const handleClienteDropdownToggle = () => {
    setShowClienteOptions(!showClienteOptions);
    if (!showClienteOptions) {
      setClientesFiltrados(clientes);
      setTimeout(() => clienteInputRef.current?.focus(), 100);
    }
  };

  const handleClienteInputFocus = () => {
    setShowClienteOptions(true);
    if (!clientesFiltrados.length) setClientesFiltrados(clientes);
  };

  // Búsqueda y filtrado de técnicos
  const handleTecnicoSearch = e => {
    const valor = e.target.value;
    setFormData(prev => ({
      ...prev,
      tecnicoNombre: valor,
      tecnicoId: "",
    }));
    if (valor.trim()) {
      setTecnicosFiltrados(
        tecnicos.filter(t =>
          `${t.nombre} ${t.apellido}`.toLowerCase().includes(valor.toLowerCase())
        )
      );
    } else {
      setTecnicosFiltrados(tecnicos);
    }
    setShowTecnicoOptions(true);
  };

  const handleTecnicoSelect = tecnico => {
    setFormData(prev => ({
      ...prev,
      tecnicoId: tecnico.id,
      tecnicoNombre: `${tecnico.nombre} ${tecnico.apellido}`
    }));
    setShowTecnicoOptions(false);
  };

  const handleTecnicoDropdownToggle = () => {
    setShowTecnicoOptions(!showTecnicoOptions);
    if (!showTecnicoOptions) {
      setTecnicosFiltrados(tecnicos);
      setTimeout(() => tecnicoInputRef.current?.focus(), 100);
    }
  };

  const handleTecnicoInputFocus = () => {
    setShowTecnicoOptions(true);
    if (!tecnicosFiltrados.length) setTecnicosFiltrados(tecnicos);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'placa' || name === 'numero_serie') {
      newValue = value.toUpperCase();
    }
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleTipoClienteChange = esRegistrado => {
    setEsClienteRegistrado(esRegistrado);
    setFormData({
      clienteId: "",
      clienteNombre: "",
      correo: "",
      telefono: "",
      numero_serie: "",
      placa: "",
      modelo: "",
      marca: "",
      anio: "",
      kilometraje: "",
      tecnicoId: "",
      tecnicoNombre: "",
      servicioId: "",
      servicioNombre: "",
      descripcionActividad: "",
      insumosUtilizados: "",
      observaciones: "",
      fechaInicio: getLocalDateTimeValue(),
      tipoCliente: esRegistrado ? 'registrado' : 'no_registrado'
    });
    setClientesFiltrados([]);
    setShowClienteOptions(false);
    setTecnicosFiltrados([]);
    setShowTecnicoOptions(false);
  };

  const validateOrden = () => {
    // Validar descripción mínima
    if (formData.descripcionActividad.length < 10) {
      error('La descripción debe tener al menos 10 caracteres');
      return false;
    }
    // Validar que haya al menos un insumo
    if (!formData.insumosUtilizados.trim()) {
      error('Debe especificar los insumos utilizados');
      return false;
    }
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
    // Validar fecha inicio
    if (!formData.fechaInicio) {
      error('La fecha de inicio es obligatoria');
      return false;
    }
    const now = new Date();
    const fechaInicio = new Date(formData.fechaInicio);
    if (fechaInicio < now) {
      error('La fecha de inicio no puede ser anterior a la actual');
      return false;
    }
    // Validaciones para cliente no registrado
    if (!esClienteRegistrado) {
      if (!formData.telefono?.trim()) {
        error('El teléfono es obligatorio para clientes no registrados');
        return false;
      }
      // Validar formato de correo si se proporciona
      if (formData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
        error('El formato del correo electrónico no es válido');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!validateOrden()) return;

    const ordenData = {
      cliente: {
        tipo: esClienteRegistrado ? 'registrado' : 'no_registrado',
        id: esClienteRegistrado ? formData.clienteId : null,
        nombre: formData.clienteNombre,
        correo: formData.correo,
        telefono: formData.telefono
      },
      vehiculo: {
        numero_serie: formData.numero_serie,
        placa: formData.placa,
        modelo: formData.modelo,
        marca: formData.marca,
        anio: formData.anio ? parseInt(formData.anio) : null,
        kilometraje: formData.kilometraje ? parseInt(formData.kilometraje) : null
      },
      tecnico_id: formData.tecnicoId,
      servicio_id: formData.servicioId,
      descripcion_actividad: formData.descripcionActividad,
      insumos_utilizados: formData.insumosUtilizados,
      observaciones: formData.observaciones,
      fecha_inicio: formData.fechaInicio
    };
    try {
      if (onSubmit) {
        await onSubmit(ordenData);
        setFormData(initialFormData); // Resetear formulario
      }
      onClose?.();
    } catch (error) {
      error('Error al crear la orden');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 p-5 overflow-y-auto hide-scrollbar modal-blur">
      <div className="w-full max-w-4xl mx-auto my-12 bg-[#1E2837] rounded-lg shadow-xl border border-gray-700 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl">×</button>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">
            <Wrench className="inline-block mr-2 text-[#7152EC]" />Orden de Servicio
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo cliente */}
            <div className="flex gap-4 mb-4">
              <label className="flex items-center text-gray-300"><input type="radio" checked={esClienteRegistrado} onChange={() => handleTipoClienteChange(true)} className="mr-2 accent-[#7152EC]"/>Cliente registrado</label>
              <label className="flex items-center text-gray-300"><input type="radio" checked={!esClienteRegistrado} onChange={() => handleTipoClienteChange(false)} className="mr-2 accent-[#7152EC]"/>Cliente no registrado</label>
            </div>
            {/* Cliente input con dropdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" ref={dropdownClienteRef}>
              {esClienteRegistrado ? (
                <div className="relative md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Cliente *</label>
                  <div className="relative">
                    <input
                      ref={clienteInputRef}
                      type="text"
                      name="clienteNombre"
                      value={formData.clienteNombre}
                      onChange={handleClienteSearch}
                      onFocus={handleClienteInputFocus}
                      className="w-full p-2 pr-10 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-[#7152EC]"
                      placeholder="Escribe o selecciona un cliente…"
                      required
                    />
                    <button type="button" onClick={handleClienteDropdownToggle} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200">
                      <ChevronDown className={showClienteOptions ? "rotate-180" : ""} />
                    </button>
                  </div>
                  {showClienteOptions && (
                    <div className="absolute z-10 w-full mt-1 bg-[#1E2837] border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {clientesFiltrados.map(cliente => (
                        <div key={cliente.id} className="p-3 hover:bg-[#00132e] cursor-pointer text-gray-200" onClick={() => handleClienteSelect(cliente)}>
                          <div className="font-medium">{`${cliente.nombre} ${cliente.apellido}`}</div>
                          <div className="text-sm text-gray-400">{cliente.email}{cliente.celular&&` • ${cliente.celular}`}</div>
                        </div>
                      ))}
                      {clientesFiltrados.length===0 && <div className="p-3 text-gray-400">No hay resultados para &quot;{formData.clienteNombre}&quot;</div>}
                    </div>
                  )}
                </div>
              ) : (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Nombre completo *</label>
                  <input type="text" name="clienteNombre" value={formData.clienteNombre} onChange={handleChange} className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-[#7152EC]" required />
                </div>
              )}
              {esClienteRegistrado && (
                <>                  
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Correo</label><input type="email" name="correo" value={formData.correo} className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-400" readOnly/></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Teléfono</label><input type="tel" name="telefono" value={formData.telefono} className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-400" readOnly/></div>
                </>
              )}
              {!esClienteRegistrado && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Teléfono *</label>
                    <input 
                      type="tel" 
                      name="telefono" 
                      value={formData.telefono} 
                      onChange={handleChange} 
                      className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-[#7152EC]" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Correo</label>
                    <input 
                      type="email" 
                      name="correo" 
                      value={formData.correo} 
                      onChange={handleChange} 
                      className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-[#7152EC]"
                    />
                  </div>
                </>
              )}
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
                        No. Serie (17 caracteres)
                      </label>
                      <input
                        type="text"
                        name="numero_serie"
                        value={formData.numero_serie}
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-400"
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
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-400"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Modelo
                      </label>
                      <input
                        type="text"
                        name="modelo"
                        value={formData.modelo}
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-400"
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
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-400"
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
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-400"
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
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-400"
                        readOnly
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Número de Serie (17 caracteres)*
                      </label>
                      <input
                        type="text"
                        name="numero_serie"
                        value={formData.numero_serie}
                        onChange={handleChange}
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
                        required
                        minLength={17}
                        maxLength={17}
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
                        className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
                        required
                        minLength={7}
                        maxLength={7}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Modelo *
                      </label>
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
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Marca *
                      </label>
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
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Año *
                      </label>
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
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Kilometraje *
                      </label>
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
                  </>
                )}
              </div>
            </div>
            {/* Información del Técnico */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#0E9E6E] flex items-center">
                <Wrench className="mr-2" />
                Información del Técnico
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative md:col-span-1" ref={dropdownTecnicoRef}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Técnico responsable *
                  </label>
                  <div className="relative">
                    <input
                      ref={tecnicoInputRef}
                      type="text"
                      name="tecnicoNombre"
                      value={formData.tecnicoNombre}
                      onChange={handleTecnicoSearch}
                      onFocus={handleTecnicoInputFocus}
                      className="w-full p-2 pr-10 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-[#7152EC]"
                      placeholder="Escribe o selecciona un técnico…"
                      required
                    />
                    <button type="button" onClick={handleTecnicoDropdownToggle} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200">
                      <ChevronDown className={showTecnicoOptions ? "rotate-180" : ""} />
                    </button>
                  </div>
                  {showTecnicoOptions && (
                    <div className="absolute z-10 w-full mt-1 bg-[#1E2837] border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {tecnicosFiltrados.map(tecnico => (
                        <div key={tecnico.id} className="p-3 hover:bg-[#00132e] cursor-pointer text-gray-200" onClick={() => handleTecnicoSelect(tecnico)}>
                          <div className="font-medium">{`${tecnico.nombre} ${tecnico.apellido}`}</div>
                          <div className="text-sm text-gray-400">{tecnico.especialidades?.join(", ")}</div>
                        </div>
                      ))}
                      {tecnicosFiltrados.length === 0 && <div className="p-3 text-gray-400">No hay resultados para &quot;{formData.tecnicoNombre}&quot;</div>}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Servicio a realizar *
                  </label>
                  <select
                    name="servicioId"
                    value={formData.servicioId}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar servicio</option>
                    {servicios.map((servicio) => (
                      <option key={servicio.id} value={servicio.id}>
                        {servicio.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Descripción de la actividad *
                  </label>
                  <textarea
                    name="descripcionActividad"
                    value={formData.descripcionActividad}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Insumos utilizados *
                  </label>
                  <textarea
                    name="insumosUtilizados"
                    value={formData.insumosUtilizados}
                    onChange={handleChange}
                    rows="2"
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Observaciones
                  </label>
                  <textarea
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleChange}
                    rows="2"
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Fecha y hora de inicio *
                  </label>
                  <input
                    type="datetime-local"
                    name="fechaInicio"
                    value={formData.fechaInicio}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent
                             [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                    required
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
                <Wrench className="mr-2" size={20} />
                Crear Orden
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

ModalOrden.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default ModalOrden;
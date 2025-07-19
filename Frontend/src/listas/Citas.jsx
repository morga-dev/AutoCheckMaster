import { useState, useEffect } from "react";
import {
  Search, Trash2, Calendar, Clock, Car, X,
  PlusCircle, Wrench, Eye, User, Loader2,
} from "lucide-react";
import ModalCita from "../modales/agregar/ModalCita";
import ModalConfirmacion from "../modales/confirmacion/ModalConfirmacion";
import axios from "axios";
import { UsoToast } from '../contexto/UsoToast';

const Citas = () => {

  const { success, error } = UsoToast();
  
  const [search, setSearch] = useState("");
  const [citas, setCitas] = useState([]);
  const [showCitaModal, setShowCitaModal] = useState(false);
  const [showCitaDetallesModal, setShowCitaDetallesModal] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [loading, setLoading] = useState(false);

  // Estados para el modal de confirmación de eliminación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [citaToDelete, setCitaToDelete] = useState(null);
  const [deletingCita, setDeletingCita] = useState(false);

  // Estados para el modal de confirmación de cambio de estado
  const [showEstadoConfirmModal, setShowEstadoConfirmModal] = useState(false);
  const [estadoChange, setEstadoChange] = useState(null);
  const [updatingEstado, setUpdatingEstado] = useState(false);

  // Mapa de transiciones permitidas (debe coincidir con el controlador)
  const transicionesValidas = {
    Pendiente:  ['Confirmada'],
    Confirmada: ['Completada', 'Cancelada'],
    Completada: [],
    Cancelada:  []
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  const fetchCitas = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/citas");
      setCitas(response.data);
    } catch (error) {
      // Error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (cita) => {
    setCitaToDelete(cita);
    setShowConfirmModal(true);
  };

  const confirmDeleteCita = async () => {
    if (!citaToDelete) return;
    
    setDeletingCita(true);
    try {
      await axios.delete(`http://localhost:5000/api/citas/${citaToDelete.id}`);
      await fetchCitas();
      success("Cita eliminada correctamente");
      setShowConfirmModal(false);
      setCitaToDelete(null);
    } catch (error) {
      error("Error al eliminar la cita");
    } finally {
      setDeletingCita(false);
    }
  };

  const cancelDeleteCita = () => {
    setShowConfirmModal(false);
    setCitaToDelete(null);
    setDeletingCita(false);
  };

  // Función para manejar el cambio de estado con confirmación
  const handleEstadoChange = (cita, nuevoEstado) => {
    // Si el estado es el mismo, no hacer nada
    if (cita.estado === nuevoEstado) return;
    
    setEstadoChange({
      cita,
      estadoAnterior: cita.estado,
      nuevoEstado
    });
    setShowEstadoConfirmModal(true);
  };

  const confirmEstadoChange = async () => {
    if (!estadoChange) return;
    
    setUpdatingEstado(true);
    try {
      await axios.patch(`http://localhost:5000/api/citas/${estadoChange.cita.id}/estado`, {
        estado: estadoChange.nuevoEstado,
      });
      await fetchCitas();
      success(`Estado cambiado a ${estadoChange.nuevoEstado}`);
      setShowEstadoConfirmModal(false);
      setEstadoChange(null);
    } catch (errorMsg) {
      const errorMessage = errorMsg.response?.data?.message || "Error al actualizar el estado";
      error(errorMessage);
    } finally {
      setUpdatingEstado(false);
    }
  };

  const cancelEstadoChange = () => {
    setShowEstadoConfirmModal(false);
    setEstadoChange(null);
    setUpdatingEstado(false);
  };

  const handleAgregarCita = async (citaData) => {
    try {
      await axios.post("http://localhost:5000/api/citas", citaData);
      setShowCitaModal(false);
      await fetchCitas();
      success("Cita agendada correctamente");
    } catch (error) {
      error("Error al agendar la cita");
    }
  };

  const filteredCitas = citas.filter(
    (cita) =>
      // Filtrar por cliente
      cita.cliente_nombre.toLowerCase().includes(search.toLowerCase()) ||
      // Filtrar por servicio
      cita.servicio_nombre.toLowerCase().includes(search.toLowerCase()) ||
      // Filtrar por técnico
      cita.tecnico_nombre.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Pendiente":
        return "bg-yellow-900 bg-opacity-20 text-yellow-400 border border-yellow-400";
      case "Confirmada":
        return "bg-blue-900 bg-opacity-20 text-blue-400 border border-blue-400";
      case "Completada":
        return "bg-green-900 bg-opacity-20 text-green-400 border border-green-400";
      case "Cancelada":
        return "bg-red-900 bg-opacity-20 text-red-400 border border-red-400";
      default:
        return "bg-gray-900 bg-opacity-20 text-gray-400 border border-gray-400";
    }
  };

  // Función para obtener las opciones disponibles para un estado dado
  const getAvailableStates = (estadoActual) => {
    const estadosPermitidos = transicionesValidas[estadoActual] || [];
    return [estadoActual, ...estadosPermitidos];
  };

  // Función para verificar si un estado es final (no puede cambiar)
  const isEstadoFinal = (estado) => {
    return transicionesValidas[estado]?.length === 0;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (fecha, hora) => {
    const date = new Date(fecha);
    const formattedDate = date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = new Date(`2000-01-01T${hora}`).toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${formattedDate} a las ${formattedTime}`;
  };

  // Función para obtener mensaje de confirmación según el cambio de estado
  const getEstadoChangeMessage = (estadoChange) => {
    if (!estadoChange) return "";
    
    const { cita, estadoAnterior, nuevoEstado } = estadoChange;
    
    return `¿Estás seguro de que deseas cambiar el estado de la cita de ${cita.cliente_nombre} de "${estadoAnterior}" a "${nuevoEstado}"?`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-[#7152EC]" size={48} />
        <span className="ml-4 text-lg text-gray-200">Cargando citas...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Citas</h2>
        <button
          onClick={() => setShowCitaModal(true)}
          className="btn btn-secondary flex items-center gap-2"
        >
          <PlusCircle size={20} />
          <span>Nueva Cita</span>
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar cita (cliente, servicio, técnico)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input search-bar"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Tabla de citas */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1E2837]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Vehículo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Servicio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Técnico
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredCitas.map((cita) => (
              <tr key={cita.id} className="hover:bg-[#1E2837]">
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                  {cita.cliente_nombre}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm space-y-1">
                    <a
                      href={`mailto:${cita.correo}`}
                      className="text-[#7152EC] hover:text-purple-400 block"
                    >
                      {cita.correo || "-"}
                    </a>
                    <a
                      href={`https://wa.me/${cita.telefono?.replace(
                        /[-\s]/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#7152EC] hover:text-purple-400 block"
                    >
                      {cita.telefono || "-"}
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center">
                      <Car size={16} className="text-gray-400 mr-2" />
                      <span>{`${cita.marca} ${cita.modelo}`}</span>
                    </div>
                    <div className="text-s text-gray-400">
                      <span className="font-semibold">Placa:</span>{" "}
                      {cita.placa || "-"}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-200">
                        {formatDate(cita.fecha)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-300">
                        {new Date(`2000-01-01T${cita.hora}`).toLocaleTimeString(
                          "es-MX",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                  {cita.servicio_nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                  <div className="flex items-center">
                    <Wrench size={16} className="text-gray-400 mr-2" />
                    {cita.tecnico_nombre}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isEstadoFinal(cita.estado) ? (
                    // Si el estado es final, mostrar solo como badge sin posibilidad de cambio
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cita.estado)}`}>
                      {cita.estado}
                    </span>
                  ) : (
                    // Si el estado no es final, mostrar select con opciones disponibles
                    <select
                      value={cita.estado}
                      onChange={(e) => handleEstadoChange(cita, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        cita.estado
                      )} bg-opacity-20 cursor-pointer`}
                    >
                      {getAvailableStates(cita.estado).map(estado => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedCita(cita);
                        setShowCitaDetallesModal(true);
                      }}
                      className="text-[#7152EC] hover:text-purple-400"
                      title="Ver detalles"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(cita)}
                      className="text-[#E60001] hover:text-red-400"
                      title="Eliminar cita"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalCita
        isOpen={showCitaModal}
        onClose={() => setShowCitaModal(false)}
        onSubmit={handleAgregarCita}
      />

      {/* Modal de confirmación para eliminar */}
      <ModalConfirmacion
        isOpen={showConfirmModal}
        title="Eliminar Cita"
        message={`¿Estás seguro de que deseas eliminar la cita de ${citaToDelete?.cliente_nombre} programada para el ${citaToDelete ? formatDateTime(citaToDelete.fecha, citaToDelete.hora) : ''}? Esta acción no se puede deshacer.`}
        onConfirm={confirmDeleteCita}
        onCancel={cancelDeleteCita}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loading={deletingCita}
      />

      {/* Modal de confirmación para cambio de estado */}
      <ModalConfirmacion
        isOpen={showEstadoConfirmModal}
        title="Cambiar Estado de Cita"
        message={getEstadoChangeMessage(estadoChange)}
        onConfirm={confirmEstadoChange}
        onCancel={cancelEstadoChange}
        confirmText={updatingEstado ? "Actualizando..." : "Sí, cambiar estado"}
        cancelText="Cancelar"
        loading={updatingEstado}
      />

      {/* Modal de detalles de la cita */}
      {showCitaDetallesModal && selectedCita && (
        <div className="modal-overlay">
          <div className="modal-content max-w-2xl w-full max-h-[90vh] overflow-y-scroll hide-scrollbar">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-100">
                  Detalles de la Cita
                </h3>
                <button
                  onClick={() => setShowCitaDetallesModal(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cliente */}
                <div className="col-span-2">
                  <h4 className="font-semibold text-[var(--blue-primary)] mb-2 flex items-center">
                    <User className="mr-2" size={18} />
                    Cliente
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Nombre</p>
                      <p className="font-medium">
                        {selectedCita.cliente_nombre}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Correo</p>
                      <a
                        href={`mailto:${selectedCita.correo}`}
                        className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
                      >
                        {selectedCita.correo}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <a
                        href={`https://wa.me/52${selectedCita.telefono?.replace(
                          /\D/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
                      >
                        {selectedCita.telefono}
                      </a>
                    </div>
                  </div>
                </div>
                {/* Vehículo */}
                <div className="col-span-2">
                  <h4 className="font-semibold text-[var(--red-primary)] mb-2 flex items-center">
                    <Car className="mr-2" size={18} />
                    Vehículo
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Marca y Modelo</p>
                      <p className="font-medium">{`${selectedCita.marca} ${selectedCita.modelo}`}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Placa</p>
                      <p className="font-medium">{selectedCita.placa}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">N° de Serie</p>
                      <p className="font-medium">
                        {selectedCita.numero_serie || "No especificado"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Kilometraje</p>
                      <p className="font-medium">
                        {selectedCita.kilometraje?.toLocaleString()} km
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Año</p>
                      <p className="font-medium">
                        {selectedCita.anio || "No especificado"}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Servicio */}
                <div className="col-span-2">
                  <h4 className="font-semibold text-[var(--orange-primary)] mb-2 flex items-center">
                    <Wrench className="mr-2" size={18} />
                    Servicio
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Servicio</p>
                      <p className="font-medium">
                        {selectedCita.servicio_nombre}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Técnico</p>
                      <p className="font-medium">
                        {selectedCita.tecnico_nombre}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fecha y hora</p>
                      <p className="font-medium">
                        {formatDate(selectedCita.fecha)}
                      </p>
                      <p className="font-medium">
                        {new Date(
                          `2000-01-01T${selectedCita.hora}`
                        ).toLocaleTimeString("es-MX", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estado</p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          selectedCita.estado
                        )}`}
                      >
                        {selectedCita.estado}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Descripción</p>
                      <p className="font-medium">{selectedCita.descripcion}</p>
                    </div>
                    {selectedCita.comentarios && (
                      <div>
                        <p className="text-sm text-gray-500">Comentarios</p>
                        <p className="font-medium">
                          {selectedCita.comentarios}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Citas;
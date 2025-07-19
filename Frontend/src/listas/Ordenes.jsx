import React, { useState, useEffect } from "react";
import { Search, User, Trash2, FileText, PlusCircle, DollarSign, Car, Wrench, X, CheckCircle, Eye, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import ModalOrden from "../modales/agregar/ModalOrden";
import ModalConfirmacion from "../modales/confirmacion/ModalConfirmacion";
import { UsoToast } from '../contexto/UsoToast';

function getLocalDateTimeForSQL() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const Ordenes = () => {
  
  const { success, error } = UsoToast();
  
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTotalModal, setShowTotalModal] = useState(false);
  const [showOrdenModal, setShowOrdenModal] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [newTotal, setNewTotal] = useState("");
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const [ordenDetalles, setOrdenDetalles] = useState(null);
  
  // Estados para los modales de confirmación
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);
  const [showConfirmUpdateTotal, setShowConfirmUpdateTotal] = useState(false);
  const [ordenToDelete, setOrdenToDelete] = useState(null);
  const [ordenToFinish, setOrdenToFinish] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isUpdatingTotal, setIsUpdatingTotal] = useState(false);

  useEffect(() => {
    fetchOrdenes();
  }, []);

  const fetchOrdenes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ordenes');
      setOrdenes(response.data);
      setLoading(false);
    } catch (error) {
      // Error
      setLoading(false);
    }
  };

  const handleEditTotal = (orden) => {
    setSelectedOrden(orden);
    setNewTotal(orden.total.toString());
    setShowTotalModal(true);
  };

  // Agregar esta función de validación
  const validateTotal = (total) => {
    // Validar que no esté vacío
    if (!total || total.trim() === '') {
      error('El total no puede estar vacío');
      return false;
    }

    // Convertir a número y validar que sea válido
    const numTotal = parseFloat(total);
    if (isNaN(numTotal)) {
      error('El total debe ser un número válido');
      return false;
    }

    // Validar que sea positivo
    if (numTotal <= 0) {
      error('El total debe ser mayor a 0');
      return false;
    }

    // Validar que no exceda un monto razonable (ejemplo: 1 millón)
    if (numTotal > 1000000) {
      error('El total no puede exceder $1,000,000');
      return false;
    }

    return true;
  };

  // Modificar la función handleSaveTotal
  const handleSaveTotal = () => {
    if (!validateTotal(newTotal)) {
      return;
    }
    
    // Cerrar modal de edición y mostrar modal de confirmación
    setShowTotalModal(false);
    setShowConfirmUpdateTotal(true);
  };

  const handleConfirmUpdateTotal = async () => {
    if (!selectedOrden || !validateTotal(newTotal)) {
      return;
    }
    
    setIsUpdatingTotal(true);
    try {
      await axios.patch(`http://localhost:5000/api/ordenes/${selectedOrden.id}/total`, {
        total: parseFloat(newTotal)
      });
      await fetchOrdenes();
      success('Total actualizado correctamente');
    } catch (error) {
      error('Error al actualizar el total');
    } finally {
      setIsUpdatingTotal(false);
      setShowConfirmUpdateTotal(false);
      setSelectedOrden(null);
      setNewTotal("");
    }
  };

  const handleCancelUpdateTotal = () => {
    setShowConfirmUpdateTotal(false);
    setSelectedOrden(null);
    setNewTotal("");
  };

  const handleDeleteClick = (orden) => {
    setOrdenToDelete(orden);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!ordenToDelete) return;
    
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/ordenes/${ordenToDelete.id}`);
      await fetchOrdenes();
      success('Orden eliminada correctamente');
    } catch (error) {
      error('Error al eliminar la orden');
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
      setOrdenToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setOrdenToDelete(null);
  };

  const handleFinishClick = (orden) => {
    setOrdenToFinish(orden);
    setShowConfirmFinish(true);
  };

  const handleConfirmFinish = async () => {
    if (!ordenToFinish) return;
    
    setIsFinishing(true);
    try {
      await axios.patch(`http://localhost:5000/api/ordenes/${ordenToFinish.id}/finalizar`, {
        fecha_fin: getLocalDateTimeForSQL(),
        estado: 'Completada'
      });
      await fetchOrdenes();
      success('Orden finalizada correctamente');
    } catch (error) {
      error('Error al finalizar la orden');
    } finally {
      setIsFinishing(false);
      setShowConfirmFinish(false);
      setOrdenToFinish(null);
    }
  };

  const handleCancelFinish = () => {
    setShowConfirmFinish(false);
    setOrdenToFinish(null);
  };

  const handleAgregarOrden = async (ordenData) => {
    try {
      await axios.post("http://localhost:5000/api/ordenes", ordenData);
      await fetchOrdenes();
      setShowOrdenModal(false);
      success('Orden agregada correctamente');
    } catch (error) {
      error('Error al agregar la orden');
    }
  };

  const handleVerDetalles = (orden) => {
    setOrdenDetalles(orden);
    setShowDetallesModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completada':
        return 'bg-green-900 bg-opacity-20 text-green-400 border border-green-400';
      case 'Pendiente':
        return 'bg-yellow-900 bg-opacity-20 text-yellow-400 border border-yellow-400';
      default:
        return 'bg-gray-900 bg-opacity-20 text-gray-400 border border-gray-400';
    }
  };

  const filteredOrdenes = ordenes.filter(orden => {
    const searchTerm = search.toLowerCase();
    return (
      // Search by folio
      orden.folio.toString().includes(searchTerm) ||
      // Search by client name
      orden.cliente_nombre.toLowerCase().includes(searchTerm) ||
      // Search by technician
      orden.tecnico_nombre.toLowerCase().includes(searchTerm)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-[#7152EC]" size={48} />
        <span className="ml-4 text-lg text-gray-200">Cargando órdenes...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Órdenes de Servicio</h2>
        <button 
          onClick={() => setShowOrdenModal(true)}
          className="btn btn-secondary flex items-center gap-2"
        >
          <PlusCircle size={20} />
          <span>Nueva Orden</span>
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar orden (folio, cliente, tecnico)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input search-bar"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Tabla de órdenes */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1E2837]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Folio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Vehículo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha Inicio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha Finalización</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Servicio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Técnico</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredOrdenes.map((orden) => (
              <tr key={orden.id} className="hover:bg-[#1E2837]">
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                  <div className="flex items-center">
                    <FileText size={16} className="text-gray-400 mr-2" />
                    {orden.folio}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">{orden.cliente_nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <Car size={16} className="text-gray-400 mr-2" />
                      <span>{`${orden.marca} ${orden.modelo}`}</span>
                    </div>
                    <div className="text-s text-gray-400">
                      <span className="font-semibold">Placa:</span>{" "}
                      {orden.placa || "-"}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                  {new Date(orden.fecha_inicio).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                  {orden.fecha_fin ? new Date(orden.fecha_fin).toLocaleString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                  <div className="flex items-center">
                    <Wrench size={16} className="text-gray-400 mr-2" />
                    {orden.servicio_nombre}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">{orden.tecnico_nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEditTotal(orden)}
                    className={`flex items-center ${Number(orden.total) !== 0 ? 'text-orange-400 cursor-not-allowed' : 'text-[#7152EC] hover:text-purple-400'}`}
                    disabled={Number(orden.total) !== 0}
                    title={Number(orden.total) !== 0 ? "El total solo puede modificarse una vez" : "Editar total"}
                  >
                    <DollarSign size={16} className="mr-1" />
                    {formatCurrency(orden.total)}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${getStatusColor(orden.estado)}`}>
                    {orden.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleVerDetalles(orden)}
                      className="text-[#7152EC] hover:text-purple-400"
                      title="Ver detalles"
                    >
                      <Eye size={18} />
                    </button>
                    {orden.estado !== 'Completada' && (
                      <button 
                        onClick={() => handleFinishClick(orden)}
                        className="text-green-400 hover:text-green-300"
                        title="Finalizar orden"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteClick(orden)}
                      className="text-[#E60001] hover:text-red-400"
                      title="Eliminar orden"
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

      {/* Modal para editar total */}
      {showTotalModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-100">Editar Total</h3>
              <button 
                onClick={() => setShowTotalModal(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Nuevo Total
              </label>
              <div className="relative">
                <span className="absolute top-3 text-gray-400">
                  <DollarSign size={16} />
                </span>
                <input
                  type="number"
                  value={newTotal}
                  onChange={(e) => setNewTotal(e.target.value)}
                  className="input pl-9"
                  step="0.01"
                  min="0"
                  max="1000000"
                  required
                  placeholder="Ingrese el total"
                  onKeyPress={(e) => {
                    // Permitir solo números y un punto decimal
                    if (!/[\d.]/.test(e.key) || 
                        (e.key === '.' && e.target.value.includes('.'))) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowTotalModal(false)}
                className="px-4 py-2 border border-gray-600 rounded-md hover:bg-[#1E2837] text-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveTotal}
                className="btn btn-secondary"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles de la orden */}
      {showDetallesModal && ordenDetalles && (
        <div className="modal-overlay">
          <div className="modal-content max-w-2xl w-full max-h-[90vh] overflow-y-scroll hide-scrollbar">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-100">
                  Detalles de la Orden de Servicio
                </h3>
                <button
                  onClick={() => setShowDetallesModal(false)}
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
                      <p className="font-medium">{ordenDetalles.cliente_nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Correo</p>
                      <a 
                          href={`mailto:${ordenDetalles.correo}`}
                          className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
                        >
                          {ordenDetalles.correo}
                        </a>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <a 
                        href={`https://wa.me/52${ordenDetalles.celular?.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
                      >
                        {ordenDetalles.celular}
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
                      <p className="font-medium">{`${ordenDetalles.marca} ${ordenDetalles.modelo}`}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Placa</p>
                      <p className="font-medium">{ordenDetalles.placa}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">N° de Serie</p>
                      <p className="font-medium">{ordenDetalles.numero_serie}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Año</p>
                      <p className="font-medium">{ordenDetalles.anio}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Kilometraje</p>
                      <p className="font-medium">{ordenDetalles.kilometraje?.toLocaleString()} km</p>
                    </div>
                  </div>
                </div>
                {/* Servicio y técnico */}
                <div className="col-span-2">
                  <h4 className="font-semibold text-[var(--orange-primary)] mb-2 flex items-center">
                    <Wrench className="mr-2" size={18} />
                    Servicio y Técnico
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Servicio</p>
                      <p className="font-medium">{ordenDetalles.servicio_nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Técnico</p>
                      <p className="font-medium">{ordenDetalles.tecnico_nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fecha Inicio</p>
                      <p className="font-medium">
                        {new Date(ordenDetalles.fecha_inicio).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fecha Finalización</p>
                      <p className="font-medium">
                        {ordenDetalles.fecha_fin
                          ? new Date(ordenDetalles.fecha_fin).toLocaleString()
                          : "No finalizada"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estado</p>
                      <p className="font-medium">{ordenDetalles.estado}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-medium">{formatCurrency(ordenDetalles.total)}</p>
                    </div>
                  </div>
                </div>
                {/* Descripción, insumos, observaciones */}
                <div className="col-span-2">
                  <h4 className="font-semibold text-[#7152EC] mb-2 flex items-center">
                    <FileText className="mr-2" size={18} />
                    Detalles Técnicos
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Descripción de la actividad</p>
                      <p className="font-medium">{ordenDetalles.descripcion_actividad}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Insumos utilizados</p>
                      <p className="font-medium">{ordenDetalles.insumos_utilizados}</p>
                    </div>
                    {ordenDetalles.observaciones && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Observaciones</p>
                        <p className="font-medium">{ordenDetalles.observaciones}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar nueva orden */}
      <ModalOrden
        isOpen={showOrdenModal}
        onClose={() => setShowOrdenModal(false)}
        onSubmit={handleAgregarOrden}
      />

      {/* Modal de confirmación para eliminar */}
      <ModalConfirmacion
        isOpen={showConfirmDelete}
        title="Eliminar Orden"
        message={`¿Está seguro de eliminar la orden ${ordenToDelete?.folio}? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loading={isDeleting}
      />

      {/* Modal de confirmación para finalizar */}
      <ModalConfirmacion
        isOpen={showConfirmFinish}
        title="Finalizar Orden"
        message={`¿Está seguro de finalizar la orden ${ordenToFinish?.folio}? Esta acción marcará la orden como completada.`}
        onConfirm={handleConfirmFinish}
        onCancel={handleCancelFinish}
        confirmText="Sí, finalizar"
        cancelText="Cancelar"
        loading={isFinishing}
      />

      {/* Modal de confirmación para actualizar total */}
      <ModalConfirmacion
        isOpen={showConfirmUpdateTotal}
        title="Actualizar Total"
        message={`¿Está seguro de actualizar el total de la orden ${selectedOrden?.folio} a ${formatCurrency(parseFloat(newTotal) || 0)}? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmUpdateTotal}
        onCancel={handleCancelUpdateTotal}
        confirmText="Sí, actualizar"
        cancelText="Cancelar"
        loading={isUpdatingTotal}
      />
    </div>
  );
};

export default Ordenes;
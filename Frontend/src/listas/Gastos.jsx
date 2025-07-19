import React, { useState, useEffect } from "react";
import { Search, Trash2, PlusCircle, DollarSign, Loader2 } from "lucide-react";
import ModalGasto from "../modales/agregar/ModalGasto";
import ModalConfirmacion from "../modales/confirmacion/ModalConfirmacion";
import axios from 'axios';
import { UsoToast } from '../contexto/UsoToast';

const Gastos = () => {

  const { success, error } = UsoToast();
  
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  
  // Estados para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [gastoToDelete, setGastoToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchGastos = async () => {
    try {
      const [gastosRes, proveedoresRes] = await Promise.all([
        axios.get('http://localhost:5000/api/gastos'),
        axios.get('http://localhost:5000/api/proveedores')
      ]);

      setGastos(gastosRes.data);
      setProveedores(proveedoresRes.data);
      setLoading(false);
    } catch (error) {
      setErrorMsg('Error al cargar los datos');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGastos();
  }, []);

  const getNombreProveedor = (gasto) => {
    if (!gasto) return "Proveedor no especificado";

    if (gasto.proveedor_registrado) {
        const proveedor = proveedores.find(p => p._id === gasto.proveedor_id);
        return proveedor ? proveedor.nombreEmpresa : "Proveedor no encontrado";
    }
    
    return gasto.proveedor_nombre_manual || "Proveedor no registrado";
  };

  const filteredGastos = gastos.filter(gasto => {
    const searchTerm = search.toLowerCase().trim();
    
    // Return true if searchTerm is empty
    if (!searchTerm) return true;

    // Get provider name using existing function
    const proveedorNombre = getNombreProveedor(gasto).toLowerCase();

    return (
      // Search by category
      gasto.categoria.toLowerCase().includes(searchTerm) ||
      // Search by provider name
      proveedorNombre.includes(searchTerm)
    );
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX');
  };

  const handleAddGasto = async (newGasto) => {
    try {
      await fetchGastos(); // Actualizar la lista después de agregar
      setShowForm(false);
      success('Gasto agregado correctamente');
    } catch (error) {
      error('Error al agregar el gasto');
    }
  };

  // Función para mostrar el modal de confirmación
  const handleShowDeleteConfirm = (gasto) => {
    setGastoToDelete(gasto);
    setShowConfirmModal(true);
  };

  // Función para confirmar la eliminación
  const handleConfirmDelete = async () => {
    if (!gastoToDelete) return;
    
    setDeleteLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/gastos/${gastoToDelete._id}`);
      await fetchGastos(); // Actualizar la lista después de eliminar
      success('Gasto eliminado correctamente');
      setShowConfirmModal(false);
      setGastoToDelete(null);
    } catch (error) {
      error('Error al eliminar el gasto');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Función para cancelar la eliminación
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setGastoToDelete(null);
    setDeleteLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-[#7152EC]" size={48} />
        <span className="ml-4 text-lg text-gray-200">Cargando gastos...</span>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* Modal del formulario */}
      <ModalGasto
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddGasto}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Historial de Gastos</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-secondary flex items-center gap-2"
        >
          <PlusCircle size={20} />
          <span>Nuevo Gasto</span>
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por categoría o proveedor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input search-bar"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Tabla de gastos */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1E2837]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Proveedor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Monto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredGastos.map((gasto) => (
              <tr key={gasto._id} className="hover:bg-[#1E2837]">
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                  {formatDate(gasto.fecha)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                  {gasto.descripcion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-sm font-medium rounded-full bg-[#1E2837] text-gray-200 border border-gray-600">
                    {gasto.categoria}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {gasto.proveedor_registrado ? (
                    <span className="text-[#7152EC]">
                      {getNombreProveedor(gasto)}
                    </span>
                  ) : (
                    <span className="text-gray-300">
                      {getNombreProveedor(gasto)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="flex items-center text-gray-200">
                    <DollarSign size={16} className="text-gray-400 mr-1" />
                    {formatCurrency(gasto.monto)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleShowDeleteConfirm(gasto)}
                      className="text-[#E60001] hover:text-red-400"
                      title="Eliminar gasto"
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

      {/* Modal de confirmación para eliminar gasto */}
      <ModalConfirmacion
        isOpen={showConfirmModal}
        title="Eliminar Gasto"
        message={gastoToDelete ? 
          `¿Estás seguro de que deseas eliminar el gasto "${gastoToDelete.descripcion}" por ${formatCurrency(gastoToDelete.monto)}? Esta acción no se puede deshacer.` : 
          '¿Estás seguro de que deseas eliminar este gasto?'
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loading={deleteLoading}
      />
    </div>
  );
};

export default Gastos;
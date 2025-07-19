import React, { useState, useEffect } from "react";
import { Search, Trash2, PlusCircle, DollarSign, CheckCircle, Loader2 } from "lucide-react";
import ModalIngresos from "../modales/agregar/ModalIngresos";
import ModalConfirmacion from "../modales/confirmacion/ModalConfirmacion";
import axios from 'axios';
import { UsoToast } from '../contexto/UsoToast';

const Ingresos = () => {

  const { success, error } = UsoToast();
  
  const [search, setSearch] = useState("");
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [clientes, setClientes] = useState([]);
  
  // Estados para el modal de confirmación
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    confirmText: "Sí, confirmar",
    cancelText: "Cancelar",
    loading: false
  });

  const fetchData = async () => {
    try {
      const [ingresosRes, clientesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/ingresos'),
        axios.get('http://localhost:5000/api/clientes')
      ]);
      setIngresos(ingresosRes.data);
      setClientes(clientesRes.data);
      setLoading(false);
    } catch (err) {
      setErrorMsg('Error al cargar los datos');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pagado':
        return 'bg-green-900 bg-opacity-20 text-green-400 border border-green-400';
      case 'Pendiente':
        return 'bg-yellow-900 bg-opacity-20 text-yellow-400 border border-yellow-400';
      default:
        return 'bg-gray-900 bg-opacity-20 text-gray-400 border border-gray-400';
    }
  };

  const handleAddIngreso = async (newIngreso) => {
    try {
      await axios.post('http://localhost:5000/api/ingresos', newIngreso);
      await fetchData();
      setShowForm(false);
      success('Ingreso registrado correctamente');
    } catch (error) {
      error('Error al registrar el ingreso');
    }
  };

  const handleDeleteIngreso = async (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Eliminar Ingreso",
      message: "¿Estás seguro de que deseas eliminar este ingreso? Esta acción no se puede deshacer.",
      confirmText: "Sí, eliminar",
      cancelText: "Cancelar",
      loading: false,
      onConfirm: async () => {
        try {
          setConfirmModal(prev => ({ ...prev, loading: true }));
          await axios.delete(`http://localhost:5000/api/ingresos/${id}`);
          await fetchData();
          success('Ingreso eliminado correctamente');
          setConfirmModal(prev => ({ ...prev, isOpen: false, loading: false }));
        } catch (error) {
          error('Error al eliminar el ingreso');
          setConfirmModal(prev => ({ ...prev, loading: false }));
        }
      }
    });
  };

  const handleUpdateEstado = async (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Confirmar Pago",
      message: "¿Confirmar que el ingreso ha sido pagado? El estado cambiará a 'Pagado'.",
      confirmText: "Sí, marcar como pagado",
      cancelText: "Cancelar",
      loading: false,
      onConfirm: async () => {
        try {
          setConfirmModal(prev => ({ ...prev, loading: true }));
          await axios.patch(`http://localhost:5000/api/ingresos/${id}/estado`);
          await fetchData();
          success('Estado actualizado a "Pagado"');
          setConfirmModal(prev => ({ ...prev, isOpen: false, loading: false }));
        } catch (error) {
          error('Error al actualizar el estado del ingreso');
          setConfirmModal(prev => ({ ...prev, loading: false }));
        }
      }
    });
  };

  const handleCloseConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const getNombreCliente = (ingreso) => {
    if (!ingreso.cliente) return 'No especificado';
    if (ingreso.cliente.tipo === 'registrado') {
      const clienteEncontrado = clientes.find(c => c.id === parseInt(ingreso.cliente.id));
      return clienteEncontrado ? `${clienteEncontrado.nombre} ${clienteEncontrado.apellido}` : 'Cliente no encontrado';
    }
    return ingreso.cliente.nombre || 'No especificado';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-[#7152EC]" size={48} />
        <span className="ml-4 text-lg text-gray-200">Cargando ingresos...</span>
      </div>
    );
  }

  return (
    <div className="w-full relative ">
      {/* Modal para agregar Ingreso */}
      {showForm && (
        <ModalIngresos
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleAddIngreso}
        />
      )}

      {/* Modal de confirmación */}
      <ModalConfirmacion
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={handleCloseConfirmModal}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        loading={confirmModal.loading}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Historial de Ingresos</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-secondary flex items-center gap-2"
        >
          <PlusCircle size={20} />
          <span>Nuevo Ingreso</span>
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar ingreso (concepto, cliente, categoria)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input search-bar"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Tabla de ingresos */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1E2837]">
            <tr>     
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Concepto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Monto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Método de Pago</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {ingresos.filter(ingreso => {
              const searchTerm = search.toLowerCase();
              const clienteName = getNombreCliente(ingreso).toLowerCase();
              return (
                ingreso.concepto.toLowerCase().includes(searchTerm) ||
                clienteName.includes(searchTerm) ||
                ingreso.categoria.toLowerCase().includes(searchTerm)
              );
            }).map((ingreso) => (
              <tr key={ingreso._id} className="hover:bg-[#1E2837]">
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">{formatDate(ingreso.fecha)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">{ingreso.concepto}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-sm font-medium rounded-full 
                    ${ingreso.categoria === 'Servicio' 
                      ? 'bg-blue-900 bg-opacity-20 text-blue-400 border border-blue-400' 
                      : 'bg-purple-900 bg-opacity-20 text-purple-400 border border-purple-400'}`}>
                    {ingreso.categoria}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-[#7152EC]">
                    {getNombreCliente(ingreso)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="flex items-center text-gray-200">
                    <DollarSign size={16} className="text-gray-400 mr-1" />
                    {formatCurrency(ingreso.monto)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">{ingreso.metodoPago}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${getStatusColor(ingreso.estado)}`}>
                    {ingreso.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-3">
                    {ingreso.estado === 'Pendiente' && (
                      <button 
                        className="text-green-400 hover:text-green-300"
                        onClick={() => handleUpdateEstado(ingreso._id)}
                        title="Marcar como pagado"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button 
                      className="text-[#E60001] hover:text-red-400"
                      onClick={() => handleDeleteIngreso(ingreso._id)}
                      title="Eliminar ingreso"
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
    </div>
  );
};

export default Ingresos;
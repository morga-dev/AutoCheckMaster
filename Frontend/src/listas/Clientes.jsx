import { useState, useEffect } from "react";
import { Search, Trash2, UserPlus, Eye, X, User, Phone, MapPin, Car, Loader2 } from "lucide-react";
import ModalCliente from "../modales/agregar/ModalCliente";
import ModalConfirmacion from "../modales/confirmacion/ModalConfirmacion";
import axios from 'axios';
import { UsoToast } from '../contexto/UsoToast';

const Clientes = () => {
  
  const { success, error } = UsoToast();
  
  const [search, setSearch] = useState("");
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);
  
  // Estados para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Función para obtener los clientes
  const fetchClientes = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/clientes/with-vehiculos');
        const clientesFormateados = response.data.map(cliente => ({
            id: cliente.id,
            nombre: `${cliente.nombre} ${cliente.apellido}`,
            telefono: cliente.celular || cliente.telefono_casa,
            email: cliente.email,
            colonia: cliente.colonia,
            codigo_postal: cliente.codigo_postal,
            vehiculo: cliente.modelo && cliente.marca && cliente.placa ? 
                     `${cliente.marca} ${cliente.modelo} (${cliente.placa})` : 
                     'Sin vehículo registrado'
        }));
        
        setClientes(clientesFormateados);
        setLoading(false);
    } catch (err) {
        setErrorMsg('Error al cargar los clientes');
        setLoading(false);
    }
  };

  // Función para mostrar el modal de confirmación
  const handleShowDeleteConfirm = (cliente) => {
    setClienteToDelete(cliente);
    setShowConfirmModal(true);
  };

  // Función para confirmar la eliminación
  const handleConfirmDelete = async () => {
    if (!clienteToDelete) return;
    
    setDeleteLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/clientes/${clienteToDelete.id}`);
      await fetchClientes();
      success('Cliente eliminado correctamente');
      setShowConfirmModal(false);
      setClienteToDelete(null);
    } catch (err) {
      error('Error al eliminar el cliente');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Función para cancelar la eliminación
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setClienteToDelete(null);
    setDeleteLoading(false);
  };

  const handleShowDetails = async (clienteId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/clientes/${clienteId}/with-all-vehiculos`);
      setSelectedCliente(response.data);
      setShowModal(true);
    } catch (error) {
      // Error
      error('Error al cargar los detalles del cliente');
    }
  };

  // Función para manejar el submit del formulario de cliente
  const handleAgregarCliente = async (clienteData) => {
    setShowClienteModal(false);
    try {
      await axios.post('http://localhost:5000/api/clientes', clienteData);
      success('Cliente agregado correctamente');
      await fetchClientes();
    } catch (err) {
      error('Error al agregar el cliente');
    }
  };

  // Cargar clientes cuando el componente se monta
  useEffect(() => {
    fetchClientes();
  }, []);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(search.toLowerCase()) ||
    cliente.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-[#7152EC]" size={48} />
        <span className="ml-4 text-lg text-gray-200">Cargando clientes...</span>
      </div>
    );
  }

  if (errorMsg) {
    return <div className="w-full text-center font-semibold py-4 text-red-600">{errorMsg}</div>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Clientes</h2>
        <button 
          onClick={() => setShowClienteModal(true)}
          className="btn btn-secondary flex items-center gap-2"
        >
          <UserPlus size={20} />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input search-bar"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="card overflow-x-auto">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1E2837]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Domicilio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Vehículo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-[#1E2837]">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-200">{cliente.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={`https://wa.me/${cliente.telefono.replace(/[-\s]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#7152EC] hover:text-purple-400"
                    >
                      {cliente.telefono}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={`mailto:${cliente.email}`}
                      className="text-[#7152EC] hover:text-purple-400"
                    >
                      {cliente.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                    {`Col. ${cliente.colonia}${cliente.codigo_postal ? `, C.P. ${cliente.codigo_postal}` : ''}`}
                  </td>
                  <td className="px-6 py-4 text-gray-200">{cliente.vehiculo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center gap-2">
                      <button 
                        className="text-[#7152EC] hover:text-purple-400"
                        onClick={() => handleShowDetails(cliente.id)}
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        className="text-[#E60001] hover:text-red-400"
                        onClick={() => handleShowDeleteConfirm(cliente)}
                        title="Eliminar"
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

      {/* Modal de detalles del cliente */}
      {showModal && selectedCliente && (
        <div className="modal-overlay">
          <div className="modal-content max-w-2xl w-full max-h-[90vh] overflow-y-scroll hide-scrollbar">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-100">
                  Detalles del Cliente
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Datos Personales */}
                <div className="col-span-2">
                  <h4 className="font-semibold text-[var(--blue-primary)] mb-2 flex items-center">
                    <User className="mr-2" size={18} />
                    Datos Personales
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Nombre Completo</p>
                      <p className="font-medium">{`${selectedCliente.nombre} ${selectedCliente.apellido}`}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                      <p className="font-medium">
                        {selectedCliente.fecha_nacimiento ? 
                         new Date(selectedCliente.fecha_nacimiento).toLocaleDateString() : 
                         'No especificada'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Información de Contacto */}
                <div className="col-span-2">
                  <h4 className="font-semibold text-[var(--orange-primary)] mb-2 flex items-center">
                    <Phone className="mr-2" size={18} />
                    Información de Contacto
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Celular</p>
                      <a 
                        href={`https://wa.me/52${selectedCliente.celular?.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
                      >
                        {selectedCliente.celular}
                      </a>
                    </div>
                    {selectedCliente.telefono_casa && (
                      <div>
                        <p className="text-sm text-gray-500">Teléfono Casa</p>
                        <p className="font-medium">{selectedCliente.telefono_casa}</p>
                      </div>
                    )}
                    {selectedCliente.email && (
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <a 
                          href={`mailto:${selectedCliente.email}`}
                          className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
                        >
                          {selectedCliente.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dirección */}
                <div className="col-span-2">
                  <h4 className="font-semibold text-[var(--green-primary)] mb-2 flex items-center">
                    <MapPin className="mr-2" size={18} />
                    Dirección
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <p className="font-medium">
                      {`${selectedCliente.calle}${selectedCliente.numero_casa ? `, Num. casa: ${selectedCliente.numero_casa}` : ''}`}
                    </p>
                    <p className="font-medium">
                      {`Col. ${selectedCliente.colonia}${selectedCliente.codigo_postal ? `, C.P. ${selectedCliente.codigo_postal}` : ''}`}
                    </p>
                  </div>
                </div>

                {/* Vehículo */}
                <div className="col-span-2">
                  <h4 className="font-semibold text-[var(--red-primary)] mb-2 flex items-center">
                    <Car className="mr-2" size={18} />
                    Vehículos ({selectedCliente.vehiculos?.length || 0})
                  </h4>
                  {selectedCliente.vehiculos && selectedCliente.vehiculos.length > 0 ? (
                    selectedCliente.vehiculos.map((vehiculo, index) => (
                      <div key={vehiculo.id} className="mb-4 p-3 border border-gray-600 rounded-md">
                        <h5 className="font-medium text-gray-200 mb-2">
                          Vehículo {index + 1}: {vehiculo.marca} {vehiculo.modelo}
                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Placa</p>
                            <p className="font-medium">{vehiculo.placa}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">N° de Serie</p>
                            <p className="font-medium">{vehiculo.numero_serie || 'No especificado'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Kilometraje</p>
                            <p className="font-medium">{vehiculo.kilometraje?.toLocaleString()} km</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Año</p>
                            <p className="font-medium">{vehiculo.anio || 'No especificado'}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No hay vehículos registrados</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar cliente */}
      <ModalCliente
        isOpen={showClienteModal}
        onClose={() => setShowClienteModal(false)}
        onSubmit={handleAgregarCliente}
      />

      {/* Modal de confirmación para eliminar cliente */}
      <ModalConfirmacion
        isOpen={showConfirmModal}
        title="Eliminar Cliente"
        message={`¿Estás seguro de que deseas eliminar el cliente "${clienteToDelete?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loading={deleteLoading}
      />
    </div>
  );
};

export default Clientes;
import { useState, useEffect } from 'react';
import axios from 'axios';
import { UsoToast } from '../contexto/UsoToast';
import { 
    Search, UserPlus, Car, FileText, Calendar, 
    X, ChevronDown, ChevronUp, PlusCircle 
} from 'lucide-react';

import ModalAgregarClienteHistorial from '../modales/historial/ModalAgregarClienteHistorial';
import ModalAgregarVehiculoHistorial from '../modales/historial/ModalAgregarVehiculoHistorial';
import ModalAgregarServicioHistorial from '../modales/historial/ModalAgregarServicioHistorial';
import ModalConfirmacion from '../modales/confirmacion/ModalConfirmacion';

function Historial() {
    const { success, error } = UsoToast();
    const [expandedClient, setExpandedClient] = useState(null);
    const [expandedVehicle, setExpandedVehicle] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
    const [isVehiculoModalOpen, setIsVehiculoModalOpen] = useState(false);
    const [isServicioModalOpen, setIsServicioModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [historialData, setHistorialData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setError] = useState(null);
    const [pendingHistorial, setPendingHistorial] = useState({
        cliente: null,
        vehiculo: null,
        mostrarEnLista: false
    });

    // Estados para confirmaciones
    const [confirmacionEliminar, setConfirmacionEliminar] = useState({
        isOpen: false,
        tipo: null, // 'cliente', 'vehiculo', 'servicio'
        id: null,
        datos: null,
        loading: false
    });
    
    // Cargar datos del historial
    useEffect(() => {
        fetchHistorialData();
    }, []);

    const fetchHistorialData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/historial');
            setHistorialData(response.data);
        } catch (err) {
            console.error('Error al cargar el historial:', err);
            error('Error al cargar el historial');
            setError('Error al cargar el historial');
        } finally {
            setLoading(false);
        }
    };

    // Función para agregar cliente
    const handleClienteAgregado = async (cliente) => {
        // Asegurar que el cliente tenga todos los campos necesarios
        const clienteCompleto = {
            ...cliente,
            id: cliente.id || `temp-${Date.now()}`, // ID temporal para clientes no registrados
            tipo: cliente.tipo || 'no_registrado', // Asegurar que siempre tenga tipo
            nombre: cliente.nombre || cliente.nombre_completo,
            apellido: cliente.apellido || '',
            nombre_completo: cliente.nombre_completo || `${cliente.nombre} ${cliente.apellido || ''}`.trim(),
            telefono: cliente.telefono || cliente.celular,
            correo: cliente.correo || cliente.email || '',
            email: cliente.email || cliente.correo || '',
            celular: cliente.celular || cliente.telefono
        };
        
        setPendingHistorial(prev => ({
            ...prev,
            cliente: clienteCompleto,
            mostrarEnLista: true
        }));
        success('Cliente seleccionado correctamente');
        setIsVehiculoModalOpen(true);
    };

    // Función para agregar vehículo
    const handleVehiculoAgregado = async (vehiculo) => {
        try {
            if (pendingHistorial.cliente && pendingHistorial.cliente.tipo === 'no_registrado') {
                // Para clientes no registrados, el vehículo se guarda cuando se agrega el primer servicio
                const clienteId = pendingHistorial.cliente.id || 'pending-' + Date.now();
                setPendingHistorial(prev => ({
                    ...prev,
                    vehiculo
                }));
                // Expandir automáticamente el cliente pendiente para mostrar el vehículo
                setExpandedClient(clienteId);
                success('Vehículo seleccionado correctamente');
                setIsServicioModalOpen(true);
            } else {
                // Para clientes registrados, verificar si es un vehículo nuevo o existente
                if (vehiculo.id && vehiculo.id.toString().startsWith('temp-')) {
                    // Es un vehículo nuevo, guardarlo en la base de datos
                    const response = await axios.post(
                        `http://localhost:5000/api/clientes/${pendingHistorial.cliente.id}/vehiculos`,
                        {
                            marca: vehiculo.marca,
                            modelo: vehiculo.modelo,
                            placa: vehiculo.placa || '',
                            numero_serie: vehiculo.numero_serie || '',
                            anio: vehiculo.anio || '',
                            kilometraje: vehiculo.kilometraje || ''
                        }
                    );
                    
                    if (response.data) {
                        const vehiculoGuardado = response.data.data;
                        setPendingHistorial(prev => ({
                            ...prev,
                            vehiculo: vehiculoGuardado
                        }));
                        success('Vehículo registrado correctamente');
                        setIsServicioModalOpen(true);
                    }
                } else {
                    // Es un vehículo existente
                    setPendingHistorial(prev => ({
                        ...prev,
                        vehiculo
                    }));
                    success('Vehículo seleccionado correctamente');
                    setIsServicioModalOpen(true);
                }
            }
        } catch (error) {
            console.error('Error al agregar vehículo:', error);
            error('Error al agregar vehículo');
        }
    };

    // Función para agregar servicio
    const handleServicioAgregado = async (servicioFormData) => {
        try {
            // Determinar qué cliente y vehículo usar
            const cliente = pendingHistorial.cliente || selectedClient;
            const vehiculo = pendingHistorial.vehiculo || selectedVehicle;
            
            if (!cliente || !vehiculo) {
                throw new Error('Cliente y vehículo son requeridos');
            }

            if (cliente.tipo === 'registrado' || cliente.tipo_cliente === 'registrado') {
                // Para clientes registrados
                servicioFormData.append('tipo_cliente', 'registrado');
                servicioFormData.append('cliente_id', cliente.id);
                servicioFormData.append('vehiculo_id', vehiculo.id);
            } else {
                // Para clientes no registrados
                servicioFormData.append('tipo_cliente', 'no_registrado');
                servicioFormData.append('cliente_id', null);
                servicioFormData.append('vehiculo_id', null);
                servicioFormData.append('nombre_cliente', cliente.nombre || cliente.nombre_completo);
                servicioFormData.append('telefono_cliente', cliente.telefono || cliente.celular);
                servicioFormData.append('correo_cliente', cliente.correo || cliente.email || '');
                servicioFormData.append('vehiculo_marca', vehiculo.marca);
                servicioFormData.append('vehiculo_modelo', vehiculo.modelo);
                servicioFormData.append('vehiculo_placa', vehiculo.placa || '');
                servicioFormData.append('vehiculo_serie', vehiculo.numero_serie || '');
                servicioFormData.append('vehiculo_anio', vehiculo.anio || vehiculo.año || 0);
                servicioFormData.append('vehiculo_kilometraje', vehiculo.kilometraje || 0);
            }

            const response = await axios.post(
                'http://localhost:5000/api/historial/servicio', 
                servicioFormData,
                {
                    headers: { 
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data) {
                success('Servicio agregado al historial correctamente');
                // Limpiar pendingHistorial después de agregar el servicio exitosamente
                setPendingHistorial({ 
                    cliente: null, 
                    vehiculo: null, 
                    mostrarEnLista: false
                });
                await fetchHistorialData();
            }
        } catch (err) {
            console.error('Error completo:', err);
            console.error('Error response:', err.response);
            console.error('Error detallado:', err.response?.data);
            
            let errorMessage = 'Error al agregar servicio';
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            error(errorMessage);
            throw err;
        }
    };

    // Función para limpiar el estado pendiente
    const handleCleanup = () => {
        setPendingHistorial({ 
            cliente: null, 
            vehiculo: null, 
            mostrarEnLista: false
        });
        setSelectedClient(null);
        setSelectedVehicle(null);
    };

    // Función para eliminar cliente
    const handleDeleteClient = async (clientId, tipoCliente) => {
        try {
            await axios.delete(`http://localhost:5000/api/historial/cliente/${clientId}`, {
                data: { tipo_cliente: tipoCliente }
            });
            success('Cliente eliminado correctamente');
            await fetchHistorialData();
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            error('Error al eliminar cliente');
        }
    };

    // Función para eliminar vehículo
    const handleDeleteVehicle = async (vehicleId) => {
        try {
            await axios.delete(`http://localhost:5000/api/historial/vehiculo/${vehicleId}`);
            success('Vehículo eliminado correctamente');
            await fetchHistorialData();
        } catch (error) {
            console.error('Error al eliminar vehículo:', error);
            error('Error al eliminar vehículo');
        }
    };

    // Función para eliminar servicio
    const handleDeleteService = async (serviceId) => {
        try {
            await axios.delete(`http://localhost:5000/api/historial/servicio/${serviceId}`);
            success('Servicio eliminado correctamente');
            await fetchHistorialData();
        } catch (error) {
            console.error('Error al eliminar servicio:', error);
            error('Error al eliminar servicio');
        }
    };

    // Funciones para mostrar confirmaciones
    const mostrarConfirmacionCliente = (cliente) => {
        setConfirmacionEliminar({
            isOpen: true,
            tipo: 'cliente',
            id: cliente.id,
            datos: cliente,
            loading: false
        });
    };

    const mostrarConfirmacionVehiculo = (vehiculo) => {
        setConfirmacionEliminar({
            isOpen: true,
            tipo: 'vehiculo',
            id: vehiculo.id,
            datos: vehiculo,
            loading: false
        });
    };

    const mostrarConfirmacionServicio = (servicio) => {
        setConfirmacionEliminar({
            isOpen: true,
            tipo: 'servicio',
            id: servicio.id,
            datos: servicio,
            loading: false
        });
    };

    // Función para confirmar eliminación
    const confirmarEliminacion = async () => {
        setConfirmacionEliminar(prev => ({ ...prev, loading: true }));
        
        try {
            switch (confirmacionEliminar.tipo) {
                case 'cliente':
                    await handleDeleteClient(confirmacionEliminar.id, confirmacionEliminar.datos.tipo_cliente);
                    break;
                case 'vehiculo':
                    await handleDeleteVehicle(confirmacionEliminar.id);
                    break;
                case 'servicio':
                    await handleDeleteService(confirmacionEliminar.id);
                    break;
                default:
                    throw new Error('Tipo de eliminación no válido');
            }
            
            // Cerrar modal de confirmación
            setConfirmacionEliminar({
                isOpen: false,
                tipo: null,
                id: null,
                datos: null,
                loading: false
            });
        } catch (error) {
            console.error('Error en confirmación:', error);
            setConfirmacionEliminar(prev => ({ ...prev, loading: false }));
        }
    };

    // Función para cancelar confirmación
    const cancelarConfirmacion = () => {
        setConfirmacionEliminar({
            isOpen: false,
            tipo: null,
            id: null,
            datos: null,
            loading: false
        });
    };

    // Función para generar mensajes de confirmación personalizados
    const getMensajeConfirmacion = () => {
        const { tipo, datos } = confirmacionEliminar;
        
        switch (tipo) {
            case 'cliente':
                return `¿Estás seguro de que quieres eliminar al cliente "${datos?.nombre_completo}"? Esta acción eliminará todos sus vehículos y servicios del historial.`;
            case 'vehiculo':
                return `¿Estás seguro de que quieres eliminar el vehículo "${datos?.marca} ${datos?.modelo}"? Esta acción eliminará todos los servicios asociados a este vehículo.`;
            case 'servicio':
                return `¿Estás seguro de que quieres eliminar el servicio "${datos?.nombre_servicio}"? Esta acción no se puede deshacer.`;
            default:
                return '¿Estás seguro de que quieres realizar esta acción?';
        }
    };

    const getTituloConfirmacion = () => {
        const { tipo } = confirmacionEliminar;
        
        switch (tipo) {
            case 'cliente':
                return 'Eliminar Cliente';
            case 'vehiculo':
                return 'Eliminar Vehículo';
            case 'servicio':
                return 'Eliminar Servicio';
            default:
                return 'Confirmar Acción';
        }
    };

    const toggleClient = (clientId) => {
        setExpandedClient(expandedClient === clientId ? null : clientId);
        setExpandedVehicle(null);
    };

    const toggleVehicle = (vehicleId) => {
        setExpandedVehicle(expandedVehicle === vehicleId ? null : vehicleId);
    };

    const getClientesAMostrar = () => {
        let clientes = [...historialData];
        
        // Si hay un cliente pendiente y mostrarEnLista es true, agregarlo temporalmente
        if (pendingHistorial.cliente && pendingHistorial.mostrarEnLista) {
            // Verificar si el cliente ya existe en historialData para evitar duplicados
            const clienteExiste = clientes.some(c => c.id === pendingHistorial.cliente.id);
            
            if (!clienteExiste) {
                const clientePendiente = {
                    id: pendingHistorial.cliente.tipo === 'registrado' 
                        ? pendingHistorial.cliente.id 
                        : pendingHistorial.cliente.id || 'pending-' + Date.now(),
                    tipo_cliente: pendingHistorial.cliente.tipo,
                    nombre_completo: pendingHistorial.cliente.tipo === 'registrado'
                        ? `${pendingHistorial.cliente.nombre} ${pendingHistorial.cliente.apellido || ''}`
                        : pendingHistorial.cliente.nombre,
                    telefono: pendingHistorial.cliente.tipo === 'registrado'
                        ? pendingHistorial.cliente.celular
                        : pendingHistorial.cliente.telefono,
                    correo: pendingHistorial.cliente.tipo === 'registrado'
                        ? pendingHistorial.cliente.email
                        : pendingHistorial.cliente.correo,
                    vehiculos: pendingHistorial.vehiculo ? [pendingHistorial.vehiculo] : [],
                    isPending: true
                };
                clientes = [clientePendiente, ...clientes];
            }
        }

        return clientes.filter(cliente => 
            (cliente.nombre_completo || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7152EC]"></div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="text-red-500 text-center py-4">
                {errorMessage}
            </div>
        );
    }

    return (
      <div className="w-full p-6 bg-[#00132e]">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-100">Historial Cliente-Vehículo</h1>
          <button
            onClick={() => setIsClienteModalOpen(true)}
            className="btn btn-secondary flex items-center gap-2"
          >
            <UserPlus size={20} />
            <span>Nuevo Cliente</span>
          </button>
        </div>

        {/* Buscador */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input search-bar"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        {/* Lista de clientes */}
        <div className="space-y-4">
          {getClientesAMostrar().map(cliente => (
            <div key={cliente.id} className={`card ${cliente.isPending ? 'border-l-4 border-[#7152EC]' : ''}`}>
              {/* Información del cliente */}
              <div className="flex items-center justify-between p-4 bg-[#1E2837]">
                <div className="flex items-center flex-1">
                  <UserPlus className="mr-3 text-gray-300" size={20} />
                  <div className="flex-1" onClick={() => toggleClient(cliente.id)}>
                    <h3 className="font-semibold cursor-pointer text-gray-100">{cliente.nombre_completo}</h3>
                    <div className="space-y-1">
                      <a
                        href={cliente.telefono ? `https://wa.me/${cliente.telefono.replace(/[-\s]/g, '')}` : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm ${cliente.telefono ? 'text-[#7152EC] hover:text-purple-400' : 'text-gray-500 cursor-not-allowed'} inline-block`}
                      >
                        {cliente.telefono || 'No disponible'}
                      </a>
                      <br />
                      <a
                        href={`mailto:${cliente.correo}`}
                        className="text-sm text-[#7152EC] hover:text-purple-400 inline-block"
                      >
                        {cliente.correo}
                      </a>
                    </div>
                  </div>
                  {expandedClient === cliente.id ? 
                    <ChevronUp size={20} className="text-gray-300" /> : 
                    <ChevronDown size={20} className="text-gray-300" />}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const clienteSeleccionado = {
                          ...cliente,
                          id: cliente.id,
                          tipo: cliente.tipo_cliente,
                          nombre: cliente.nombre_completo ? cliente.nombre_completo.split(' ')[0] : cliente.nombre,
                          apellido: cliente.nombre_completo ? cliente.nombre_completo.split(' ').slice(1).join(' ') : cliente.apellido,
                          nombre_completo: cliente.nombre_completo,
                          telefono: cliente.telefono,
                          correo: cliente.correo,
                          email: cliente.correo,
                          celular: cliente.telefono
                      };
                      setSelectedClient(clienteSeleccionado);
                      // Si es un cliente no registrado, no necesitamos pendingHistorial
                      if (cliente.tipo_cliente === 'no_registrado') {
                          setSelectedClient(clienteSeleccionado);
                      } else {
                          setPendingHistorial(prev => ({
                              ...prev,
                              cliente: clienteSeleccionado
                          }));
                      }
                      setIsVehiculoModalOpen(true);
                    }}
                    className="btn btn-secondary flex items-center gap-2 text-sm"
                  >
                    <Car size={16} />
                    <span>Agregar Vehículo</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      mostrarConfirmacionCliente(cliente);
                    }}
                    className="p-1 text-[#E60001] hover:text-red-400"
                    title="Eliminar cliente y todos sus datos"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Lista de vehículos */}
              {expandedClient === cliente.id && (
                <div className="border-t border-gray-700">
                  {cliente.vehiculos && cliente.vehiculos.length > 0 ? (
                    cliente.vehiculos.map(vehiculo => (
                      <div key={vehiculo.id || `${vehiculo.marca}-${vehiculo.modelo}`} className="border-b border-gray-700 last:border-b-0">
                        {/* Información del vehículo */}
                        <div
                          onClick={() => toggleVehicle(vehiculo.id || `${vehiculo.marca}-${vehiculo.modelo}`)}
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#1E2837]"
                        >
                          <div className="flex items-center text-gray-200">
                            <Car className="text-gray-400 mr-2" size={20} />
                            <span>
                              {vehiculo.marca} {vehiculo.modelo} ({vehiculo.año})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                mostrarConfirmacionVehiculo(vehiculo);
                              }}
                              className="p-1 text-[#E60001] hover:text-red-400"
                              title="Eliminar vehículo y todos sus servicios"
                            >
                              <X size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedClient(cliente);
                                setSelectedVehicle(vehiculo);
                                setIsServicioModalOpen(true);
                              }}
                              className="btn btn-secondary flex items-center gap-2 text-sm"
                            >
                              <PlusCircle size={16} />
                              <span>Agregar Servicio</span>
                            </button>
                            {expandedVehicle === (vehiculo.id || `${vehiculo.marca}-${vehiculo.modelo}`) ? 
                              <ChevronDown size={20} className="text-gray-400" /> : 
                              <ChevronUp size={20} className="text-gray-400" />}
                          </div>
                        </div>

                        {/* Lista de servicios del vehículo */}
                        {expandedVehicle === (vehiculo.id || `${vehiculo.marca}-${vehiculo.modelo}`) && (
                          <div className="px-4 py-2 bg-[#1E2837]">
                            {vehiculo.servicios && Array.isArray(vehiculo.servicios) && vehiculo.servicios.length > 0 ? (
                              vehiculo.servicios.map(servicio => (
                                <div
                                  key={servicio.id}
                                  className="flex items-start gap-3 p-3 border border-gray-700 rounded-md mb-2 bg-[#00132e]"
                                >
                                  <FileText className="text-gray-400 mt-1" size={20} />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium text-gray-200">
                                        {servicio.nombre_servicio}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        {servicio.pdf_orden && (
                                          <a 
                                            href={`http://localhost:5000/${servicio.pdf_orden}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-[#0E9E6E] hover:text-[#FE6F00] font-semibold"
                                          >
                                            Ver PDF
                                          </a>
                                        )}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            mostrarConfirmacionServicio(servicio);
                                          }}
                                          className="p-1 text-[#E60001] hover:text-red-400"
                                          title="Eliminar servicio"
                                        >
                                          <X size={16} />
                                        </button>
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-300">{servicio.descripcion}</p>
                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                                      <Calendar size={14} />
                                      <span>{new Date(servicio.fecha).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-400 text-center py-2">
                                No hay servicios registrados para este vehículo
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400">
                      No hay vehículos registrados para este cliente
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modales */}
        {isClienteModalOpen && (
          <ModalAgregarClienteHistorial
            isOpen={isClienteModalOpen}
            onClose={() => setIsClienteModalOpen(false)}
            onClienteAgregado={handleClienteAgregado}
          />
        )}

        {isVehiculoModalOpen && (selectedClient || pendingHistorial.cliente) && (
            <ModalAgregarVehiculoHistorial
                isOpen={isVehiculoModalOpen}
                onClose={() => {
                    setIsVehiculoModalOpen(false);
                    setSelectedClient(null);
                }}
                cliente={selectedClient || pendingHistorial.cliente}
                onVehiculoAgregado={handleVehiculoAgregado}
            />
        )}


        {isServicioModalOpen && selectedClient && selectedVehicle && (
                      <ModalAgregarServicioHistorial
              isOpen={isServicioModalOpen}
              onClose={() => setIsServicioModalOpen(false)}
              vehiculo={selectedVehicle}
              onServicioAgregado={handleServicioAgregado}
              onCleanup={handleCleanup}
            />
        )}

        {/* Modal de Confirmación */}
        <ModalConfirmacion
            isOpen={confirmacionEliminar.isOpen}
            onClose={cancelarConfirmacion}
            onConfirm={confirmarEliminacion}
            loading={confirmacionEliminar.loading}
            message={getMensajeConfirmacion()}
            title={getTituloConfirmacion()}
            confirmText="Sí, eliminar"
            cancelText="Cancelar"
        />
      </div>
    );
}

export default Historial;
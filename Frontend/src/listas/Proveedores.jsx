import React, { useState, useEffect } from "react";
import { Search, Trash2, PlusCircle, ToggleLeft, ToggleRight, Eye, X, Building2, Phone, Receipt, Mail, User, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import ModalProveedor from "../modales/agregar/ModalProveedor";
import ModalConfirmacion from "../modales/confirmacion/ModalConfirmacion";
import { UsoToast } from '../contexto/UsoToast';

const Proveedores = () => {
    
    const { success, error } = UsoToast();

    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedProveedor, setSelectedProveedor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showProveedorModal, setShowProveedorModal] = useState(false);
    
    // Estados para el modal de confirmación
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [proveedorToDelete, setProveedorToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    const navigate = useNavigate();

    const fetchProveedores = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/proveedores');
            setProveedores(response.data);
            setLoading(false);
        } catch (error) {
            // Error
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProveedores();
    }, []);

    const handleToggleEstatus = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/api/proveedores/${id}/toggle-estatus`);
            await fetchProveedores();
            success('Estatus del proveedor actualizado');
        } catch (error) {
            error('Error al cambiar el estatus del proveedor');
        }
    };

    // Función para mostrar el modal de confirmación
    const handleDeleteClick = (proveedor) => {
        setProveedorToDelete(proveedor);
        setShowConfirmModal(true);
    };

    // Función para confirmar la eliminación
    const handleConfirmDelete = async () => {
        if (!proveedorToDelete) return;
        
        setDeleteLoading(true);
        try {
            await axios.delete(`http://localhost:5000/api/proveedores/${proveedorToDelete._id}`);
            await fetchProveedores();
            success('Proveedor eliminado correctamente');
            setShowConfirmModal(false);
            setProveedorToDelete(null);
        } catch (error) {
            error('Error al eliminar el proveedor');
        } finally {
            setDeleteLoading(false);
        }
    };

    // Función para cancelar la eliminación
    const handleCancelDelete = () => {
        setShowConfirmModal(false);
        setProveedorToDelete(null);
        setDeleteLoading(false);
    };

    const handleShowDetails = (proveedor) => {
        setSelectedProveedor(proveedor);
        setShowModal(true);
    };

    const handleAgregarProveedor = async (proveedorData) => {
        setShowProveedorModal(false);
        try {
            await axios.post('http://localhost:5000/api/proveedores', proveedorData);
            success('Proveedor agregado correctamente');
            await fetchProveedores();
        } catch (error) {
            error('Error al agregar el proveedor');
        }
    };

    const filteredProveedores = proveedores.filter(proveedor => {
        if (!proveedor) return false;
        
        const searchTerm = search.toLowerCase();
        return (
            (proveedor.nombreEmpresa && proveedor.nombreEmpresa.toLowerCase().includes(searchTerm)) ||
            (proveedor.nombreContacto && proveedor.nombreContacto.toLowerCase().includes(searchTerm)) ||
            (proveedor.tipo && proveedor.tipo.toLowerCase().includes(searchTerm))
        );
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="animate-spin text-[#7152EC]" size={48} />
                <span className="ml-4 text-lg text-gray-200">Cargando proveedores...</span>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-100">Proveedores</h2>
                <button 
                    onClick={() => setShowProveedorModal(true)}
                    className="btn btn-secondary flex items-center gap-2"
                >
                    <PlusCircle size={20} />
                    <span>Nuevo Proveedor</span>
                </button>
            </div>

            {/* Barra de búsqueda */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar proveedor..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input search-bar"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
            </div>

            {/* Tabla de proveedores */}
            <div className="card overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#1E2837]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Empresa</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contacto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Teléfono</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estatus</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredProveedores.map((proveedor) => (
                            <tr key={proveedor._id} className="hover:bg-[#1E2837]">
                                <td className="px-6 py-4 whitespace-nowrap text-gray-200">{proveedor.nombreEmpresa}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-200">{proveedor.nombreContacto}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <a
                                        href={`https://wa.me/${proveedor.telefonoContacto.replace(/[-\s]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#7152EC] hover:text-purple-400"
                                    >
                                        {proveedor.telefonoContacto}
                                    </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <a
                                        href={`mailto:${proveedor.email}`}
                                        className="text-[#7152EC] hover:text-purple-400"
                                    >
                                        {proveedor.email}
                                    </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-200">{proveedor.tipo}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-sm font-medium rounded-full
                                        ${proveedor.estatus === 'Activo' 
                                            ? 'bg-green-900 bg-opacity-20 text-green-400 border border-green-400' 
                                            : 'bg-red-900 bg-opacity-20 text-red-400 border border-red-400'
                                        }`}
                                    >
                                        {proveedor.estatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleShowDetails(proveedor)}
                                            className="text-[#7152EC] hover:text-purple-400"
                                            title="Ver detalles"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleToggleEstatus(proveedor._id)}
                                            className={`${
                                                proveedor.estatus === 'Activo' 
                                                    ? 'text-[#0E9E6E] hover:text-green-400' 
                                                    : 'text-[#E60001] hover:text-red-400'
                                            }`}
                                            title={`Cambiar a ${proveedor.estatus === 'Activo' ? 'Inactivo' : 'Activo'}`}
                                        >
                                            {proveedor.estatus === 'Activo' ? 
                                                <ToggleRight size={25} /> : 
                                                <ToggleLeft size={25} />
                                            }
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteClick(proveedor)}
                                            className="text-[#E60001] hover:text-red-400"
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

            {/* Modal de detalles */}
            {showModal && selectedProveedor && (
                <div className="modal-overlay">
                    <div className="modal-content max-w-2xl w-full max-h-[90vh] overflow-y-scroll hide-scrollbar">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-100">
                                    Detalles del Proveedor
                                </h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-200"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Información de la Empresa */}
                                <div className="col-span-2">
                                    <h4 className="font-semibold text-[var(--blue-primary)] mb-2 flex items-center">
                                        <Building2 className="mr-2" size={18} />
                                        Información de la Empresa
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-400">Empresa</p>
                                            <p className="font-medium text-gray-200">{selectedProveedor.nombreEmpresa}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">RFC</p>
                                            <p className="font-medium text-gray-200">{selectedProveedor.rfc}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Tipo</p>
                                            <p className="font-medium text-gray-200">{selectedProveedor.tipo}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Estatus</p>
                                            <span className={`px-3 py-1 inline-flex text-sm font-medium rounded-full
                                                ${selectedProveedor.estatus === 'Activo' 
                                                    ? 'bg-green-900 bg-opacity-20 text-green-400 border border-green-400' 
                                                    : 'bg-red-900 bg-opacity-20 text-red-400 border border-red-400'
                                                }`}
                                            >
                                                {selectedProveedor.estatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Información de Contacto */}
                                <div className="col-span-2">
                                    <h4 className="font-semibold text-[var(--orange-primary)] mb-2 flex items-center">
                                        <User className="mr-2" size={18} />
                                        Información de Contacto
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-400">Nombre del Contacto</p>
                                            <p className="font-medium text-gray-200">{selectedProveedor.nombreContacto}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Puesto</p>
                                            <p className="font-medium text-gray-200">{selectedProveedor.puestoContacto}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Teléfono</p>
                                            <a 
                                                href={`https://wa.me/${selectedProveedor.telefonoContacto.replace(/[-\s]/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#7152EC] hover:text-purple-400 flex items-center gap-1"
                                            >
                                                <Phone size={16} />
                                                {selectedProveedor.telefonoContacto}
                                            </a>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Email</p>
                                            <a 
                                                href={`mailto:${selectedProveedor.email}`}
                                                className="text-[#7152EC] hover:text-purple-400 flex items-center gap-1"
                                            >
                                                <Mail size={16} />
                                                {selectedProveedor.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Dirección */}
                                <div className="col-span-2">
                                    <h4 className="font-semibold text-[var(--green-primary)] mb-2 flex items-center">
                                        <Building2 className="mr-2" size={18} />
                                        Dirección
                                    </h4>
                                    <p className="font-medium text-gray-200">{selectedProveedor.direccion}</p>
                                </div>

                                {/* Última Compra */}
                                {selectedProveedor.historialCompras && selectedProveedor.historialCompras.length > 0 && (
                                    <div className="col-span-2">
                                        <h4 className="font-semibold text-[var(--red-primary)] mb-2 flex items-center">
                                            <Receipt className="mr-2" size={18} />
                                            Última Compra
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-400">Fecha</p>
                                                <p className="font-medium text-gray-200">
                                                    {new Date(selectedProveedor.historialCompras[0].fechaCompra).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Producto/Servicio</p>
                                                <p className="font-medium text-gray-200">{selectedProveedor.historialCompras[0].productoServicio}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Cantidad</p>
                                                <p className="font-medium text-gray-200">{selectedProveedor.historialCompras[0].cantidad}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Costo Total</p>
                                                <p className="font-medium text-gray-200">
                                                    ${selectedProveedor.historialCompras[0].costoTotal.toLocaleString('es-MX', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para agregar proveedor */}
            <ModalProveedor
                isOpen={showProveedorModal}
                onClose={() => setShowProveedorModal(false)}
                onSubmit={handleAgregarProveedor}
            />

            {/* Modal de confirmación para eliminar */}
            <ModalConfirmacion
                isOpen={showConfirmModal}
                title="Eliminar Proveedor"
                message={`¿Está seguro que desea eliminar el proveedor "${proveedorToDelete?.nombreEmpresa}"? Esta acción no se puede deshacer.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Sí, eliminar"
                cancelText="Cancelar"
                loading={deleteLoading}
            />
        </div>
    );
};

export default Proveedores;
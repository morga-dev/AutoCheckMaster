import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ModalServicios from '../modales/inventario/ModalServicios';
import ModalConfirmacion from '../modales/confirmacion/ModalConfirmacion';
import { UsoToast } from '../contexto/UsoToast';

const Servicios = () => {

  const { success, error } = UsoToast();
  
  const [search, setSearch] = useState('');
  const [servicios, setServicios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [servicioEditar, setServicioEditar] = useState(null);
  
  // Estados para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [servicioAEliminar, setServicioAEliminar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Estados para el modal de confirmación de edición
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [servicioAEditar, setServicioAEditar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const navigate = useNavigate();

  const fetchServicios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/servicios');
      const serviciosFormateados = response.data.map(servicio => ({
        ...servicio,
        precio: parseFloat(servicio.precio)
      }));
      setServicios(serviciosFormateados);
    } catch (error) {
      // Error
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  const handleEdit = (servicio) => {
    setServicioAEditar(servicio);
    setShowEditConfirmModal(true);
  };

  const handleConfirmEdit = () => {
    setShowEditConfirmModal(false);
    setServicioEditar(servicioAEditar);
    setShowForm(true);
    setServicioAEditar(null);
  };

  const handleCancelEdit = () => {
    setShowEditConfirmModal(false);
    setServicioAEditar(null);
  };

  const handleServicioSubmit = async (data) => {
    try {
      if (servicioEditar) {
        await axios.put(`http://localhost:5000/api/servicios/${servicioEditar.id}`, data);
        success('Servicio actualizado correctamente');
      } else {
        await axios.post('http://localhost:5000/api/servicios', data);
        success('Servicio creado correctamente');
      }
      await fetchServicios();
      setShowForm(false);
      setServicioEditar(null);
    } catch (error) {
      error('Error al guardar el servicio');
    }
  };

  // Función para mostrar el modal de confirmación
  const handleDeleteClick = (servicio) => {
    setServicioAEliminar(servicio);
    setShowConfirmModal(true);
  };

  // Función para confirmar la eliminación
  const handleConfirmDelete = async () => {
    if (!servicioAEliminar) return;
    
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/servicios/${servicioAEliminar.id}`);
      await fetchServicios();
      success('Servicio eliminado correctamente');
      setShowConfirmModal(false);
      setServicioAEliminar(null);
    } catch (error) {
      error('Error al eliminar el servicio');
    } finally {
      setIsDeleting(false);
    }
  };

  // Función para cancelar la eliminación
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setServicioAEliminar(null);
    setIsDeleting(false);
  };

  const filteredServicios = servicios.filter(servicio =>
    servicio.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      
      {/* Modal del formulario */}
      {showForm && (
        <ModalServicios
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setServicioEditar(null);
          }}
          onSubmit={handleServicioSubmit}
          servicioEditar={servicioEditar}
        />
      )}

      {/* Modal de confirmación para eliminar */}
      <ModalConfirmacion
        isOpen={showConfirmModal}
        title="Eliminar Servicio"
        message={`¿Estás seguro de que deseas eliminar el servicio "${servicioAEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loading={isDeleting}
      />

      {/* Modal de confirmación para editar */}
      <ModalConfirmacion
        isOpen={showEditConfirmModal}
        title="Editar Servicio"
        message={`¿Estás seguro de que deseas editar el servicio "${servicioAEditar?.nombre}"?`}
        onConfirm={handleConfirmEdit}
        onCancel={handleCancelEdit}
        confirmText="Sí, editar"
        cancelText="Cancelar"
        loading={isEditing}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-100">Lista de Servicios</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-secondary flex items-center gap-2"
        >
          <Plus size={20} />
          Agregar Servicio
        </button>
      </div>

      { /* Barra de búsqueda */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar servicio..."
            className="input search-bar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      { /* Tabla de servicios */}
      <div className="card overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-[#1E2837]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredServicios.map((servicio) => (
              <tr key={servicio.id} className="hover:bg-[#1E2837]">
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">{servicio.nombre}</td>
                <td className="px-6 py-4 text-gray-200">{servicio.descripcion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                  ${servicio.precio.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(servicio)}
                      className="text-[#1C64F1] hover:text-blue-400"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(servicio)}
                      className="text-[#E60001] hover:text-red-400"
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

export default Servicios;
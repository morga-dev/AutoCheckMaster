import React, { useState, useEffect } from "react";
import { Search, Trash2, UserPlus, Phone, Mail, Eye, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import ModalEmpleado from "../modales/agregar/ModalEmpleado";
import ModalConfirmacion from "../modales/confirmacion/ModalConfirmacion";
import { UsoToast } from "../contexto/UsoToast";

const Empleados = () => {

  const { success, error } = UsoToast();

  const [search, setSearch] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEmpleadoModal, setShowEmpleadoModal] = useState(false);
  
  // Estados para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [empleadoToDelete, setEmpleadoToDelete] = useState(null);
  const [deletingEmpleado, setDeletingEmpleado] = useState(false);
  
  const navigate = useNavigate();

  const fetchEmpleados = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/empleados');
      setEmpleados(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      error('Error al cargar los empleados');
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const handleDeleteEmpleado = (empleado) => {
    setEmpleadoToDelete(empleado);
    setShowConfirmModal(true);
  };

  const confirmDeleteEmpleado = async () => {
    if (!empleadoToDelete) return;
    
    setDeletingEmpleado(true);
    try {
      await axios.delete(`http://localhost:5000/api/empleados/${empleadoToDelete.id}`);
      await fetchEmpleados();
      success('Empleado eliminado correctamente');
      setShowConfirmModal(false);
      setEmpleadoToDelete(null);
    } catch (error) {
      error('Error al eliminar el empleado');
    } finally {
      setDeletingEmpleado(false);
    }
  };

  const cancelDeleteEmpleado = () => {
    setShowConfirmModal(false);
    setEmpleadoToDelete(null);
    setDeletingEmpleado(false);
  };

  const handleShowDetails = (empleado) => {
    setSelectedEmpleado(empleado);
    setShowModal(true);
  };

  const handleAgregarEmpleado = async (empleadoData) => {
    setShowEmpleadoModal(false);
    try {
      await axios.post('http://localhost:5000/api/empleados', empleadoData);
      await fetchEmpleados();
      success('Empleado registrado correctamente');
    } catch (error) {
      error(error.response?.data?.message || 'Error al registrar el empleado');
    }
  };

  const filteredEmpleados = empleados.filter(empleado =>
    empleado.nombre.toLowerCase().includes(search.toLowerCase()) ||
    empleado.apellido.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-[#7152EC]" size={48} />
        <span className="ml-4 text-lg text-gray-200">Cargando empleados...</span>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-100">Empleados</h2>
        <button
          onClick={() => setShowEmpleadoModal(true)}
          className="btn btn-secondary flex items-center gap-2"
        >
          <UserPlus size={20} />
          <span>Agregar Empleado</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar empleados..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input search-bar"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1E2837]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre Completo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contacto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Especialidades</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Experiencia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredEmpleados.map((empleado) => (
              <tr key={empleado.id} className="hover:bg-[#1E2837]">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-200">{`${empleado.nombre} ${empleado.apellido}`}</span>
                    <span className="text-sm text-gray-400">{empleado.rfc}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <a 
                      href={`https://wa.me/52${empleado.celular.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#7152EC] hover:text-purple-400 flex items-center gap-1"
                    >
                      <Phone size={16} />
                      {empleado.celular}
                    </a>
                    <a 
                      href={`mailto:${empleado.email}`}
                      className="text-[#7152EC] hover:text-purple-400 flex items-center gap-1"
                    >
                      <Mail size={16} />
                      {empleado.email}
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {empleado.especialidades?.map((esp, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium bg-[#FE6F00] bg-opacity-20 text-black border rounded-full"
                      >
                        {esp}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                  {empleado.anos_experiencia} años
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShowDetails(empleado)}
                      className="text-[#0E9E6E] hover:text-purple-400"
                      title="Ver detalles"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteEmpleado(empleado)}
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
      {showModal && selectedEmpleado && (
        <div className="modal-overlay">
          <div className="modal-content bg-[#1E2837] max-w-2xl w-full max-h-[90vh] overflow-y-scroll hide-scrollbar">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-100">
                  Detalles del Empleado
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Datos Personales */}
                <div className="col-span-2">
                  <h4 className="font-semibold text-[var(--blue-primary)] mb-2">Datos Personales</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Nombre Completo</p>
                      <p className="font-medium text-gray-200">{`${selectedEmpleado.nombre} ${selectedEmpleado.apellido}`}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Fecha de Nacimiento</p>
                      <p className="font-medium text-gray-200">
                        {new Date(selectedEmpleado.fecha_nacimiento).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">CURP</p>
                      <p className="font-medium text-gray-200">{selectedEmpleado.curp}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">RFC</p>
                      <p className="font-medium text-gray-200">{selectedEmpleado.rfc}</p>
                    </div>
                  </div>
                </div>

                {/* Información de Contacto */}
                <div className="col-span-2">
                  <h4 className="font-semibold text-[var(--orange-primary)] mb-2">Información de Contacto</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Domicilio</p>
                      <p className="font-medium text-gray-200">{selectedEmpleado.domicilio}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Teléfono Casa</p>
                      <p className="font-medium text-gray-200">{selectedEmpleado.telefono_casa || 'No especificado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Celular</p>
                      <a 
                        href={`https://wa.me/52${selectedEmpleado.celular.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#7152EC] hover:text-purple-400"
                      >
                        {selectedEmpleado.celular}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <a 
                        href={`mailto:${selectedEmpleado.email}`}
                        className="text-[#7152EC] hover:text-purple-400"
                      >
                        {selectedEmpleado.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Experiencia y Especialidades */}
                <div className="col-span-2">
                  <h4 className="font-semibold text-[var(--green-primary)] mb-2">Experiencia y Especialidades</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Años de Experiencia</p>
                      <p className="font-medium text-gray-200">{selectedEmpleado.anos_experiencia} años</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Especialidades</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedEmpleado.especialidades?.map((esp, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs font-medium bg-[#FE6F00] text-black rounded-full"
                          >
                            {esp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contacto de Emergencia */}
                <div className="col-span-2">
                  <h4 className="font-semibold text-[var(--red-primary)] mb-2">Contacto de Emergencia</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Nombre</p>
                      <p className="font-medium text-gray-200">{selectedEmpleado.contacto_nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Parentesco</p>
                      <p className="font-medium text-gray-200">{selectedEmpleado.contacto_parentesco}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Teléfono</p>
                      <p className="font-medium text-gray-200">{selectedEmpleado.contacto_telefono}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      <ModalConfirmacion
        isOpen={showConfirmModal}
        title="Eliminar Empleado"
        message={`¿Estás seguro de que deseas eliminar a ${empleadoToDelete?.nombre} ${empleadoToDelete?.apellido}? Esta acción no se puede deshacer.`}
        onConfirm={confirmDeleteEmpleado}
        onCancel={cancelDeleteEmpleado}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loading={deletingEmpleado}
      />
      {/* Modal para agregar empleado */}
      <ModalEmpleado
        isOpen={showEmpleadoModal}
        onClose={() => setShowEmpleadoModal(false)}
        onSubmit={handleAgregarEmpleado}
      />
    </div>
  );
};

export default Empleados;
import React, { useState, useEffect } from "react";
import { DollarSign, PlusCircle, Search, Trash2 } from "lucide-react";
import ModalRefacciones from "../modales/inventario/ModalRefacciones";
import ModalConfirmacion from "../modales/confirmacion/ModalConfirmacion";
import axios from 'axios';
import { UsoToast } from '../contexto/UsoToast';

const Refacciones = () => {

  const { success, error } = UsoToast();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [refacciones, setRefacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idAEliminar, setIdAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const fetchRefacciones = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/refacciones');
      setRefacciones(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefacciones();
  }, []);

  const handleAddRefaccion = async (newRefaccion) => {
    try {
      await axios.post('http://localhost:5000/api/refacciones', newRefaccion);
      await fetchRefacciones();
      setShowForm(false);
      success('Refacción guardada correctamente');
    } catch (error) {
      error('Error al guardar la refacción');
    }
  };

  const handleDeleteRefaccion = (id) => {
    setIdAEliminar(id);
  };

  const confirmarEliminacion = async () => {
    setEliminando(true);
    try {
      await axios.delete(`http://localhost:5000/api/refacciones/${idAEliminar}`);
      await fetchRefacciones();
      success('Refacción eliminada');
    } catch (error) {
      error('Error al eliminar la refacción');
    } finally {
      setEliminando(false);
      setIdAEliminar(null);
    }
  };

  const filteredData = refacciones.filter((item) =>
    item.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  return (
    <div className="w-full relative">
      {/* Modal de confirmación */}
      <ModalConfirmacion
        isOpen={!!idAEliminar}
        title="Eliminar refacción"
        message="¿Estás seguro de eliminar esta refacción? Esta acción no se puede deshacer."
        onConfirm={confirmarEliminacion}
        onCancel={() => setIdAEliminar(null)}
        loading={eliminando}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
      {/* Modal del formulario */}
      {showForm && (
        <ModalRefacciones
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleAddRefaccion}
        />
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-100">Refacciones</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-secondary flex items-center gap-2"
        >
          <PlusCircle size={20} />
          <span>Agregar</span>
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-4 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input search-bar"
            aria-label="Buscar refacciones"
          />
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
            size={20} 
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="card overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-[#1E2837]">
            <tr>
              <th className="p-3 text-left text-gray-300">Nombre</th>
              <th className="p-3 text-left text-gray-300">Descripción</th>
              <th className="p-3 text-left text-gray-300">Precio</th>
              <th className="p-3 text-center text-gray-300">Existencia</th>
              <th className="p-3 text-center text-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-400">No se encontraron resultados</td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item._id} className="border-b border-gray-700 hover:bg-[#1E2837]">
                  <td className="p-3 text-gray-200">{item.nombre}</td>
                  <td className="p-3 text-gray-200">{item.descripcion}</td>
                  <td className="p-3">
                    <span className="flex items-center text-gray-200">
                      <DollarSign size={16} className="text-gray-400 mr-1" />
                      {formatCurrency(item.precio)}
                    </span>
                  </td>
                  <td className="p-3 text-gray-200 text-center">{item.cantidad}</td>
                  <td className="p-3">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => handleDeleteRefaccion(item._id)}
                        className="text-[#E60001] hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Refacciones;
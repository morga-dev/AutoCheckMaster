import { useState, useEffect } from "react";
import axios from 'axios';
import { UsoToast } from '../../contexto/UsoToast';
import PropTypes from 'prop-types';

const ModalAgregarClienteHistorial = ({
  isOpen,
  onClose,
  onClienteAgregado
}) => {
  const { error } = UsoToast();
  const [esClienteRegistrado, setEsClienteRegistrado] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [selectedClienteId, setSelectedClienteId] = useState("");
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    telefono: "",
    correo: ""
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Cargar clientes registrados
  useEffect(() => {
    if (isOpen && esClienteRegistrado) {
      const fetchClientes = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/clientes/with-vehiculos');
          setClientes(response.data);
        } catch (err) {
          console.error('Error al cargar clientes:', err);
          error('Error al cargar los clientes');
          setErrorMsg('Error al cargar los clientes');
        }
      };
      fetchClientes();
    }
  }, [isOpen, esClienteRegistrado]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        if (esClienteRegistrado) {
            if (!selectedClienteId) {
                error('Debe seleccionar un cliente');
                setLoading(false);
                return;
            }
            // Buscar el cliente seleccionado para obtener sus datos completos
            const clienteSeleccionado = clientes.find(c => String(c.id) === String(selectedClienteId));
            if (!clienteSeleccionado) {
                error('Cliente no encontrado');
                setLoading(false);
                return;
            }
            await onClienteAgregado({
                ...clienteSeleccionado,
                tipo: 'registrado'
            });
            onClose();
            setLoading(false);
            return;
        } else {
            // Validaciones cliente nuevo
            if (!nuevoCliente.nombre.trim()) {
                error('El nombre es obligatorio');
                setLoading(false);
                return;
            }
            if (!nuevoCliente.telefono.trim()) {
                error('El teléfono es obligatorio');
                setLoading(false);
                return;
            }
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(nuevoCliente.telefono.replace(/[-\s]/g, ''))) {
                error('El teléfono debe tener 10 dígitos');
                setLoading(false);
                return;
            }
            if (nuevoCliente.correo) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(nuevoCliente.correo)) {
                    error('El formato del correo no es válido');
                    setLoading(false);
                    return;
                }
            }
            await onClienteAgregado({
                ...nuevoCliente,
                tipo: 'no_registrado',
                nombre_completo: nuevoCliente.nombre, // Asegurar que tenga nombre_completo
                telefono: nuevoCliente.telefono,
                correo: nuevoCliente.correo || ''
            });
            onClose();
        }
    } catch (error) {
        setErrorMsg(error.message);
        error(error.message);
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-blur">
      <div className="bg-[#1E2837] rounded-lg shadow-xl w-full max-w-lg p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl">×</button>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-100">Agregar Cliente al Historial</h2>
        {errorMsg && <div className="mb-4 text-red-500 text-sm">{errorMsg}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4 mb-4">
            <label className="flex items-center text-gray-300">
              <input
                type="radio"
                checked={esClienteRegistrado}
                onChange={() => setEsClienteRegistrado(true)}
                className="mr-2 accent-[#7152EC]"
              />
              Cliente registrado
            </label>
            <label className="flex items-center text-gray-300">
              <input
                type="radio"
                checked={!esClienteRegistrado}
                onChange={() => setEsClienteRegistrado(false)}
                className="mr-2 accent-[#7152EC]"
              />
              Cliente nuevo/no registrado
            </label>
          </div>
          {esClienteRegistrado ? (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Seleccionar Cliente</label>
              <select
                value={selectedClienteId}
                onChange={e => setSelectedClienteId(e.target.value)}
                className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
                required
              >
                <option value="">Seleccione un cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} {cliente.apellido || ""}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
              <input
                type="text"
                value={nuevoCliente.nombre}
                onChange={e => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
                required
              />
              <label className="block text-sm font-medium text-gray-300 mb-1">Teléfono</label>
              <input
                type="tel"
                value={nuevoCliente.telefono}
                onChange={e => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
                className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
                required
              />
              <label className="block text-sm font-medium text-gray-300 mb-1">Correo</label>
              <input
                type="email"
                value={nuevoCliente.correo}
                onChange={e => setNuevoCliente({ ...nuevoCliente, correo: e.target.value })}
                className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
              />
            </div>
          )}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-gray-200">Cancelar</button>
            <button
              type="submit"
              className={`px-6 py-2 rounded-md ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-[#7152EC] text-white hover:bg-purple-700"}`}
              disabled={loading}
            >
              {loading ? "Cargando..." : (esClienteRegistrado ? "Agregar al historial" : "Registrar Cliente")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ModalAgregarClienteHistorial.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClienteAgregado: PropTypes.func.isRequired
};

export default ModalAgregarClienteHistorial;
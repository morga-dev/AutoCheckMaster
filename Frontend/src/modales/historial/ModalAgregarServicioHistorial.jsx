import { useState } from "react";
import { Wrench, FileText } from "lucide-react";
import PropTypes from 'prop-types';
import { UsoToast } from '../../contexto/UsoToast';

const ModalAgregarServicioHistorial = ({
  isOpen,
  onClose,
  vehiculo,
  onServicioAgregado,
  onCleanup
}) => {
  // Obtener la fecha actual en formato YYYY-MM-DD
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const fechaActual = today.toISOString().split('T')[0];

  const [form, setForm] = useState({
    nombre_servicio: "",
    descripcion: "",
    fecha: fechaActual, // Establecer la fecha actual por defecto
    pdf_orden: null
  });
  const [loading, setLoading] = useState(false);
  const { error } = UsoToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        // Validar nombre del servicio
        if (!form.nombre_servicio.trim()) {
            error('El nombre del servicio es obligatorio');
            setLoading(false);
            return;
        }
        if (form.nombre_servicio.length > 100) {
            error('El nombre del servicio no puede exceder los 100 caracteres');
            setLoading(false);
            return;
        }

        // Validar descripción
        if (!form.descripcion.trim()) {
            error('La descripción es obligatoria');
            setLoading(false);
            return;
        }
        if (form.descripcion.length > 500) {
            error('La descripción no puede exceder los 500 caracteres');
            setLoading(false);
            return;
        }

        // Validar fecha: solo se permite la fecha local actual
        const hoyStr = new Date().toISOString().split('T')[0];
        if (form.fecha !== hoyStr) {
          error('Solo se permite la fecha actual local para el servicio');
          setLoading(false);
          return;
        }

        // Validar PDF
        if (!form.pdf_orden) {
            error('Debe adjuntar el PDF de la orden');
            setLoading(false);
            return;
        }
        
        // Validar tamaño y tipo de archivo PDF
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (form.pdf_orden.size > maxSize) {
            error('El archivo PDF no debe superar los 5MB');
            setLoading(false);
            return;
        }
        if (form.pdf_orden.type !== 'application/pdf') {
            error('El archivo debe ser un PDF');
            setLoading(false);
            return;
        }

        // Si todas las validaciones pasan, crear FormData y enviar
        const formData = new FormData();
        formData.append('nombre_servicio', form.nombre_servicio);
        formData.append('descripcion', form.descripcion);
        formData.append('fecha_servicio', form.fecha);
        formData.append('pdf_orden', form.pdf_orden);

        await onServicioAgregado(formData);
        onClose();
    } catch (err) {
        error(err.message || 'Error al agregar el servicio');
    } finally {
        setLoading(false);
    }
  };

  const handleClose = () => {
    if (onCleanup) {
      onCleanup();
    }
    onClose();
  };

  const handleFileChange = (e) => {
    setForm({
      ...form,
      pdf_orden: e.target.files[0]
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  if (!isOpen || !vehiculo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-blur">
      <div className="bg-[#1E2837] rounded-lg shadow-xl w-full max-w-lg p-6">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl">×</button>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-100 flex items-center gap-2">
          <Wrench size={24} /> Nuevo Servicio para {vehiculo.marca} {vehiculo.modelo}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nombre del servicio
            </label>
            <input
              type="text"
              name="nombre_servicio"
              value={form.nombre_servicio}
              onChange={handleChange}
              className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Descripción del servicio</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
              required
              disabled
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
              <FileText size={18} /> Adjuntar PDF de orden (Obligatorio)
            </label>
            <input
              type="file"
              name="pdf_orden"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full text-gray-200"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-400 hover:text-gray-200">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-[#7152EC] text-white rounded-md hover:bg-purple-700" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ModalAgregarServicioHistorial.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  vehiculo: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    marca: PropTypes.string.isRequired,
    modelo: PropTypes.string.isRequired,
    placa: PropTypes.string,
    numero_serie: PropTypes.string,
    anio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    kilometraje: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  onServicioAgregado: PropTypes.func.isRequired,
  onCleanup: PropTypes.func
};

export default ModalAgregarServicioHistorial;
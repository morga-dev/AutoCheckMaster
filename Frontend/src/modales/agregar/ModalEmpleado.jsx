import React, { useState, useEffect } from "react";
import { User, Phone, UserPlus, Wrench } from "lucide-react";
import axios from 'axios';
import { UsoToast } from "../../contexto/UsoToast";

const ModalEmpleado = ({ isOpen, onClose, onSubmit }) => {
  const { error } = UsoToast();
  const [especialidades, setEspecialidades] = useState([]);
  const initialFormData = {
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    edad: "",
    curp: "",
    rfc: "",
    domicilio: "",
    telefono_casa: "",
    celular: "",
    email: "",
    anos_experiencia: "",
    contacto_nombre: "",
    contacto_parentesco: "",
    contacto_telefono: "",
    fecha_registro: new Date().toISOString().split('T')[0],
    especialidades: []
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isOpen) {
      const fetchEspecialidades = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/especialidades');
          setEspecialidades(response.data);
        } catch (error) {
          // Error
        }
      };
      fetchEspecialidades();
    }
  }, [isOpen]);

  // Reiniciar el formulario cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEspecialidadesChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      especialidades: checked 
        ? [...prev.especialidades, Number(value)]
        : prev.especialidades.filter(id => id !== Number(value))
    }));
  };

  const handleFechaNacimientoChange = (e) => {
    const fechaNacimiento = new Date(e.target.value);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    
    setFormData(prev => ({
      ...prev,
      fecha_nacimiento: e.target.value,
      edad: edad.toString()
    }));
  };

  const validateForm = () => {
    if (formData.curp.length !== 18) {
      error('La CURP debe tener 18 caracteres');
      return false;
    }
    
    if (formData.rfc.length !== 13) {
      error('El RFC debe tener 13 caracteres');
      return false;
    }
    
    if (formData.especialidades.length === 0) {
      error('Debe seleccionar al menos una especialidad');
      return false;
    }
    
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.celular.replace(/\D/g, ''))) {
      error('El número de celular debe tener 10 dígitos');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const empleadoData = { ...formData };
      if (onSubmit) {
        await onSubmit(empleadoData);
      } else {
        await axios.post('http://localhost:5000/api/empleados', empleadoData);
      }
      setFormData(initialFormData); // Limpiar el formulario después del éxito
      if (onClose) onClose();
    } catch (err) {
      error(err.response?.data?.message || 'Error al registrar el empleado');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 p-5 modal-blur overflow-y-auto hide-scrollbar">
      <div className="w-full max-w-4xl mx-auto my-12 bg-[#1E2837] rounded-lg shadow-xl border border-gray-700 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl"
          aria-label="Cerrar"
        >
          ×
        </button>
        <div className="bg-[#1E2837] rounded-lg shadow-xl border border-gray-700 p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">
            <UserPlus className="inline-block mr-2 text-[#7152EC]" />
            Registro de Nuevo Empleado
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos Personales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1C64F1] flex items-center">
                <User className="mr-2" />
                Datos Personales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleFechaNacimientoChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent
                             [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Edad
                  </label>
                  <input
                    type="number"
                    name="edad"
                    value={formData.edad}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    CURP (18 Caracteres)*
                  </label>
                  <input
                    type="text"
                    name="curp"
                    value={formData.curp}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    RFC (13 Caracteres)*
                  </label>
                  <input
                    type="text"
                    name="rfc"
                    value={formData.rfc}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Domicilio *
                  </label>
                  <input
                    type="text"
                    name="domicilio"
                    value={formData.domicilio}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Teléfono Casa
                  </label>
                  <input
                    type="tel"
                    name="telefono_casa"
                    value={formData.telefono_casa}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Celular *
                  </label>
                  <input
                    type="tel"
                    name="celular"
                    value={formData.celular}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Años de experiencia *
                  </label>
                  <input
                    type="number"
                    name="anos_experiencia"
                    value={formData.anos_experiencia}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
            {/* Contacto de Emergencia */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#E60001] flex items-center">
                <Phone className="mr-2" />
                Contacto de Emergencia
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre del contacto *
                  </label>
                  <input
                    type="text"
                    name="contacto_nombre"
                    value={formData.contacto_nombre}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Parentesco *
                  </label>
                  <input
                    type="text"
                    name="contacto_parentesco"
                    value={formData.contacto_parentesco}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Teléfono de contacto *
                  </label>
                  <input
                    type="tel"
                    name="contacto_telefono"
                    value={formData.contacto_telefono}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 
                             focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
            {/* Especialidades */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#0E9E6E] flex items-center">
                <Wrench className="mr-2" />
                Especialidades
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-700 rounded-md bg-[#00132e]">
                {especialidades.map(esp => (
                  <div key={esp.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={`esp-${esp.id}`}
                      name="especialidades"
                      value={esp.id}
                      checked={formData.especialidades.includes(esp.id)}
                      onChange={handleEspecialidadesChange}
                      className="h-4 w-4 bg-[#1E2837] border-gray-700 text-[#7152EC] 
                               focus:ring-[#7152EC] focus:ring-offset-0 rounded"
                    />
                    <label 
                      htmlFor={`esp-${esp.id}`}
                      className="text-sm font-medium text-gray-300 cursor-pointer hover:text-[#7152EC]"
                    >
                      {esp.nombre}
                    </label>
                  </div>
                ))}
              </div>
              {formData.especialidades.length === 0 && (
                <p className="text-[#E60001] text-sm mt-2">
                  Seleccione al menos una especialidad
                </p>
              )}
            </div>
            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#7152EC] text-white rounded-md hover:bg-purple-700 
                         transform transition-all duration-300 hover:scale-[1.02] flex items-center"
              >
                <UserPlus className="mr-2" size={20} />
                Registrar Empleado
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalEmpleado;
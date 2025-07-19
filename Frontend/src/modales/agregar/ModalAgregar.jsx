import React, { useState } from "react";
import { FaUser, FaClipboard, FaCalendarAlt, FaMoneyBillWave, FaTruck, FaUserTie } from "react-icons/fa";
import ModalGasto from "./ModalGasto";
import ModalOrden from "./ModalOrden";
import ModalProveedor from "./ModalProveedor";
import ModalEmpleado from "./ModalEmpleado";
import ModalCita from "./ModalCita";
import ModalCliente from "./ModalCliente";

const opciones = [
  { key: "cliente", label: "Cliente", icon: <FaUser size={30} />, color: "text-[#E60001]", shadow: "hover:shadow-red-500/20" },
  { key: "cita", label: "Cita", icon: <FaCalendarAlt size={40} />, color: "text-[#E60001]", shadow: "hover:shadow-red-500/20" },
  { key: "proveedor", label: "Proveedor", icon: <FaTruck size={40} />, color: "text-[#0E9E6E]", shadow: "hover:shadow-green-500/20" },
  { key: "empleado", label: "Empleado", icon: <FaUserTie size={40} />, color: "text-[#0E9E6E]", shadow: "hover:shadow-green-500/20" },
  { key: "orden", label: <>Orden <br />de Servicio</>, icon: <FaClipboard size={40} />, color: "text-blue-500", shadow: "hover:shadow-blue-500/20" },
  { key: "gastos", label: "Gasto", icon: <FaMoneyBillWave size={40} />, color: "text-blue-500", shadow: "hover:shadow-blue-500/20" },
];

const ModalAgregar = ({ isOpen, onClose, onSelect }) => {
  const [showGastoModal, setShowGastoModal] = useState(false);
  const [showOrdenModal, setShowOrdenModal] = useState(false);
  const [showProveedorModal, setShowProveedorModal] = useState(false);
  const [showEmpleadoModal, setShowEmpleadoModal] = useState(false);
  const [showCitaModal, setShowCitaModal] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);

  const handleSelect = (key) => {
    if (key === "gastos") {
      onClose();
      setTimeout(() => setShowGastoModal(true), 300);
    } else if (key === "orden") {
      onClose();
      setTimeout(() => setShowOrdenModal(true), 250);
    } else if (key === "proveedor") {
      onClose();
      setTimeout(() => setShowProveedorModal(true), 250);
    } else if (key === "empleado") {
      onClose();
      setTimeout(() => setShowEmpleadoModal(true), 250);
    } else if (key === "cita") {
      onClose();
      setTimeout(() => setShowCitaModal(true), 250);
    } else if (key === "cliente") {
      onClose();
      setTimeout(() => setShowClienteModal(true), 250);
    } else {
      onSelect(key);
    }
  };

  // Función para manejar el submit del formulario de orden
  const handleAgregarOrden = async (ordenData) => {
    setShowOrdenModal(false);
  };

  // Función para manejar el submit del formulario de proveedor
  const handleAgregarProveedor = async (proveedorData) => {
    setShowProveedorModal(false);
  };

  // Función para manejar el submit del formulario de empleado
  const handleAgregarEmpleado = async (empleadoData) => {
    setShowEmpleadoModal(false);
  };

  // Función para manejar el submit del formulario de cita
  const handleAgregarCita = async (citaData) => {
    setShowCitaModal(false);
  };

  // Función para manejar el submit del formulario de cliente
  const handleAgregarCliente = async (clienteData) => {
    setShowClienteModal(false);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 modal-overlay overflow-y-scroll hide-scrollbar">
          <div className="p-8 w-full max-w-3xl bg-[#1E2837] rounded-2xl shadow-lg border border-gray-700 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl"
              aria-label="Cerrar"
            >
              ×
            </button>
            <h2 className="text-4xl font-extrabold text-center text-gray-100 mb-8">Agregar</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-20 justify-items-center">
              {opciones.map(op => (
                <button
                  key={op.key}
                  onClick={() => handleSelect(op.key)}
                  className={`flex flex-col items-center justify-center w-36 h-36 bg-[#1E2837] ${op.color} rounded-2xl border border-gray-700 shadow-lg ${op.shadow} transform transition-all hover:scale-105 duration-300`}
                >
                  {op.icon}
                  <span className="mt-4 text-sm font-medium text-gray-200">{op.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <ModalGasto
        isOpen={showGastoModal}
        onClose={() => setShowGastoModal(false)}
        onSubmit={() => setShowGastoModal(false)}
      />
      <ModalOrden
        isOpen={showOrdenModal}
        onClose={() => setShowOrdenModal(false)}
        onSubmit={handleAgregarOrden}
      />
      <ModalProveedor
        isOpen={showProveedorModal}
        onClose={() => setShowProveedorModal(false)}
        onSubmit={handleAgregarProveedor}
      />
      <ModalEmpleado
        isOpen={showEmpleadoModal}
        onClose={() => setShowEmpleadoModal(false)}
        onSubmit={handleAgregarEmpleado}
      />
      <ModalCita
        isOpen={showCitaModal}
        onClose={() => setShowCitaModal(false)}
        onSubmit={handleAgregarCita}
      />
      <ModalCliente
        isOpen={showClienteModal}
        onClose={() => setShowClienteModal(false)}
        onSubmit={handleAgregarCliente}
      />
    </>
  );
};

export default ModalAgregar;
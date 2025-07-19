import React, { useRef, useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { 
  FileDown, 
  User, 
  Car, 
  Clipboard, 
  Clock, 
  PenTool, 
  Search, 
  Wrench,
  DollarSign,
  Loader2
} from "lucide-react";
import axios from 'axios';
import OrdenPDF from "./PDFs/OrdenPDF";
import { UsoToast } from '../contexto/UsoToast';

const FormatoOrden = () => {

  const { success, error } = UsoToast();

  const pdfRef = useRef();
  const [searchFolio, setSearchFolio] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isPdfView, setIsPdfView] = useState(false);
  const [showPdfDownload, setShowPdfDownload] = useState(false);
  
  const [formData, setFormData] = useState({
    folio: "",
    // Datos del Cliente
    nombre: "",
    telefono: "",
    correo: "",
    
    // Datos del Vehículo
    noSerie: "",
    placa: "",
    modelo: "",
    marca: "",
    
    // Datos del Servicio
    tecnico: "",
    servicio: "",
    descripcion: "",
    insumos: "",
    observaciones: "",
    
    // Fechas
    fechaInicio: "",
    fechaFin: "",
    
    // Firma
    firma: "",

    // Checklist
    checklist: {
      documentos: false,
      llaves: false,
      herramientas: false,
      accesorios: false,
      combustible: false
    }
  });

  const [checklistEntrega, setChecklistEntrega] = useState({
    documentos: false,
    llaves: false,
    herramientas: false,
    accesorios: false,
    combustible: false
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const buscarOrden = async () => {
    if (!searchFolio.trim()) {
      setErrorMsg("Ingrese un folio para buscar");
      error("Ingrese un folio para buscar");
      return;
    }
    setErrorMsg("");

    try {
      const response = await axios.get(`http://localhost:5000/api/ordenes/folio/${searchFolio}`);
      const orden = response.data;

      if (orden) {
        setFormData({
          ...formData,
          folio: orden.folio,
          nombre: orden.cliente_nombre || "",
          telefono: orden.celular || orden.telefono || "",
          correo: orden.correo || "",
          noSerie: orden.numero_serie || "",
          placa: orden.placa || "",
          modelo: orden.modelo || "",
          marca: orden.marca || "",
          tecnico: orden.tecnico_nombre || "",
          servicio: orden.servicio_nombre || "",
          descripcion: orden.descripcion_actividad || "",
          insumos: orden.insumos_utilizados || "",
          observaciones: orden.observaciones || "",
          fechaInicio: orden.fecha_inicio ? new Date(orden.fecha_inicio).toISOString().slice(0, 16) : "",
          fechaFin: orden.fecha_fin ? new Date(orden.fecha_fin).toISOString().slice(0, 16) : "",
          checklist: orden.checklist || {
            documentos: false,
            llaves: false,
            herramientas: false,
            accesorios: false,
            combustible: false
          }
        });
        setChecklistEntrega(orden.checklist || {
          documentos: false,
          llaves: false,
          herramientas: false,
          accesorios: false,
          combustible: false
        });
        success("Orden encontrada correctamente");
      } else {
        const errorMessage = "No se encontró la orden con ese folio";
        setErrorMsg(errorMessage);
        error(errorMessage);
      }
    } catch (err) {
      const errorMessage = "Error al buscar la orden";
      setErrorMsg(errorMessage);
      error(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderField = (name, label, type = "text") => {
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-200">{label}</label>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="w-full p-2 bg-[#1E2837] border border-gray-700 rounded-md text-gray-200 focus:border-[#7152EC] focus:ring-1 focus:ring-[#7152EC]          
          [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
        />
      </div>
    );
  };

  const handleChecklistChange = (item) => {
    setChecklistEntrega(prev => {
      const newChecklist = {
        ...prev,
        [item]: !prev[item]
      };
      
      // Actualizar formData con el nuevo estado del checklist
      setFormData(prev => ({
        ...prev,
        checklist: newChecklist
      }));
      
      return newChecklist;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-[#7152EC]" size={48} />
        <span className="ml-4 text-lg text-gray-200">Cargando formato...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-[#00132e]">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-center border-b-2 border-[#7152EC] pb-6">
        <div>
          <h1 className="text-4xl font-bold text-[#1C64F1] mb-2">Orden de Servicio</h1>
          <p className="text-lg font-bold text-gray-300 mt-1">AutoCheckMaster</p>
          <address className="not-italic mt-2 text-sm text-gray-400 leading-relaxed">
            Av. Principal #123, Ciudad<br/>
            Tel: (555) 123-4567<br/>
            Email: contacto@autocheckmaster.com
          </address>
        </div>
        <div className="mt-6 md:mt-0 flex flex-col items-center">
          <img 
            src="/Logo.png" 
            alt="Logo AutoCheck Master" 
            className="w-32 h-32 object-contain"
          />
        </div>
      </header>

      {/* Búsqueda por folio */}
      <div className="mb-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Buscar por Folio
            </label>
            <input
              type="text"
              value={searchFolio}
              onChange={(e) => setSearchFolio(e.target.value)}
              placeholder="Ingrese el folio de la orden..."
              className="w-full p-2 bg-[#1E2837] border border-gray-700 rounded-md text-gray-200 
                       focus:ring-2 focus:ring-[#7152EC] focus:border-transparent pl-10"
            />
          </div>
          <button
            onClick={buscarOrden}
            disabled={loading}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Search size={20} />
            <span>{loading ? "Buscando..." : "Buscar"}</span>
          </button>
        </div>
        {errorMsg && (
          <p className="mt-2 text-sm text-[#E60001]">{errorMsg}</p>
        )}
      </div>

      {/* Información del Cliente y Vehículo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card Cliente */}
        <div className="card border-l-4 border-[#7152EC]">
          <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
            <User className="text-[#7152EC]" size={30}/>
            Información del Cliente
          </h2>
          <div className="space-y-4">
            {renderField("nombre", "Nombre completo")}
            <div className="grid grid-cols-2 gap-4">
              {renderField("telefono", "Teléfono")}
              {renderField("correo", "Correo electrónico")}
            </div>
          </div>
        </div>

        {/* Card Vehículo */}
        <div className="card border-l-4 border-[#1C64F1]">
          <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
            <Car className="text-[#E60001]" size={30}/>
            Información del Vehículo
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {renderField("noSerie", "No. Serie (17 caracteres)")}
            {renderField("placa", "Placa (7 caracteres)")}
            {renderField("modelo", "Modelo")}
            {renderField("marca", "Marca")}
          </div>
        </div>
      </div>

      {/* Datos del Servicio */}
      <div className="card border-l-4 border-[#7152EC] mb-8">
        <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
          <Wrench className="text-[#7152EC]" size={30}/>
          Datos del Servicio
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {renderField("tecnico", "Técnico responsable")}
          {renderField("servicio", "Tipo de servicio")}
        </div>
      </div>

      {/* Descripción de la Actividad */}
      <div className="card border-l-4 border-[#FE6F00] mb-8">
        <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
          <Clipboard className="text-[#FE6F00]" size={30}/>
          Descripción de la Actividad
        </h2>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Describa detalladamente las actividades a realizar..."
          className="w-full h-32 p-2 bg-[#1E2837] border border-gray-700 rounded-md text-gray-200 
                   focus:ring-2 focus:ring-[#FE6F00] focus:border-transparent resize-none"
        />
      </div>

      {/* Insumos Utilizados */}
      <div className="card border-l-4 border-[#0E9E6E] mb-8">
        <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
          <DollarSign className="text-[#0E9E6E]" size={30}/>
          Insumos Utilizados
        </h2>
        <textarea
          name="insumos"
          value={formData.insumos}
          onChange={handleChange}
          placeholder="Liste los insumos utilizados..."
          className="w-full h-32 p-2 bg-[#1E2837] border border-gray-700 rounded-md text-gray-200 
                   focus:ring-2 focus:ring-[#0E9E6E] focus:border-transparent resize-none"
        />
      </div>

      {/* Fechas y Observaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card Fechas */}
        <div className="card border-l-4 border-[#1C64F1]">
          <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
            <Clock className="text-[#1C64F1]" size={30}/>
            Control de Tiempos
          </h2>
          <div className="space-y-4">
            {renderField("fechaInicio", "Fecha y hora de inicio", "datetime-local")}
            {renderField("fechaFin", "Fecha y hora de finalización", "datetime-local")}
          </div>
        </div>

        {/* Card Observaciones */}
        <div className="card border-l-4 border-[#FE6F00]">
          <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
            <PenTool className="text-[#FE6F00]" size={30}/>
            Observaciones
          </h2>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            placeholder="Observaciones adicionales..."
            className="w-full h-32 p-2 bg-[#1E2837] border border-gray-700 rounded-md text-gray-200 
                     focus:ring-2 focus:ring-[#FE6F00] focus:border-transparent resize-none"
          />
        </div>
      </div>

      {/* Entrega */}
      <div className="card border-l-4 border-[#0E9E6E] mb-8">
        <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
          <Clipboard className="text-[#0E9E6E]" size={30}/>
          Entrega del Vehículo
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={checklistEntrega.documentos}
              onChange={() => handleChecklistChange('documentos')}
              className="w-4 h-4 bg-[#1E2837] border-gray-700 rounded text-[#0E9E6E] 
                       focus:ring-[#0E9E6E] focus:ring-offset-[#00132e]"
            />
            <span className="text-gray-200">📄 Documentos</span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={checklistEntrega.llaves}
              onChange={() => handleChecklistChange('llaves')}
              className="w-4 h-4 bg-[#1E2837] border-gray-700 rounded text-[#0E9E6E] 
                       focus:ring-[#0E9E6E] focus:ring-offset-[#00132e]"
            />
            <span className="text-gray-200">🔑 Llaves</span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={checklistEntrega.herramientas}
              onChange={() => handleChecklistChange('herramientas')}
              className="w-4 h-4 bg-[#1E2837] border-gray-700 rounded text-[#0E9E6E] 
                       focus:ring-[#0E9E6E] focus:ring-offset-[#00132e]"
            />
            <span className="text-gray-200">🔧 Herramientas</span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={checklistEntrega.accesorios}
              onChange={() => handleChecklistChange('accesorios')}
              className="w-4 h-4 bg-[#1E2837] border-gray-700 rounded text-[#0E9E6E] 
                       focus:ring-[#0E9E6E] focus:ring-offset-[#00132e]"
            />
            <span className="text-gray-200">📱 Accesorios</span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={checklistEntrega.combustible}
              onChange={() => handleChecklistChange('combustible')}
              className="w-4 h-4 bg-[#1E2837] border-gray-700 rounded text-[#0E9E6E] 
                       focus:ring-[#0E9E6E] focus:ring-offset-[#00132e]"
            />
            <span className="text-gray-200">⛽ Combustible</span>
          </label>
        </div>
      </div>

      {/* Firmas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="text-center bg-[#1E2837] rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.01] border border-gray-700 hover:shadow-blue-500/40">
          <div className="h-20 border-b-2 border-gray-700 mb-4"></div>
          <p className="font-bold text-[#1C64F1]">Firma del Cliente</p>
          <p className="text-sm text-gray-400">Autorización de trabajos</p>
        </div>

        <div className="text-center bg-[#1E2837] rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.01] border border-gray-700 hover:shadow-blue-500/40">
          <div className="h-20 border-b-2 border-gray-700 mb-4"></div>
          <p className="font-bold text-[#1C64F1]">Firma del Técnico</p>
          <p className="text-sm text-gray-400">Responsable del diagnóstico</p>
        </div>
      </div>

      {/* Botón de descarga */}
      <div className="flex justify-end mt-6">
        {!showPdfDownload ? (
          <button
            className="btn btn-secondary flex items-center gap-2"
            onClick={() => setShowPdfDownload(true)}
          >
            <FileDown size={20} />
            <span>Preparar PDF</span>
          </button>
        ) : (
          <PDFDownloadLink
            document={<OrdenPDF formData={formData} />}
            fileName={`OrdenServicio_${formData.nombre || "Cliente"}.pdf`}
            className="btn btn-secondary flex items-center gap-2"
          >
            {({ loading }) => (
              <>
                <FileDown size={20} />
                <span>{loading ? "Generando..." : "Descargar PDF"}</span>
              </>
            )}
          </PDFDownloadLink>
        )}
      </div>
    </div>
  );
};

export default FormatoOrden;

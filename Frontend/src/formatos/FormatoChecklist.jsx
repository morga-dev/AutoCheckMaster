import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileDown, User, Car, Clipboard, PenTool, Camera, Loader2 } from "lucide-react";
import ChecklistPDF from "./PDFs/ChecklistPDF";
import EvidenciasChecklistPDF from "./PDFs/EvidenciasChecklistPDF";

const ELEMENTOS = [
  "Carrocería",
  "Pintura",
  "Parabrisas delantero",
  "Vidrio trasero",
  "Vidrios laterales",
  "Espejos laterales",
  "Faros delanteros",
  "Luces traseras",
  "Luces de freno",
  "Intermitentes delanteros",
  "Intermitentes traseros",
  "Estado general de neumáticos",
  "Estado general de los rines",
  "Asientos",
  "Alfombra",
  "Tablero de instrumento",
  "Batería",
  "Alarma (si aplica)",
  "Tapa de combustible",
  "Indicador de combustible",
  "Niveles de líquidos",
  "Motor (sonidos anormales)"
];

const ESTADOS = [
  { value: "B", label: "Bueno" },
  { value: "R", label: "Regular" },
  { value: "M", label: "Malo" }
];

const FormatoChecklist = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    fechaIngreso: "",
    fechaEntrega: "",
    noSerie: "",
    marca: "",
    modelo: "",
    año: "",
    placas: "",
    color: "",
    observaciones: "",
    firmaResponsable: "",
    firmaCliente: "",
  });

  const [checklist, setChecklist] = useState(
    ELEMENTOS.reduce((acc, el) => {
      acc[el] = { estado: "", observacion: "", evidencia: null };
      return acc;
    }, {})
  );

  const [loading, setLoading] = useState(true);
  const [showPdfDownload, setShowPdfDownload] = useState(false);
  const [showEvidenciasPdf, setShowEvidenciasPdf] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChecklistChange = async (elemento, field, value) => {
    if (field === "evidencia" && value instanceof File) {
      const formDataFile = new FormData();
      formDataFile.append("file", value);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:5000/api/evidencias/upload", {
          method: "POST",
          body: formDataFile,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.url) {
          setChecklist(prev => ({
            ...prev,
            [elemento]: {
              ...prev[elemento],
              evidencia: data.url // Guarda la URL
            }
          }));
        } else {
          alert("Error al subir la evidencia");
        }
      } catch (error) {
        alert("Error al subir la evidencia");
      }
    } else {
      setChecklist(prev => ({
        ...prev,
        [elemento]: {
          ...prev[elemento],
          [field]: value
        }
      }));
    }
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
          <h1 className="text-4xl font-bold text-[#1C64F1] mb-2">Checklist de Vehículo</h1>
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

      {/* Datos del Cliente y Vehículo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Cliente */}
        <div className="card border-l-4 border-[#7152EC]">
          <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
            <User className="text-[#7152EC]" size={30}/>
            Información del Cliente
          </h2>
          <div className="space-y-4">
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre completo" className="input" />
            <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono" className="input" />
            <input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="Correo electrónico" className="input" />
          </div>
        </div>
        {/* Vehículo */}
        <div className="card border-l-4 border-[#1C64F1]">
          <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
            <Car className="text-[#E60001]" size={30}/>
            Información del Vehículo
          </h2>
          <div className="space-y-4">
            <input type="text" name="noSerie" value={formData.noSerie} onChange={handleChange} placeholder="No. Serie (17 caracteres)" className="input" />
            <input type="text" name="marca" value={formData.marca} onChange={handleChange} placeholder="Marca" className="input" />
            <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} placeholder="Modelo" className="input" />
            <input type="text" name="año" value={formData.año} onChange={handleChange} placeholder="Año" className="input" />
            <input type="text" name="placas" value={formData.placas} onChange={handleChange} placeholder="Placas (7 caracteres)" className="input" />
            <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="Color" className="input" />
          </div>
        </div>
      </div>

      {/* Tabla de Checklist */}
      <div className="card border-l-4 border-[#FE6F00] mb-8">
        <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
          <Clipboard className="text-[#FE6F00]" size={30}/>
          Inspección de Componentes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-gray-200">
            <thead className="bg-[#1E2837]">
              <tr>
                <th className="p-2 text-left">Elemento</th>
                <th className="p-2 text-center">Estado</th>
                <th className="p-2 text-left">Observaciones</th>
                <th className="p-2 text-center">Evidencia</th>
              </tr>
            </thead>
            <tbody>
              {ELEMENTOS.map((el) => (
                <tr key={el} className="border-b border-gray-700">
                  <td className="p-2">{el}</td>
                  <td className="p-2 text-center">
                    <select
                      value={checklist[el].estado}
                      onChange={e => handleChecklistChange(el, "estado", e.target.value)}
                      className="bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
                    >
                      <option value="">Seleccionar</option>
                      {ESTADOS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={checklist[el].observacion}
                      onChange={e => handleChecklistChange(el, "observacion", e.target.value)}
                      className="w-full bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
                      placeholder="Observaciones"
                    />
                  </td>
                  <td className="p-2 text-center">
                    {/* Si quieres permitir evidencia fotográfica */}
                    <label className="flex items-center gap-1 cursor-pointer">
                      <Camera size={18} />
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={e => handleChecklistChange(el, "evidencia", e.target.files[0])}
                      />
                      {checklist[el].evidencia && (
                        <span className="text-xs text-green-400">✓</span>
                      )}
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Leyenda */}
        <div className="mt-4 text-sm text-gray-400">
          <strong>Leyenda:</strong> <span className="text-green-400">Bueno</span> = Sin daños, funciona correctamente.{" "}
          <span className="text-yellow-400">Regular</span> = Desgaste o detalles menores.{" "}
          <span className="text-red-400">Malo</span> = Daños graves, requiere reparación o reemplazo.
        </div>
      </div>

      {/* Observaciones generales */}
      <div className="card border-l-4 border-[#0E9E6E] mb-8">
        <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
          <PenTool className="text-[#0E9E6E]" size={30}/>
          Observaciones Generales
        </h2>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          placeholder="Observaciones generales del vehículo..."
          className="w-full h-24 p-2 bg-[#1E2837] border border-gray-700 rounded-md text-gray-200"
        />
      </div>

      {/* Firmas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="text-center bg-[#1E2837] rounded-2xl shadow-xl p-8
        transform transition-all duration-300 hover:scale-[1.01] border border-gray-700 hover:shadow-blue-500/40">
          <div className="h-20 border-b-2 border-gray-700 mb-4"></div>
          <p className="font-bold text-[#1C64F1]">Firma del Cliente</p>
          <p className="text-sm text-gray-400">Autorización de revisión</p>
        </div>
        <div className="text-center bg-[#1E2837] rounded-2xl shadow-xl p-8
        transform transition-all duration-300 hover:scale-[1.01] border border-gray-700 hover:shadow-blue-500/40">
          <div className="h-20 border-b-2 border-gray-700 mb-4"></div>
          <p className="font-bold text-[#1C64F1]">Firma del Técnico</p>
          <p className="text-sm text-gray-400">Responsable de la inspección</p>
        </div>
      </div>

      {/* Botón de descarga Checklist PDF */}
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
            document={
              <ChecklistPDF
                formData={formData}
                checklistItems={checklist}
              />
            }
            fileName={`Checklist_${formData.nombre || "Cliente"}.pdf`}
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
      {/* Botón de descarga Evidencias PDF */}
      <div className="flex justify-end mt-4">
        {!showEvidenciasPdf ? (
          <button
            className="btn btn-secondary flex items-center gap-2"
            onClick={() => setShowEvidenciasPdf(true)}
          >
            <FileDown size={20} />
            <span>Preparar Evidencias</span>
          </button>
        ) : (
          <PDFDownloadLink
            document={<EvidenciasChecklistPDF checklistItems={checklist} />}
            fileName={`EvidenciasChecklist_${formData.nombre || "Cliente"}.pdf`}
            className="btn btn-secondary flex items-center gap-2"
          >
            {({ loading }) => (
              <>
                <FileDown size={20} />
                <span>{loading ? "Generando..." : "Descargar Evidencias"}</span>
              </>
            )}
          </PDFDownloadLink>
        )}
      </div>
    </div>
  );
};

export default FormatoChecklist;
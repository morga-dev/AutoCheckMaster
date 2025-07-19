import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileDown, User, Car, Clipboard, DollarSign, PenTool, Trash2, Wrench, Loader2 } from "lucide-react";
import CotizacionPDF from "./PDFs/CotizacionPDF";

const FormatoCotizacion = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    correo: "",
    telefono: "",
    noSerie: "",
    modelo: "",
    marca: "",
    color: "",
    placas: "",
    observaciones: ""
  }); // Removido el campo "año"

  const [refacciones, setRefacciones] = useState([
    { cantidad: "", descripcion: "", precio: "", subtotal: "" },
  ]);

  const [manosDeObra, setManosDeObra] = useState([
    { descripcion: "", precio: "" }
  ]);

  const [isPdfView, setIsPdfView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPdfDownload, setShowPdfDownload] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRefaccionChange = (index, field, value) => {
    const newRefacciones = [...refacciones];
    newRefacciones[index][field] = value;

    // Calcular subtotal
    if (field === "cantidad" || field === "precio") {
      const cantidad = parseFloat(newRefacciones[index].cantidad) || 0;
      const precio = parseFloat(newRefacciones[index].precio) || 0;
      newRefacciones[index].subtotal = (cantidad * precio).toFixed(2);
    }

    setRefacciones(newRefacciones);
  };

  const handleManoDeObraChange = (index, field, value) => {
    const newManosDeObra = [...manosDeObra];
    newManosDeObra[index][field] = value;
    setManosDeObra(newManosDeObra);
  };

  const addRefaccion = () => {
    setRefacciones([...refacciones, { cantidad: "", descripcion: "", precio: "", subtotal: "" }]);
  };

  const addManoDeObra = () => {
    setManosDeObra([...manosDeObra, { descripcion: "", precio: "" }]);
  };

  const removeRefaccion = (index) => {
    setRefacciones(refacciones.filter((_, i) => i !== index));
  };

  const removeManoDeObra = (index) => {
    setManosDeObra(manosDeObra.filter((_, i) => i !== index));
  };

  const calcularTotales = () => {
    const subtotalRefacciones = refacciones.reduce((acc, item) => acc + parseFloat(item.subtotal || 0), 0);
    const subtotalManoDeObra = manosDeObra.reduce((acc, item) => acc + parseFloat(item.precio || 0), 0);
    return {
      subtotalRefacciones: subtotalRefacciones.toFixed(2),
      subtotalManoDeObra: subtotalManoDeObra.toFixed(2),
      total: (subtotalRefacciones + subtotalManoDeObra).toFixed(2)
    };
  };

  const renderField = (name, label, type = "text") => {
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-200">
          {label}
        </label>
        {type === "textarea" ? (
          <textarea
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="w-full p-2 bg-[#1E2837] border border-gray-700 rounded-md text-gray-200"
            rows="3"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="w-full p-2 bg-[#1E2837] border border-gray-700 rounded-md text-gray-200 
                     focus:ring-2 focus:ring-[#7152EC] focus:border-transparent"
          />
        )}
      </div>
    );
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
          <h1 className="text-4xl font-bold text-[#1C64F1] mb-2">Hoja de Cotización</h1>
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
            {renderField("direccion", "Dirección")}
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
            {renderField("modelo", "Modelo")}
            {renderField("marca", "Marca")}
            {renderField("color", "Color")}
            {renderField("placas", "Placas (7 caracteres)")}
          </div>
        </div>
      </div>

      {/* Refacciones */}
      <h3 className="text-base font-semibold text-gray-200 flex items-center mb-3">
        <Clipboard className="mr-2" size={18} /> Refacciones
      </h3>
      <div className="mb-4">
        {isPdfView ? (
          <table className="w-full mb-4">
            <thead className="bg-[#1E2837]">
              <tr>
                <th className="px-4 py-2 text-left text-gray-200">Cantidad</th>
                <th className="px-4 py-2 text-left text-gray-200">Descripción</th>
                <th className="px-4 py-2 text-left text-gray-200">Precio unit.</th>
                <th className="px-4 py-2 text-left text-gray-200">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {refacciones.map((item, index) => (
                <tr key={index}>
                  <td className="border-b px-4 py-2">{item.cantidad}</td>
                  <td className="border-b px-4 py-2">{item.descripcion}</td>
                  <td className="border-b px-4 py-2">${item.precio}</td>
                  <td className="border-b px-4 py-2">${item.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <>
            {refacciones.map((item, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 mb-2">
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={item.cantidad}
                  onChange={(e) => handleRefaccionChange(index, "cantidad", e.target.value)}
                  className="p-2 bg-[#1E2837] border border-gray-700 rounded-md text-gray-200"
                />
                <input
                  type="text"
                  placeholder="Descripción"
                  value={item.descripcion}
                  onChange={(e) => handleRefaccionChange(index, "descripcion", e.target.value)}
                  className="p-2 bg-[#1E2837] border border-gray-700 rounded-md text-gray-200 col-span-2"
                />
                <input
                  type="number"
                  placeholder="Precio unit."
                  value={item.precio}
                  onChange={(e) => handleRefaccionChange(index, "precio", e.target.value)}
                  className="p-2 bg-[#1E2837] border border-gray-700 rounded-md text-gray-200"
                />
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#1E2837] border border-gray-700 rounded-md text-gray-200 flex-1">
                    ${item.subtotal}
                  </div>
                  {refacciones.length > 1 && (
                    <button
                      onClick={() => removeRefaccion(index)}
                      className="text-[#E60001] hover:text-red-400"
                      title="Eliminar refacción"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button 
              onClick={addRefaccion}
              className="mt-2 text-[#7152EC] hover:text-purple-400 flex items-center gap-1"
            >
              <span>+ Agregar refacción</span>
            </button>
          </>
        )}
      </div>

      {/* Mano de Obra */}
      <h3 className="text-base font-semibold text-gray-200 flex items-center mb-3">
        <Wrench className="mr-2" size={18} /> Servicios
      </h3>
      <div className="mb-4">
        {isPdfView ? (
          <table className="w-full mb-4">
            <thead className="bg-[#1E2837]">
              <tr>
                <th className="px-4 py-2 text-left text-gray-200">Descripción del trabajo</th>
                <th className="px-4 py-2 text-left text-gray-200">Importe</th>
              </tr>
            </thead>
            <tbody>
              {manosDeObra.map((item, index) => (
                <tr key={index}>
                  <td className="border-b px-4 py-2">{item.descripcion}</td>
                  <td className="border-b px-4 py-2">${item.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <>
            {manosDeObra.map((item, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-2">
                <input
                  type="text"
                  placeholder="Descripción del trabajo"
                  value={item.descripcion}
                  onChange={(e) => handleManoDeObraChange(index, "descripcion", e.target.value)}
                  className="p-2 border rounded-md col-span-1 sm:col-span-2"
                />
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-2">
                  <input
                    type="number"
                    placeholder="Importe"
                    value={item.precio}
                    onChange={(e) => handleManoDeObraChange(index, "precio", e.target.value)}
                    className="p-2 border rounded-md col-span-1 sm:col-span-2"
                  />
                  {manosDeObra.length > 1 && (
                    <button
                      onClick={() => removeManoDeObra(index)}
                      className="text-red-500 hover:text-red-700"
                      title="Eliminar trabajo"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button 
              onClick={addManoDeObra}
              className="mt-2 text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <span>+ Agregar trabajo</span>
            </button>
          </>
        )}
      </div>

      {/* Observaciones y Totales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card Observaciones */}
        <div className="card border-l-4 border-[#FE6F00] mt-4">
          <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
            <PenTool className="text-[#FE6F00]" />
            Observaciones
          </h2>
          <textarea
            placeholder="Observaciones adicionales sobre el vehículo o los servicios..."
            value={formData.observaciones}
            onChange={(e) => handleChange({ target: { name: 'observaciones', value: e.target.value } })}
            className="w-full h-32 p-2 bg-[#1E2837] border border-gray-700 rounded-md text-gray-200 
                     focus:ring-2 focus:ring-[#FE6F00] focus:border-transparent resize-none"
          />
        </div>

        {/* Card Totales */}
        <div className="card border-l-4 mt-4 border-[#0E9E6E]">
          <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
            <DollarSign className="text-[#0E9E6E]" size={30} />
            Resumen de Costos
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between p-2 bg-[#1E2837] border border-gray-700 rounded-md">
              <span className="text-gray-300">Subtotal refacciones:</span>
              <span className="font-medium text-[#0E9E6E]">${calcularTotales().subtotalRefacciones}</span>
            </div>
            <div className="flex justify-between p-2 bg-[#1E2837] border border-gray-700 rounded-md">
              <span className="text-gray-300">Subtotal mano de obra:</span>
              <span className="font-medium text-[#0E9E6E]">${calcularTotales().subtotalManoDeObra}</span>
            </div>
            <div className="flex justify-between p-3 bg-[#1E2837] border-2 border-[#0E9E6E] rounded-md">
              <span className="font-bold text-gray-100">Total a Pagar:</span>
              <span className="font-bold text-[#0E9E6E]">${calcularTotales().total}</span>
            </div>
          </div>
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
            document={
              <CotizacionPDF
                formData={formData}
                refacciones={refacciones}
                manosDeObra={manosDeObra}
                calcularTotales={calcularTotales}
              />
            }
            fileName={`Cotizacion_${formData.nombre || "Cliente"}.pdf`}
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

export default FormatoCotizacion;

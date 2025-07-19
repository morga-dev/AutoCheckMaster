import React, { useState, useEffect } from "react";
import { Building2, Globe, MapPin, Calendar, Briefcase, Upload, Trash2, Phone } from "lucide-react";
import axios from 'axios';
import { UsoToast } from '../contexto/UsoToast';

const Empresa = () => {
  const { success, error } = UsoToast();
  
  const [empresaData, setEmpresaData] = useState({
    nombre: "",
    rama: "",
    anioIncorporacion: "",
    sitioWeb: "",
    direccion: "",
    ciudad: "",
    estado: "",
    codigoPostal: "",
    telefono: "",
    logo: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tempData, setTempData] = useState({...empresaData});
  const [previewLogo, setPreviewLogo] = useState(empresaData.logo);

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/empresa');
        if (response.data) {
          setEmpresaData(response.data);
          setTempData(response.data);
          setPreviewLogo(response.data.logo);
        }
      } catch (error) {
        error('Error al cargar los datos de la empresa');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmpresa();
  }, []);

  const handleSave = async () => {
    try {
        const requiredFields = [
            'nombre', 
            'rama', 
            'anioIncorporacion', 
            'sitioWeb', 
            'direccion', 
            'ciudad', 
            'estado', 
            'codigoPostal',
            'telefono'
        ];
        
        for (const field of requiredFields) {
            if (!tempData[field]) {
                error(`Por favor complete el campo ${field}`);
                return;
            }
        }

        const dataToSave = {...tempData, logo: previewLogo};
        const response = await axios.put('http://localhost:5000/api/empresa', dataToSave);
        
        if (response.data) {
            setEmpresaData(response.data);
            setIsEditing(false);
            success('Información de la empresa actualizada correctamente');
            
            // Emitir evento personalizado con el nuevo logo
            const event = new CustomEvent('logoUpdated', { 
                detail: { logo: response.data.logo } 
            });
            window.dispatchEvent(event);
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al guardar los cambios';
        error('Error al guardar los cambios: ' + errorMessage);
    }
};

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño de archivo (5MB máximo)
      if (file.size > 5242880) { // 5MB en bytes
        error('La imagen es demasiado grande. El tamaño máximo es 5MB.');
        return;
      }

      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Comprimir la imagen antes de guardarla
          const img = new Image();
          img.src = reader.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Calcular nuevas dimensiones manteniendo la proporción
            let width = img.width;
            let height = img.height;
            const maxSize = 400; // máximo 400px para logos

            if (width > height && width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);
            
            // Convertir a PNG para mantener transparencia en logos
            const compressedDataUrl = canvas.toDataURL('image/png', 0.8);
            
            setPreviewLogo(compressedDataUrl);
            setTempData({...tempData, logo: compressedDataUrl});
            success('Logo cargado correctamente');
          };
        };
        reader.readAsDataURL(file);
      } catch (error) {
        error('Error al procesar la imagen del logo');
      }
    }
  };

  const handleRemoveLogo = () => {
    setPreviewLogo(null);
    setTempData({...tempData, logo: null});
    success('Logo eliminado');
    
    // Emitir evento cuando se elimina el logo
    const event = new CustomEvent('logoUpdated', { 
        detail: { logo: null } 
    });
    window.dispatchEvent(event);
  };

  const handleEdit = () => {
    setTempData({...empresaData});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempData({...empresaData});
    setPreviewLogo(empresaData.logo);
    setIsEditing(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7152EC]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Información de la Empresa</h2>
      <div className="bg-[#1E2837] rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.01] border border-gray-700 hover:shadow-blue-500/40">
        {/* Sección del Logo */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Logo de la Empresa</h3>
          <div className="flex items-start gap-4">
            <div className="relative w-32 h-32 bg-[#00132e] rounded-lg overflow-hidden flex items-center justify-center border border-gray-700">
              {previewLogo ? (
                <img
                  src={previewLogo}
                  alt="Logo de la empresa"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <Building2 size={48} className="text-gray-400" />
              )}
            </div>
            {isEditing && (
              <div className="space-y-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#7152EC] text-white rounded-md hover:bg-purple-600 cursor-pointer">
                  <Upload size={20} />
                  <span>Subir Logo</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </label>
                {previewLogo && (
                  <button
                    onClick={handleRemoveLogo}
                    className="inline-flex items-center gap-2 px-4 py-2 text-[#E60001] hover:text-red-400"
                  >
                    <Trash2 size={20} />
                    <span>Eliminar Logo</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-300 mb-1">
                <Building2 size={16} className="text-[#7152EC]" />
                Nombre de la Empresa
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.nombre}
                  onChange={(e) => setTempData({...tempData, nombre: e.target.value})}
                  className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:border-[#7152EC] focus:ring-1 focus:ring-[#7152EC]"
                />
              ) : (
                <p className="text-gray-200">{empresaData.nombre}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-300 mb-1">
                <Briefcase size={16} className="text-[#7152EC]" />
                Rama del Negocio
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.rama}
                  onChange={(e) => setTempData({...tempData, rama: e.target.value})}
                  className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:border-[#7152EC] focus:ring-1 focus:ring-[#7152EC]"
                />
              ) : (
                <p className="text-gray-200">{empresaData.rama}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-300 mb-1">
                <MapPin size={16} className="text-[#7152EC]" />
                Dirección
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.direccion}
                  onChange={(e) => setTempData({...tempData, direccion: e.target.value})}
                  className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:border-[#7152EC] focus:ring-1 focus:ring-[#7152EC]"
                />
              ) : (
                <p className="text-gray-200">{empresaData.direccion}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-300 mb-1">
                <MapPin size={16} className="text-[#7152EC]" />
                Ciudad
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.ciudad}
                  onChange={(e) => setTempData({...tempData, ciudad: e.target.value})}
                  className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:border-[#7152EC] focus:ring-1 focus:ring-[#7152EC]"
                />
              ) : (
                <p className="text-gray-200">{empresaData.ciudad}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-300 mb-1">
                <MapPin size={16} className="text-[#7152EC]" />
                Estado
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.estado}
                  onChange={(e) => setTempData({...tempData, estado: e.target.value})}
                  className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:border-[#7152EC] focus:ring-1 focus:ring-[#7152EC]"
                />
              ) : (
                <p className="text-gray-200">{empresaData.estado}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-300 mb-1">
                <Phone size={16} className="text-[#7152EC]" />
                Teléfono
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={tempData.telefono}
                  onChange={(e) => setTempData({...tempData, telefono: e.target.value})}
                  className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:border-[#7152EC] focus:ring-1 focus:ring-[#7152EC]"
                />
              ) : (
                <p className="text-gray-200">{empresaData.telefono}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-300 mb-1">
                <Calendar size={16} className="text-[#7152EC]" />
                Año de Incorporación
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.anioIncorporacion}
                  onChange={(e) => setTempData({...tempData, anioIncorporacion: e.target.value})}
                  className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:border-[#7152EC] focus:ring-1 focus:ring-[#7152EC]"
                />
              ) : (
                <p className="text-gray-200">{empresaData.anioIncorporacion}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-300 mb-1">
                <Globe size={16} className="text-[#7152EC]" />
                Sitio Web
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.sitioWeb}
                  onChange={(e) => setTempData({...tempData, sitioWeb: e.target.value})}
                  className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:border-[#7152EC] focus:ring-1 focus:ring-[#7152EC]"
                />
              ) : (
                <p className="text-gray-200">{empresaData.sitioWeb}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-300 mb-1">
                <MapPin size={16} className="text-[#7152EC]" />
                Código Postal
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.codigoPostal}
                  onChange={(e) => setTempData({...tempData, codigoPostal: e.target.value})}
                  className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:border-[#7152EC] focus:ring-1 focus:ring-[#7152EC]"
                />
              ) : (
                <p className="text-gray-200">{empresaData.codigoPostal}</p>
              )}
            </div>
          </div>
        </div>

        {/* Botón de editar/cancelar/guardar al final de la card */}
        <div className="flex justify-end gap-4 mt-8">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-300 hover:text-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#7152EC] text-white rounded-md hover:bg-purple-600"
              >
                Guardar
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-[#7152EC] text-white rounded-md hover:bg-purple-600"
            >
              Editar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Empresa;
import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { User, Mail, Phone, MapPin, Briefcase, Clock, Upload, X, CircleUserRound } from "lucide-react";
import { UsoToast } from '../contexto/UsoToast';

const Perfil = () => {

  const { success, error } = UsoToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Agregar estado de carga
  
  // Datos iniciales por defecto
  const defaultData = {
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    puesto: "",
    fechaIngreso: "",
    imagen: null
  };

  const [profileData, setProfileData] = useState(defaultData);
  const [tempData, setTempData] = useState(defaultData);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/perfil');
        if (response.data) {
          setProfileData(response.data);
          setTempData(response.data);
        }
      } catch (error) {
        error('Error al cargar los datos del perfil');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({...profileData});
  };

  // Actualizar handleSave para manejar errores específicos
  const handleSave = async () => {
    try {
      const response = await axios.put('http://localhost:5000/api/perfil', tempData);
      if (response.data) {
        setProfileData(response.data);
        setIsEditing(false);
        setPreviewImage(null);
        success('Perfil actualizado correctamente');
      }
    } catch (error) {
      error('Error al guardar los cambios: ' + (error.response?.data?.message || 'Error desconocido'));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData({...profileData});
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
        // Reducir a 2MB
        if (file.size > 5097152) { // 2MB en bytes
            alert('La imagen es demasiado grande. El tamaño máximo es 5MB.');
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
                    const maxSize = 800; // máximo 800px en cualquier dimensión

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
                    
                    // Convertir a JPEG con calidad reducida
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    
                    setPreviewImage(compressedDataUrl);
                    setTempData({...tempData, imagen: compressedDataUrl});
                };
            };
            reader.readAsDataURL(file);
        } catch (error) {
            // Error
            alert('Error al procesar la imagen');
        }
    }
};

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setTempData({...tempData, imagen: defaultData.imagen});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Update the loading state render
  if (isLoading) {
    return (
      <div className="p-10 max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7152EC]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-100">Perfil</h1>
      
      <div className="bg-[#1E2837] rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.01] border border-gray-700 hover:shadow-blue-500/40">
        <div className="flex flex-col items-center gap-12 mb-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-[#00132e] border border-gray-700 flex items-center justify-center">
              {(isEditing ? (previewImage || tempData.imagen) : profileData.imagen) ? (
                <img
                  src={isEditing ? (previewImage || tempData.imagen) : profileData.imagen}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <CircleUserRound 
                  size={96} 
                  className="text-gray-400"
                />
              )}
            </div>
            
            {isEditing && (
              <div className="mt-4 flex flex-col items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#7152EC] text-white rounded-md hover:bg-purple-600">
                  <Upload size={20} />
                  <span>Cambiar foto</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                  />
                </label>
                
                {(previewImage || tempData.imagen) && (
                  <button
                    onClick={handleRemoveImage}
                    className="inline-flex items-center gap-2 px-4 py-2 text-[#E60001] hover:text-red-400"
                    title="Eliminar foto"
                  >
                    <X size={20} />
                    <span>Eliminar foto</span>
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="text-[#7152EC]" size={20} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.nombre}
                      onChange={(e) => setTempData({...tempData, nombre: e.target.value})}
                      className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:border-[#7152EC] focus:ring-1 focus:ring-[#7152EC]"
                    />
                  ) : (
                    <p className="text-gray-200">{profileData.nombre}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="text-[#7152EC]" size={20} />
                  {isEditing ? (
                    <input
                      type="email"
                      value={tempData.email}
                      onChange={(e) => setTempData({...tempData, email: e.target.value})}
                      className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:border-[#7152EC] focus:ring-1 focus:ring-[#7152EC]"
                    />
                  ) : (
                    <p className="text-gray-200">{profileData.email}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="text-[#7152EC]" size={20} />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={tempData.telefono}
                      onChange={(e) => setTempData({...tempData, telefono: e.target.value})}
                      className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:border-[#7152EC] focus:ring-1 focus:ring-[#7152EC]"
                    />
                  ) : (
                    <p className="text-gray-200">{profileData.telefono}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="text-[#7152EC]" size={20} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.direccion}
                      onChange={(e) => setTempData({...tempData, direccion: e.target.value})}
                      className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:border-[#7152EC] focus:ring-1 focus:ring-[#7152EC]"
                    />
                  ) : (
                    <p className="text-gray-200">{profileData.direccion}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Briefcase className="text-[#7152EC]" size={20} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.puesto}
                      onChange={(e) => setTempData({...tempData, puesto: e.target.value})}
                      className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200 focus:border-[#7152EC] focus:ring-1 focus:ring-[#7152EC]"
                    />
                  ) : (
                    <p className="text-gray-200">{profileData.puesto}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="text-[#7152EC]" size={20} />
                  <p className="text-gray-200">
                    Fecha de ingreso: {profileData.fechaIngreso}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
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
                Guardar cambios
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-[#7152EC] text-white rounded-md hover:bg-purple-600"
            >
              Editar perfil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Perfil;

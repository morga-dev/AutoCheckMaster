import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Car } from 'lucide-react';
import logo from "../assets/Logo.png";
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', formData);

        if (response.data.token) {
            // Guardar el token en localStorage
            localStorage.setItem('token', response.data.token);
            
            // Configurar el token en los headers de axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            
            navigate('/');
        }
    } catch (error) {
        setError(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#00132e]">
      <div className="w-full max-w-md p-8 space-y-6">
        {/* Card principal */}
        <div className="bg-[#1E2837] rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.01] border border-gray-700 hover:shadow-purple-600/60">
          {/* Header */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#7152EC] to-purple-600 rounded-full blur opacity-25"></div>
              <div className="relative">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-24 h-24 rounded-full border-4 border-[#1E2837] shadow-lg"
                />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-100 tracking-tight">
              AutoCheckMaster
            </h2>
            <div className="flex items-center space-x-2 text-[#7152EC]">
              <Car size={20} />
              <p className="text-sm font-medium">
                Sistema de gestión automotriz
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-900 bg-opacity-20 border-l-4 border-red-500 rounded-r-md">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Correo Electrónico
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-[#00132e] border border-gray-700 rounded-lg 
                      text-gray-200 placeholder-gray-500
                      focus:ring-2 focus:ring-[#7152EC] focus:border-transparent 
                      transition-all duration-300"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Contraseña
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 bg-[#00132e] border border-gray-700 rounded-lg 
                      text-gray-200 placeholder-gray-500
                      focus:ring-2 focus:ring-[#7152EC] focus:border-transparent 
                      transition-all duration-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium
                ${isLoading 
                  ? 'bg-[#7152EC] bg-opacity-50 cursor-not-allowed' 
                  : 'bg-[#7152EC] hover:bg-purple-600 active:bg-purple-700'
                } 
                transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
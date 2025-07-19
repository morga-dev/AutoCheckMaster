import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { Home, Settings, Boxes, Plus, Menu, X, LogOut } from "lucide-react";
import { MdDashboard } from "react-icons/md";
import logo from "../assets/Logo.png";
import { FileText, List, History } from "lucide-react";
import axios from 'axios';
import { logout } from '../services/auth.service';
import ModalAgregar from "../modales/agregar/ModalAgregar";

const menuItems = [
  { to: "/", icon: <Home size={20} />, label: "Inicio" },
  { to: "/dashboard", icon: <MdDashboard size={20} />, label: "Tablero" },
  { to: "/inventario", icon: <Boxes size={20} />, label: "Inventario" }, 
  { to: "/listas", icon: <List size={20} />, label: "Listas" },
  { to: "/historial", icon: <History size={20} />, label: "Historial" },
  { to: "/formatos", icon: <FileText size={20} />, label: "Formatos" },
  { to: "/ajustes", icon: <Settings size={20} />, label: "Ajustes" },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAgregarOpen, setIsAgregarOpen] = useState(false);
  const navigate = useNavigate();
  const [logoSrc, setLogoSrc] = useState(logo);

  useEffect(() => {
    const fetchEmpresaLogo = async () => {
      try {
        // Obtener el token
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Configurar el token en los headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Hacer la petición
        const response = await axios.get('http://localhost:5000/api/empresa');
        if (response.data && response.data.logo) {
          setLogoSrc(response.data.logo);
        } else {
          setLogoSrc(logo);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          // Si el token no es válido, redirigir al login
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setLogoSrc(logo);
        }
      }
    };

    fetchEmpresaLogo();

    // Event listener para actualización del logo
    const handleLogoUpdate = (event) => {
      setLogoSrc(event.detail.logo || logo);
    };
    window.addEventListener('logoUpdated', handleLogoUpdate);
    return () => window.removeEventListener('logoUpdated', handleLogoUpdate);
  }, [navigate]);

  const handleLogout = () => {
    // Limpiar token del localStorage
    localStorage.removeItem('token');
    
    // Limpiar headers de axios
    delete axios.defaults.headers.common['Authorization'];
    
    navigate('/login');
};

const handleAgregarSelect = (key) => {
  setIsAgregarOpen(false);
  navigate(`/agregar/${key}`);
};

  return (
    <>
      {/* Botón de menú móvil */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-[var(--purple-primary)] p-2 rounded-md text-white hover:opacity-90 transition-opacity"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay para móviles */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed h-full bg-[var(--dark-primary)]
        overflow-y-scroll hide-scrollbar
        md:w-40 transform transition-transform duration-300 ease-in-out z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="p-2 flex flex-col items-center">
          {/* Logo Container */}
          <div className="relative w-full aspect-square max-w-[112px] flex items-center justify-center p-2">
            <img 
              src={logoSrc} 
              alt="Logo" 
              className="w-full h-full object-contain rounded-lg shadow-lg transition-all duration-300 hover:scale-105" 
            />
          </div>

          {/* Título */}
          <div className="mb-6 text-center">
            <h4 className="text-lg font-bold tracking-tight">
              <span className="text-[var(--purple-primary)]">Auto</span>
              <span className="text-[var(--purple-primary)]">Check</span>
              <span className="text-white">Master</span>
            </h4>
          </div>

          {/* Navegación */}
          <nav className="flex flex-col gap-3 w-full">
            {menuItems.map((item, idx) => (
              <React.Fragment key={item.to}>
                <Link
                  to={item.to}
                  className="nav-link"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span className="text-[11px] mt-1">{item.label}</span>
                </Link>
                {/* Insertar el botón Agregar justo después de "Listas" */}
                {item.label === "Listas" && (
                  <button
                    type="button"
                    onClick={() => setIsAgregarOpen(true)}
                    className="nav-link flex items-center justify-center w-full"
                  >
                    <Plus size={20}/>
                    <span className="text-[11px]">Agregar</span>
                  </button>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Botón de cierre de sesión */}
          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-2 p-2 rounded-lg text-[var(--red-primary)] hover:bg-[var(--red-primary)] hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span className="text-[11px]">Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* Modal Agregar */}
      <ModalAgregar
        isOpen={isAgregarOpen}
        onClose={() => setIsAgregarOpen(false)}
        onSelect={handleAgregarSelect}
      />
    </>
  );
};

export default Sidebar;
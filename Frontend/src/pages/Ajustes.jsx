import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Settings, Building2, UserCog, UsersRound } from "lucide-react";

const Ajustes = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar del submenú */}
      <div className="w-full lg:w-64 bg-[#1E2837] p-4 lg:min-h-screen">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 text-[#7152EC] text-center">
          Ajustes
        </h2>
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
          <Link 
            to="general" 
            className={`flex items-center gap-2 p-2 lg:p-3 rounded-md hover:bg-[#7152EC] hover:text-white whitespace-nowrap flex-shrink-0
              ${isActive('general') ? 'bg-[#7152EC] text-white' : 'text-gray-300'}`}
          >
            <Settings size={20} />
            <span>General</span>
          </Link>

          <Link 
            to="perfil" 
            className={`flex items-center gap-2 p-2 lg:p-3 rounded-md hover:bg-[#7152EC] hover:text-white whitespace-nowrap flex-shrink-0
              ${isActive('perfil') ? 'bg-[#7152EC] text-white' : 'text-gray-300'}`}
          >
            <UserCog size={20} />
            <span>Perfil</span>
          </Link>

          <Link 
            to="empresa" 
            className={`flex items-center gap-2 p-2 lg:p-3 rounded-md hover:bg-[#7152EC] hover:text-white whitespace-nowrap flex-shrink-0
              ${isActive('empresa') ? 'bg-[#7152EC] text-white' : 'text-gray-300'}`}
          >
            <Building2 size={20} />
            <span>Empresa</span>
          </Link>

          <Link 
            to="empleados" 
            className={`flex items-center gap-2 p-2 lg:p-3 rounded-md hover:bg-[#7152EC] hover:text-white whitespace-nowrap flex-shrink-0
              ${isActive('empleados') ? 'bg-[#7152EC] text-white' : 'text-gray-300'}`}
          >
            <UsersRound size={20} />
            <span>Empleados</span>
          </Link>
        </div>
      </div>

      {/* Contenido dinámico */}
      <div className="flex-1 p-4 lg:p-6 overflow-x-auto bg-[#00132e]">
        <Outlet />
      </div>
    </div>
  );
};

export default Ajustes;
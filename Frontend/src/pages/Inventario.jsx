import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Wrench, Settings } from "lucide-react";

const Inventario = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar del submenú */}
      <div className="w-full lg:w-64 bg-[#1E2837] p-6 lg:min-h-screen">
        <h2 className="text-xl lg:text-2xl font-bold mb-10 text-[#7152EC] text-center">
          Inventario
        </h2>
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
          <Link 
            to="refacciones" 
            className={`flex items-center gap-2 p-2 lg:p-3 rounded-md hover:bg-[#7152EC] hover:text-white whitespace-nowrap flex-shrink-0
              ${isActive('refacciones') ? 'bg-[#7152EC] text-white' : 'text-gray-300'}`}
          >
            <Settings size={20} />
            <span>Refacciones</span>
          </Link>
          <Link 
            to="servicios" 
            className={`flex items-center gap-2 p-2 lg:p-3 rounded-md hover:bg-[#7152EC] hover:text-white whitespace-nowrap flex-shrink-0
              ${isActive('servicios') ? 'bg-[#7152EC] text-white' : 'text-gray-300'}`}
          >
            <Wrench size={20} />
            <span>Servicios</span>
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

export default Inventario;
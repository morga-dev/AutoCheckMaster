import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Users, Truck, Receipt, Calendar, ClipboardList, DollarSign } from "lucide-react";

const Listas = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar del submenú */}
      <div className="w-full lg:w-64 bg-[#1E2837] p-4 lg:min-h-screen">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 text-[#7152EC] text-center">
          Listas
        </h2>
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
          <Link 
            to="clientes" 
            className={`flex items-center gap-2 p-2 lg:p-3 rounded-md hover:bg-[#7152EC] hover:text-white whitespace-nowrap flex-shrink-0
              ${isActive('clientes') ? 'bg-[#7152EC] text-white' : 'text-gray-300'}`}
          >
            <Users size={20} />
            <span>Clientes</span>
          </Link>
          
          <Link 
            to="proveedores" 
            className={`flex items-center gap-2 p-2 lg:p-3 rounded-md hover:bg-[#7152EC] hover:text-white whitespace-nowrap flex-shrink-0
              ${isActive('proveedores') ? 'bg-[#7152EC] text-white' : 'text-gray-300'}`}
          >
            <Truck size={20} />
            <span>Proveedores</span>
          </Link>

          <Link 
            to="citas" 
            className={`flex items-center gap-2 p-2 lg:p-3 rounded-md hover:bg-[#7152EC] hover:text-white whitespace-nowrap flex-shrink-0
              ${isActive('citas') ? 'bg-[#7152EC] text-white' : 'text-gray-300'}`}
          >
            <Calendar size={20} />
            <span>Citas</span>
          </Link>

          <Link 
            to="ordenes" 
            className={`flex items-center gap-2 p-2 lg:p-3 rounded-md hover:bg-[#7152EC] hover:text-white whitespace-nowrap flex-shrink-0
              ${isActive('ordenes') ? 'bg-[#7152EC] text-white' : 'text-gray-300'}`}
          >
            <ClipboardList size={20} />
            <span>Órdenes</span>
          </Link>

          <Link 
            to="gastos" 
            className={`flex items-center gap-2 p-2 lg:p-3 rounded-md hover:bg-[#7152EC] hover:text-white whitespace-nowrap flex-shrink-0
              ${isActive('gastos') ? 'bg-[#7152EC] text-white' : 'text-gray-300'}`}
          >
            <Receipt size={20} />
            <span>Gastos</span>
          </Link>
          
          <Link 
            to="ingresos" 
            className={`flex items-center gap-2 p-2 lg:p-3 rounded-md hover:bg-[#7152EC] hover:text-white whitespace-nowrap flex-shrink-0
              ${isActive('ingresos') ? 'bg-[#7152EC] text-white' : 'text-gray-300'}`}
          >
            <DollarSign size={20} />
            <span>Ingresos</span>
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

export default Listas;
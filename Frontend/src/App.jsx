import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { ConfiguracionContexto } from "./contexto/ConfiguracionContexto";

// Componentes principales
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Inventario from "./pages/Inventario";
import Historial from "./pages/Historial";
import Listas from "./pages/Listas";
import Ajustes from "./pages/Ajustes";
import Formatos from "./pages/Formatos";

// Componentes de inventario
import Refacciones from "./inventario/Refacciones";
import Servicios from "./inventario/Servicios";

// Componentes de ajustes
import General from "./configuracion/General";
import Empresa from "./configuracion/Empresa";
import Empleados from "./configuracion/Empleados";
import Perfil from "./configuracion/Perfil";

// Componentes de listas
import Clientes from "./listas/Clientes";
import Proveedores from "./listas/Proveedores";
import Gastos from "./listas/Gastos";
import Citas from "./listas/Citas";
import Ordenes from "./listas/Ordenes";
import Ingresos from "./listas/Ingresos";

// Componentes de formatos
import FormatoChecklist from "./formatos/FormatoChecklist";
import FormatoOrden from "./formatos/FormatoOrden";
import FormaCotizacion from "./formatos/FormatoCotizacion";

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
};

const App = () => {
  const location = useLocation();

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={true}
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--dark-secondary)",
            color: "var(--gray-100)",
            fontSize: "1rem",
            borderRadius: "0.75rem",
          },
          loading: {
            style: {
              background: "var(--dark-secondary)",
              color: "var(--gray-100)",
            },
            iconTheme: {
              primary: "var(--purple-primary)",
              secondary: "var(--dark-secondary)",
            },
          },
          success: {
            style: {
              background: "var(--green-primary)",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "var(--green-primary)",
            },
          },
          error: {
            style: {
              background: "var(--red-primary)",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "var(--red-primary)",
            },
          },
        }}
      />
      <Routes location={location}>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex flex-col lg:flex-row h-min-screen bg-dark-primary">
                <Sidebar />
                <div className="flex-1 lg:ml-40">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={location.pathname}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={pageVariants}
                    >
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/historial" element={<Historial />} />

                        {/* Rutas de Inventario */}
                        <Route path="/inventario" element={<Inventario />}>
                          <Route
                            index
                            element={<Navigate to="refacciones" replace />}
                          />
                          <Route path="refacciones" element={<Refacciones />} />
                          <Route path="servicios" element={<Servicios />} />
                        </Route>

                        {/* Rutas de listas */}
                        <Route path="/listas" element={<Listas />}>
                          <Route
                            index
                            element={<Navigate to="clientes" replace />}
                          />
                          <Route path="clientes" element={<Clientes />} />
                          <Route path="proveedores" element={<Proveedores />} />
                          <Route path="gastos" element={<Gastos />} />
                          <Route path="citas" element={<Citas />} />
                          <Route path="ordenes" element={<Ordenes />} />
                          <Route path="ingresos" element={<Ingresos />} />
                        </Route>

                        {/* Rutas de Formatos */}
                        <Route path="/formatos" element={<Formatos />}>
                          <Route
                            index
                            element={<Navigate to="checklist" replace />}
                          />
                          <Route
                            path="checklist"
                            element={<FormatoChecklist />}
                          />
                          <Route path="orden" element={<FormatoOrden />} />
                          <Route
                            path="cotizacion"
                            element={<FormaCotizacion />}
                          />
                        </Route>

                        {/* Rutas de Ajustes */}
                        <Route path="/ajustes" element={<Ajustes />}>
                          <Route
                            index
                            element={<Navigate to="general" replace />}
                          />
                          <Route path="general" element={<General />} />
                          <Route path="perfil" element={<Perfil />} />
                          <Route path="empresa" element={<Empresa />} />
                          <Route path="empleados" element={<Empleados />} />
                        </Route>
                      </Routes>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const Root = () => {
  return (
    <ConfiguracionContexto>
      <AppWrapper />
    </ConfiguracionContexto>
  );
};

export default Root;

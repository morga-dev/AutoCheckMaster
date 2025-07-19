import React, { useState, useEffect } from "react";
import axios from 'axios';

const Dashboard = () => {
  const [clientesNuevos, setClientesNuevos] = useState(0);
  const [ingresosMes, setIngresosMes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ordenesStats, setOrdenesStats] = useState({
    total: 0,
    pendientes: 0,
    enProceso: 0,
    finalizadas: 0
  });
  const [ordenesNuevas, setOrdenesNuevas] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [clientesResponse, ingresosResponse, ordenesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/clientes'),
          axios.get('http://localhost:5000/api/ingresos'),
          axios.get('http://localhost:5000/api/ordenes')
        ]);

        const fechaActual = new Date();
        const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
        
        const nuevosDelMes = clientesResponse.data.filter(cliente => {
          const fechaCreacion = new Date(cliente.created_at);
          return fechaCreacion >= primerDiaMes;
        });

        const ingresosMesActual = ingresosResponse.data
          .filter(ingreso => {
            const fechaIngreso = new Date(ingreso.fecha);
            return fechaIngreso >= primerDiaMes && ingreso.estado === 'Pagado';
          })
          .reduce((total, ingreso) => total + ingreso.monto, 0);

        // Procesar órdenes nuevas (últimas 5 órdenes)
        const ordenes = ordenesResponse.data;
        const ultimasOrdenes = ordenes
          .sort((a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio))
          .slice(0, 5);

        // Estadísticas generales de órdenes
        const stats = {
          total: ordenes.length,
          pendientes: ordenes.filter(orden => orden.estado === 'Pendiente').length,
          enProceso: ordenes.filter(orden => orden.estado === 'En proceso').length,
          finalizadas: ordenes.filter(orden => orden.estado === 'Completada').length
        };

        setOrdenesNuevas(ultimasOrdenes);
        setOrdenesStats(stats);
        setClientesNuevos(nuevosDelMes.length);
        setIngresosMes(ingresosMesActual);
        setLoading(false);
      } catch (error) {
        // Error
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="main-container p-6">
      <h1 className="text-3xl font-bold mb-6 text-[var(--gray-100)]">Tablero</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card de Flujo de Trabajo */}
        <div className="bg-[#1E2837] rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.01] border border-gray-700 hover:shadow-blue-500/40">
          <h2 className="text-xl font-bold mb-4 text-[var(--gray-100)]">Flujo de Trabajo</h2>
          {loading ? (
            <p className="text-[var(--gray-400)]">Cargando datos...</p>
          ) : (
            <div className="space-y-3">
              <p className="text-[var(--gray-100)]">
                Órdenes de trabajo: <span className="text-[var(--blue-primary)] font-bold">{ordenesStats.total}</span>
              </p>
              <p className="text-[var(--gray-100)]">
                Pendiente: <span className="text-[var(--orange-primary)] font-bold">{ordenesStats.pendientes}</span>
              </p>
              <p className="text-[var(--gray-100)]">
                Finalizadas: <span className="text-[var(--green-primary)] font-bold">{ordenesStats.finalizadas}</span>
              </p>
            </div>
          )}
        </div>

        {/* Card General */}
        <div className="bg-[#1E2837] rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.01] border border-gray-700 hover:shadow-blue-500/40">
          <h2 className="text-xl font-bold mb-4 text-[var(--gray-100)]">General</h2>
          {loading ? (
            <p className="text-[var(--gray-400)]">Cargando datos...</p>
          ) : (
            <div className="space-y-3">
              <p className="text-[var(--gray-100)]">
                Clientes nuevos: <span className="text-[var(--purple-primary)] font-bold">{clientesNuevos}</span>
              </p>
              <p className="text-[var(--gray-100)]">
                Ingresos: <span className="text-[var(--green-primary)] font-bold">{formatCurrency(ingresosMes)}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tabla de Órdenes Nuevas */}
      <div className="bg-[#1E2837] rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.01] border border-gray-700 hover:shadow-green-500/50 mt-6">
        <h2 className="text-xl font-bold mb-4 text-[var(--gray-100)]">Órdenes Nuevas</h2>
        {loading ? (
          <p className="text-[var(--gray-400)]">Cargando datos...</p>
        ) : ordenesNuevas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--gray-400)] uppercase tracking-wider">Folio</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--gray-400)] uppercase tracking-wider">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--gray-400)] uppercase tracking-wider">Vehículo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--gray-400)] uppercase tracking-wider">Servicio</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--gray-400)] uppercase tracking-wider">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--gray-400)] uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--gray-700)]">
                {ordenesNuevas.map((orden) => (
                  <tr key={orden.id} className="hover:bg-[var(--dark-primary)] transition-colors">
                    <td className="px-4 py-3 text-[var(--gray-100)]">{orden.folio}</td>
                    <td className="px-4 py-3 text-[var(--gray-100)]">{orden.cliente_nombre}</td>
                    <td className="px-4 py-3 text-[var(--gray-100)]">{`${orden.marca} ${orden.modelo}`}</td>
                    <td className="px-4 py-3 text-[var(--gray-100)]">{orden.servicio_nombre}</td>
                    <td className="px-4 py-3 text-[var(--gray-100)]">{formatDate(orden.fecha_inicio)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${orden.estado === 'Pendiente' ? 'bg-[var(--orange-primary)] text-white' : 
                          orden.estado === 'En proceso' ? 'bg-[var(--blue-primary)] text-white' : 
                          'bg-[var(--green-primary)] text-white'}`}
                      >
                        {orden.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-[var(--gray-400)]">No hay órdenes nuevas</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

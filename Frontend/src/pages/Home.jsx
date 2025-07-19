import React, { useState, useEffect } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { Users, ClipboardList, Package, DollarSign } from "lucide-react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [clientesCount, setClientesCount] = useState(0);
  const [refaccionesCount, setRefaccionesCount] = useState(0);
  const [gastosMensuales, setGastosMensuales] = useState(0);
  const [ingresosMensuales, setIngresosMensuales] = useState([]);
  const [ordenesPendientes, setOrdenesPendientes] = useState(0);
  const navigate = useNavigate();

  // Función para obtener el conteo de clientes
  const fetchClientesCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clientes');
      setClientesCount(response.data.length);
    } catch (error) {
      // Error
    }
  };

  // Función para obtener el conteo de refacciones
  const fetchRefaccionesCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/refacciones');
      setRefaccionesCount(response.data.length);
    } catch (error) {
      // Error
    }
  };

  // Nueva función para obtener los gastos mensuales
  const fetchGastosMensuales = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gastos');
      const gastos = response.data;
      
      // Obtener el mes y año actual
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Filtrar gastos del mes actual y sumar los montos
      const gastosMes = gastos
        .filter(gasto => {
          const gastoDate = new Date(gasto.fecha);
          return gastoDate.getMonth() === currentMonth && 
                 gastoDate.getFullYear() === currentYear;
        })
        .reduce((total, gasto) => total + gasto.monto, 0);

      setGastosMensuales(gastosMes);
    } catch (error) {
      // Error
    }
  };

  // Función para obtener los ingresos mensuales
  const fetchIngresosMensuales = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ingresos');
      const ingresos = response.data;
      
      // Objeto para almacenar los totales por mes
      const totalesPorMes = {};
      
      // Procesar solo los ingresos pagados
      ingresos
        .filter(ingreso => ingreso.estado === 'Pagado') // Filtrar solo ingresos pagados
        .forEach(ingreso => {
          const fecha = new Date(ingreso.fecha);
          const mes = fecha.getMonth();
          const year = fecha.getFullYear();
          const mesKey = `${year}-${mes}`;
          
          if (!totalesPorMes[mesKey]) {
            totalesPorMes[mesKey] = {
              name: new Date(year, mes).toLocaleDateString('es-MX', { month: 'long' }),
              ingresos: 0,
              year: year,
              month: mes
            };
          }
          
          totalesPorMes[mesKey].ingresos += ingreso.monto;
        });

      // Convertir a array y ordenar por fecha
      const ingresosPorMes = Object.values(totalesPorMes)
        .sort((a, b) => {
          if (a.year !== b.year) return a.year - b.year;
          return a.month - b.month;
        })
        .slice(-5); // Mostrar solo los últimos 5 meses

      setIngresosMensuales(ingresosPorMes);
    } catch (error) {
      // Error
    }
  };

  // Función para obtener datos generales
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Verificar autenticación con un endpoint real
      await axios.get('http://localhost:5000/api/auth/verify');
      
      // Si la autenticación es exitosa, obtener los datos
      await Promise.all([
        fetchClientesCount(),
        fetchRefaccionesCount(),
        fetchGastosMensuales(),
        fetchIngresosMensuales()
      ]);
      
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // Verificar token primero
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Configurar token en axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Obtener datos
    fetchClientesCount();
    fetchRefaccionesCount();
    fetchGastosMensuales();
    fetchIngresosMensuales();
    setOrdenesPendientes(0);
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  };

  return (
    <div className="main-container p-6">
      <h1 className="text-3xl font-bold mb-6 text-[var(--gray-100)]">Resumen General</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 content-center">
        {/* Card de Clientes */}
        <div className="bg-[#1E2837] rounded-2xl shadow-xl g-2 p-8 transform transition-all duration-300 hover:scale-[1.01] border border-gray-700 hover:shadow-blue-500/40 flex flex-col items-center text-center">
          <Users size={32} color="var(--blue-primary)" />
          <h2 className="text-lg font-semibold text-[var(--gray-100)] mt-3">Clientes</h2>
          <p className="text-2xl font-bold text-[var(--blue-primary)] mt-3">{clientesCount}</p>
        </div>

        {/* Card de Órdenes Pendientes */}
        <div className="bg-[#1E2837] rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.01] border border-gray-700 hover:shadow-red-500/40 flex flex-col items-center text-center">
          <ClipboardList size={32} color="var(--red-primary)" />
          <h2 className="text-lg font-semibold text-[var(--gray-100)] mt-3">Órdenes Pendientes</h2>
          <p className="text-2xl font-bold text-[var(--red-primary)]">{ordenesPendientes}</p>
        </div>

        {/* Card de Inventario */}
        <div className="bg-[#1E2837] rounded-2xl shadow-xl g-2 p-8 transform transition-all duration-300 hover:scale-[1.01] border border-gray-700 hover:shadow-green-500/40 flex flex-col items-center text-center">
          <Package size={32} color="var(--green-primary)" />
          <h2 className="text-lg font-semibold text-[var(--gray-100)] mt-3">Inventario</h2>
          <p className="text-2xl font-bold text-[var(--green-primary)] mt-3">{refaccionesCount}</p>
        </div>

        {/* Card de Gastos Mensuales */}
        <div className="bg-[#1E2837] rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.01] border border-gray-700 hover:shadow-blue-500/40 flex flex-col items-center text-center">
          <DollarSign size={32} color="var(--blue-primary)" />
          <h2 className="text-lg font-semibold text-[var(--gray-100)] mt-3">Gastos Mensuales</h2>
          <p className="text-2xl font-bold text-[var(--blue-primary)]">
            {formatCurrency(gastosMensuales)}
          </p>
        </div>
      </div>

      {/* Gráfica de Ingresos */}
      <div className="bg-[#1E2837] rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.01] border border-gray-700 hover:shadow-purple-600/60 mt-8">
        <h2 className="text-xl font-bold mb-6 text-[var(--gray-100)]">Ingresos Mensuales</h2>
        <BarChart
          height={300}
          dataset={ingresosMensuales}
          xAxis={[{
            scaleType: 'band',
            dataKey: 'name',
            tickLabelStyle: {
              angle: 0,
              textAnchor: 'middle',
              fontSize: 12,
              fill: 'white',
            }
          }]}
          series={[
            {
              dataKey: 'ingresos',
              color: 'var(--purple-primary)',
              highlightScope: {
                highlighted: 'item',
                faded: 'global'
              },
            }
          ]}
          slotProps={{
            legend: {
              hidden: true
            },
            bar: {
              style: {
                cursor: 'pointer',
              }
            }
          }}
          sx={{
            // Estilos base
            '.MuiChartsAxis-line': {
              stroke: 'white',
            },
            '.MuiChartsAxis-tick': {
              stroke: 'white',
            },
            '.MuiChartsAxis-tickLabel': {
              stroke: 'white',
            },
            // Estilos para las barras
            '.MuiBarElement-root': {
              fill: 'var(--orange-primary)',
              '&:hover': {
                fill: 'var(--purple-primary)',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Home;

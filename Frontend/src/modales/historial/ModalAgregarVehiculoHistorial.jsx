import { useState, useEffect } from "react";
import axios from 'axios';
import { UsoToast } from '../../contexto/UsoToast';
import { PlusCircle } from "lucide-react";
import PropTypes from 'prop-types';

const ModalAgregarVehiculoHistorial = ({
	isOpen,
	onClose,
	cliente,
	onVehiculoAgregado,
}) => {
	const { error } = UsoToast();
	const [modo, setModo] = useState(cliente?.tipo === "registrado" ? "registrado" : "nuevo");
	const [vehiculos, setVehiculos] = useState([]);
	const [selectedVehiculoId, setSelectedVehiculoId] = useState("");
	const [nuevoVehiculo, setNuevoVehiculo] = useState({
		marca: "",
		modelo: "",
		placa: "",
		numero_serie: "",
		anio: "",
		kilometraje: ""
	});
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState(null);

	// Cargar vehículos del cliente si es registrado
	useEffect(() => {
		if (isOpen && cliente?.tipo === "registrado") {
			const fetchVehiculos = async () => {
				try {
					// Quitar el prefijo "r_" si existe
					let clienteId = cliente.id;
					if (typeof clienteId === "string" && clienteId.startsWith("r_")) {
						clienteId = clienteId.replace("r_", "");
					}
					const response = await axios.get(`http://localhost:5000/api/clientes/${clienteId}/vehiculos`);
					setVehiculos(response.data);
				} catch (err) {
					console.error('Error al cargar vehículos:', err);
					error('Error al cargar los vehículos');
				}
			};
			fetchVehiculos();
		}
	}, [isOpen, cliente]);

	// Si el modal no está abierto o no hay cliente, no renderizar nada
	if (!isOpen || !cliente) {
		return null;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (modo === "registrado") {
				if (!selectedVehiculoId) {
					error('Debe seleccionar un vehículo');
					setLoading(false);
					return;
				}
				// Buscar el objeto completo del vehículo seleccionado
				const vehiculoSeleccionado = vehiculos.find(v => String(v.id) === String(selectedVehiculoId));
				if (!vehiculoSeleccionado) {
					error('Vehículo no encontrado');
					setLoading(false);
					return;
				}
				onVehiculoAgregado(vehiculoSeleccionado);
				onClose();
				setLoading(false);
				return;
			} else {
				// Validaciones para nuevo vehículo
				if (!nuevoVehiculo.marca.trim()) {
					error('La marca es obligatoria');
					return;
				}
				if (nuevoVehiculo.marca.length > 30) {
					error('La marca no puede exceder los 30 caracteres');
					return;
				}
				if (!nuevoVehiculo.modelo.trim()) {
					error('El modelo es obligatorio');
					return;
				}
				if (nuevoVehiculo.modelo.length > 30) {
					error('El modelo no puede exceder los 30 caracteres');
					return;
				}

				// Validar placa (exactamente 7 caracteres)
				if (nuevoVehiculo.placa.length !== 7) {
					error('La placa debe tener exactamente 7 caracteres');
					return;
				}

				// Validar número de serie (exactamente 17 caracteres)
				if (nuevoVehiculo.numero_serie.length !== 17) {
					error('El número de serie debe tener exactamente 17 caracteres');
					return;
				}

				// Validar año
				const currentYear = new Date().getFullYear();
				const year = parseInt(nuevoVehiculo.anio);
				if (isNaN(year) || year < 1900 || year > currentYear + 1) {
					error(`El año debe estar entre 1900 y ${currentYear + 1}`);
					return;
				}

				// Validar kilometraje
				const km = parseInt(nuevoVehiculo.kilometraje);
				if (isNaN(km) || km < 0) {
					error('El kilometraje no puede ser negativo');
					return;
				}
				if (km > 999999) {
					error('El kilometraje no puede ser mayor a 999,999');
					return;
				}
			}
			// Crear vehículo nuevo (para clientes registrados y no registrados)
			const vehiculoData = {
				...nuevoVehiculo,
				anio: nuevoVehiculo.anio ? Number(nuevoVehiculo.anio) : undefined,
				id: `temp-${Date.now()}`,
				cliente_id: cliente.tipo === 'registrado' ? cliente.id : null
			};
			
			onVehiculoAgregado(vehiculoData);
			onClose();
		} catch (error) {
			setErrorMsg(error.message);
			error('Error al agregar vehículo');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center modal-blur">
			<div className="bg-[#1E2837] rounded-lg shadow-xl w-full max-w-lg p-6">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl"
				>
					×
				</button>
				<h2 className="text-2xl font-bold mb-4 text-center text-gray-100">
					Agregar Vehículo al Historial
				</h2>
				{cliente.tipo === "registrado" && (
					<div className="flex gap-4 mb-6 justify-center">
						<label className="flex items-center text-gray-300">
							<input
								type="radio"
								checked={modo === "registrado"}
								onChange={() => setModo("registrado")}
								className="mr-2 accent-[#7152EC]"
							/>
							Agregar vehículo registrado
						</label>
						<label className="flex items-center text-gray-300">
							<input
								type="radio"
								checked={modo === "nuevo"}
								onChange={() => setModo("nuevo")}
								className="mr-2 accent-[#7152EC]"
							/>
							Agregar nuevo vehículo
						</label>
					</div>
				)}
				{cliente.tipo === "no_registrado" && (
					<div className="mb-6 text-center text-gray-300">
						Cliente no registrado - Agregar nuevo vehículo
					</div>
				)}
				<form onSubmit={handleSubmit} className="space-y-6">
					{(modo === "registrado" && cliente.tipo === "registrado") ? (
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-1">
								Seleccionar Vehículo
							</label>
							<select
								value={selectedVehiculoId}
								onChange={(e) => setSelectedVehiculoId(e.target.value)}
								className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
								required
							>
								<option value="">Seleccione un vehículo</option>
								{vehiculos.map((vehiculo) => (
									<option key={vehiculo.id} value={vehiculo.id}>
										{vehiculo.marca} {vehiculo.modelo} -{" "}
										{vehiculo.placa}
									</option>
								))}
							</select>
						</div>
					) : (
						<div className="space-y-3">
							<label className="block text-sm font-medium text-gray-300 mb-1">
								Marca
							</label>
							<input
								type="text"
								value={nuevoVehiculo.marca}
								onChange={(e) =>
									setNuevoVehiculo({ ...nuevoVehiculo, marca: e.target.value })
								}
								className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
								required
							/>
							<label className="block text-sm font-medium text-gray-300 mb-1">
								Modelo
							</label>
							<input
								type="text"
								value={nuevoVehiculo.modelo}
								onChange={(e) =>
									setNuevoVehiculo({ ...nuevoVehiculo, modelo: e.target.value })
								}
								className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
								required
							/>
							<label className="block text-sm font-medium text-gray-300 mb-1">
								Año
							</label>
							<input
								type="number"
								value={nuevoVehiculo.anio}
								onChange={(e) =>
									setNuevoVehiculo({ ...nuevoVehiculo, anio: e.target.value })
								}
								className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
								required
							/>
							<label className="block text-sm font-medium text-gray-300 mb-1">
								Placa
							</label>
							<input
								type="text"
								value={nuevoVehiculo.placa}
								onChange={(e) => {
									if (e.target.value.length <= 7) {
										setNuevoVehiculo({ ...nuevoVehiculo, placa: e.target.value.toUpperCase() })
									}
								}}
								maxLength={7}
								className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
							/>
							<label className="block text-sm font-medium text-gray-300 mb-1">
								N° Serie
							</label>
							<input
								type="text"
								value={nuevoVehiculo.numero_serie}
								onChange={(e) => {
									if (e.target.value.length <= 17) {
										setNuevoVehiculo({ ...nuevoVehiculo, numero_serie: e.target.value.toUpperCase() })
									}
								}}
								maxLength={17}
								className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
							/>
							<label className="block text-sm font-medium text-gray-300 mb-1">
								Kilometraje
							</label>
							<input
								type="number"
								value={nuevoVehiculo.kilometraje}
								onChange={(e) =>
									setNuevoVehiculo({ ...nuevoVehiculo, kilometraje: e.target.value })
								}
								className="w-full p-2 bg-[#00132e] border border-gray-700 rounded-md text-gray-200"
							/>
						</div>
					)}
					<div className="flex justify-end gap-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-gray-400 hover:text-gray-200"
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="px-6 py-2 bg-[#7152EC] text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
							disabled={loading}
						>
							{loading && (
								<svg
									className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										fill="none"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8v8H4z"
									/>
								</svg>
							)}
							<PlusCircle size={18} />
							{modo === "registrado" && cliente.tipo === "registrado"
								? "Agregar Vehículo"
								: "Registrar Vehículo"}
						</button>
					</div>
					{errorMsg && (
						<div className="mt-4 text-red-500 text-sm text-center">
							{errorMsg}
						</div>
					)}
				</form>
			</div>
		</div>
	);
};

ModalAgregarVehiculoHistorial.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cliente: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tipo: PropTypes.string.isRequired,
    nombre: PropTypes.string,
    apellido: PropTypes.string,
    email: PropTypes.string,
    celular: PropTypes.string,
    telefono_casa: PropTypes.string
  }),
  onVehiculoAgregado: PropTypes.func.isRequired
};

export default ModalAgregarVehiculoHistorial;
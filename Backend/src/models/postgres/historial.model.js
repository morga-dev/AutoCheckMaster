import { pool } from '../../config/db.config.js';

class Historial {
    // Método para crear un servicio en el historial
    static async createServicio(servicioData) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const {
                tipo_cliente,
                cliente_id,
                vehiculo_id,
                nombre_cliente,
                telefono_cliente,
                correo_cliente,
                vehiculo_marca,
                vehiculo_modelo,
                vehiculo_placa,
                vehiculo_serie,
                vehiculo_anio,
                vehiculo_kilometraje,
                nombre_servicio,
                descripcion,
                fecha_servicio,
                pdf_orden
            } = servicioData;

            // Validar datos obligatorios
            if (!nombre_servicio || !descripcion || !fecha_servicio || !pdf_orden) {
                throw new Error('Nombre, descripción, fecha del servicio y PDF son obligatorios');
            }

            // Validar tipo de cliente
            if (!tipo_cliente || !['registrado', 'no_registrado'].includes(tipo_cliente)) {
                throw new Error('Tipo de cliente inválido');
            }

            let result;
            if (tipo_cliente === 'registrado') {
                // Para clientes registrados, usar cliente_id y vehiculo_id
                if (!cliente_id || !vehiculo_id) {
                    throw new Error('Cliente ID y Vehículo ID son obligatorios para clientes registrados');
                }

                result = await client.query(
                    `INSERT INTO historial_servicios (
                        tipo_cliente, cliente_id, vehiculo_id,
                        nombre_cliente, telefono_cliente, correo_cliente,
                        vehiculo_marca, vehiculo_modelo, vehiculo_placa,
                        vehiculo_serie, vehiculo_anio, vehiculo_kilometraje,
                        nombre_servicio, descripcion, fecha_servicio, pdf_orden
                    ) VALUES (
                        $1, $2, $3, 
                        NULL, NULL, NULL,
                        NULL, NULL, NULL,
                        NULL, NULL, NULL,
                        $4, $5, $6, $7
                    ) RETURNING *`,
                    [
                        tipo_cliente, 
                        cliente_id, 
                        vehiculo_id,
                        nombre_servicio,
                        descripcion,
                        fecha_servicio,
                        pdf_orden
                    ]
                );
            } else {
                // Para clientes no registrados, usar los datos directos
                if (!nombre_cliente || !telefono_cliente || !vehiculo_marca || !vehiculo_modelo) {
                    throw new Error('Datos del cliente y vehículo son obligatorios para clientes no registrados');
                }

                result = await client.query(
                    `INSERT INTO historial_servicios (
                        tipo_cliente, cliente_id, vehiculo_id,
                        nombre_cliente, telefono_cliente, correo_cliente,
                        vehiculo_marca, vehiculo_modelo, vehiculo_placa,
                        vehiculo_serie, vehiculo_anio, vehiculo_kilometraje,
                        nombre_servicio, descripcion, fecha_servicio, pdf_orden
                    ) VALUES (
                        $1, NULL, NULL,
                        $2, $3, $4,
                        $5, $6, $7,
                        $8, $9, $10,
                        $11, $12, $13, $14
                    ) RETURNING *`,
                    [
                        tipo_cliente,
                        nombre_cliente,
                        telefono_cliente,
                        correo_cliente || null,
                        vehiculo_marca,
                        vehiculo_modelo,
                        vehiculo_placa || null,
                        vehiculo_serie || null,
                        vehiculo_anio || null,
                        vehiculo_kilometraje || null,
                        nombre_servicio,
                        descripcion,
                        fecha_servicio,
                        pdf_orden
                    ]
                );
            }

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error en createServicio:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    // Método para crear la tabla si no existe
    static async createTableIfNotExists() {
        try {
            const createTableSQL = `
                CREATE TABLE IF NOT EXISTS historial_servicios (
                    id SERIAL PRIMARY KEY,
                    
                    -- Tipo de cliente (obligatorio)
                    tipo_cliente VARCHAR(20) NOT NULL CHECK (tipo_cliente IN ('registrado', 'no_registrado')),
                    
                    -- Referencias para clientes registrados
                    cliente_id INTEGER REFERENCES clientes(id),
                    vehiculo_id INTEGER REFERENCES vehiculos(id),
                    
                    -- Datos para clientes no registrados
                    nombre_cliente VARCHAR(100),
                    telefono_cliente VARCHAR(20),
                    correo_cliente VARCHAR(100),
                    vehiculo_marca VARCHAR(100),
                    vehiculo_modelo VARCHAR(100),
                    vehiculo_placa VARCHAR(12),
                    vehiculo_serie VARCHAR(17),
                    vehiculo_anio INTEGER,
                    vehiculo_kilometraje INTEGER,
                    
                    -- Datos del servicio (siempre obligatorios)
                    nombre_servicio VARCHAR(100) NOT NULL,
                    descripcion TEXT NOT NULL,
                    fecha_servicio DATE NOT NULL,
                    pdf_orden VARCHAR(255) NOT NULL,
                    
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    
                    -- Restricción CHECK más flexible
                    CONSTRAINT check_cliente_tipo CHECK (
                        (tipo_cliente = 'registrado' AND 
                         cliente_id IS NOT NULL AND 
                         vehiculo_id IS NOT NULL) 
                        OR 
                        (tipo_cliente = 'no_registrado' AND 
                         cliente_id IS NULL AND 
                         vehiculo_id IS NULL AND
                         nombre_cliente IS NOT NULL AND
                         telefono_cliente IS NOT NULL AND
                         vehiculo_marca IS NOT NULL AND
                         vehiculo_modelo IS NOT NULL)
                    )
                );
            `;
            
            await pool.query(createTableSQL);
            
            return true;
        } catch (error) {
            console.error('Error al crear la tabla historial_servicios:', error);
            throw error;
        }
    }

    // Método para recrear la tabla con la nueva estructura
    static async recreateTable() {
        try {
            // Eliminar la tabla si existe
            await pool.query('DROP TABLE IF EXISTS historial_servicios CASCADE');
            
            // Crear la tabla con la nueva estructura
            await this.createTableIfNotExists();
            
            return true;
        } catch (error) {
            console.error('Error al recrear la tabla historial_servicios:', error);
            throw error;
        }
    }

    // Método de prueba para verificar la estructura de la tabla
    static async testTable() {
        try {
            // Verificar si la tabla existe
            const tableExists = await pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'historial_servicios'
                );
            `);
            
            if (!tableExists.rows[0].exists) {
                throw new Error('La tabla historial_servicios no existe');
            }
            
            // Verificar la estructura de la tabla
            const structure = await pool.query(`
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = 'historial_servicios'
                ORDER BY ordinal_position;
            `);
            
            // Verificar si hay datos
            const countResult = await pool.query('SELECT COUNT(*) as total FROM historial_servicios');
            
            return {
                tableExists: tableExists.rows[0].exists,
                structure: structure.rows,
                totalRecords: countResult.rows[0].total
            };
        } catch (error) {
            console.error('Error en testTable:', error);
            throw error;
        }
    }

    // Método para obtener todo el historial organizado por clientes
    static async findAll() {
        try {
            // Primero, asegurar que la tabla existe
            await this.createTableIfNotExists();
            
            // Consulta muy simple para evitar errores
            const result = await pool.query(`
                SELECT 
                    h.id,
                    h.tipo_cliente,
                    h.nombre_servicio,
                    h.descripcion,
                    h.fecha_servicio,
                    h.pdf_orden,
                    h.cliente_id,
                    h.vehiculo_id,
                    h.nombre_cliente,
                    h.telefono_cliente,
                    h.correo_cliente,
                    h.vehiculo_marca,
                    h.vehiculo_modelo,
                    h.vehiculo_anio,
                    h.vehiculo_placa,
                    h.vehiculo_serie,
                    h.vehiculo_kilometraje,
                    c.nombre as cliente_nombre,
                    c.apellido as cliente_apellido,
                    c.celular as cliente_celular,
                    c.email as cliente_email,
                    v.marca as vehiculo_marca_registrado,
                    v.modelo as vehiculo_modelo_registrado,
                    v.anio as vehiculo_anio_registrado,
                    v.placa as vehiculo_placa_registrado,
                    v.numero_serie as vehiculo_serie_registrado,
                    v.kilometraje as vehiculo_kilometraje_registrado
                FROM historial_servicios h
                LEFT JOIN clientes c ON h.cliente_id = c.id
                LEFT JOIN vehiculos v ON h.vehiculo_id = v.id
                WHERE h.nombre_servicio IS NOT NULL
                ORDER BY h.fecha_servicio DESC
            `);
            
            // Procesar los datos en JavaScript para agruparlos correctamente
            const clientesMap = new Map();
            
            result.rows.forEach(row => {
                const clienteKey = row.tipo_cliente === 'registrado' ? row.cliente_id : row.id;
                
                if (!clientesMap.has(clienteKey)) {
                    clientesMap.set(clienteKey, {
                        id: clienteKey,
                        tipo_cliente: row.tipo_cliente,
                        nombre_completo: row.tipo_cliente === 'registrado' 
                            ? `${row.cliente_nombre || ''} ${row.cliente_apellido || ''}`.trim()
                            : row.nombre_cliente,
                        telefono: row.tipo_cliente === 'registrado' 
                            ? row.cliente_celular 
                            : row.telefono_cliente,
                        correo: row.tipo_cliente === 'registrado' 
                            ? row.cliente_email 
                            : row.correo_cliente,
                        vehiculos: []
                    });
                }
                
                const cliente = clientesMap.get(clienteKey);
                
                // Crear clave única para el vehículo
                const vehiculoKey = row.tipo_cliente === 'registrado' 
                    ? row.vehiculo_id 
                    : `${row.vehiculo_marca}-${row.vehiculo_modelo}-${row.vehiculo_anio}`;
                
                // Buscar si el vehículo ya existe
                let vehiculo = cliente.vehiculos.find(v => 
                    row.tipo_cliente === 'registrado' 
                        ? v.id === row.vehiculo_id
                        : (v.marca === row.vehiculo_marca && v.modelo === row.vehiculo_modelo && v.año === row.vehiculo_anio)
                );
                
                if (!vehiculo) {
                    // Crear nuevo vehículo
                    vehiculo = {
                        id: row.tipo_cliente === 'registrado' ? row.vehiculo_id : `temp_${row.id}`,
                        marca: row.tipo_cliente === 'registrado' 
                            ? row.vehiculo_marca_registrado 
                            : row.vehiculo_marca,
                        modelo: row.tipo_cliente === 'registrado' 
                            ? row.vehiculo_modelo_registrado 
                            : row.vehiculo_modelo,
                        año: row.tipo_cliente === 'registrado' 
                            ? row.vehiculo_anio_registrado 
                            : row.vehiculo_anio,
                        placa: row.tipo_cliente === 'registrado' 
                            ? row.vehiculo_placa_registrado 
                            : row.vehiculo_placa,
                        numero_serie: row.tipo_cliente === 'registrado' 
                            ? row.vehiculo_serie_registrado 
                            : row.vehiculo_serie,
                        kilometraje: row.tipo_cliente === 'registrado' 
                            ? row.vehiculo_kilometraje_registrado 
                            : row.vehiculo_kilometraje,
                        servicios: []
                    };
                    cliente.vehiculos.push(vehiculo);
                }
                
                // Agregar servicio al vehículo
                vehiculo.servicios.push({
                    id: row.id,
                    nombre_servicio: row.nombre_servicio,
                    descripcion: row.descripcion,
                    fecha: row.fecha_servicio,
                    pdf_orden: row.pdf_orden
                });
            });
            
            // Convertir el Map a array
            const historial = Array.from(clientesMap.values());
            
            return historial;
        } catch (error) {
            console.error('Error en findAll:', error);
            throw error;
        }
    }

    // Método para eliminar un servicio
    static async deleteServicio(id) {
        try {
            const result = await pool.query(
                'DELETE FROM historial_servicios WHERE id = $1 RETURNING *',
                [id]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Método para eliminar un cliente del historial (todos sus servicios)
    static async deleteCliente(clienteId, tipoCliente) {
        try {
            let result;
            if (tipoCliente === 'registrado') {
                result = await pool.query(
                    'DELETE FROM historial_servicios WHERE cliente_id = $1 AND tipo_cliente = $2 RETURNING *',
                    [clienteId, tipoCliente]
                );
            } else {
                result = await pool.query(
                    'DELETE FROM historial_servicios WHERE id = $1 AND tipo_cliente = $2 RETURNING *',
                    [clienteId, tipoCliente]
                );
            }
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Método para eliminar un vehículo del historial (todos sus servicios)
    static async deleteVehiculo(vehiculoId) {
        try {
            const result = await pool.query(
                'DELETE FROM historial_servicios WHERE vehiculo_id = $1 RETURNING *',
                [vehiculoId]
            );
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}

export default Historial;
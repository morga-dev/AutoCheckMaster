import { pool } from '../../config/db.config.js';

class Cliente {
    static async create(clienteData) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const { 
                nombre, apellido, fecha_nacimiento, colonia, 
                calle, numero_casa, codigo_postal, email, 
                celular, telefono_casa,
                // Datos del vehículo
                modelo, marca, placa, numero_serie, anio, kilometraje
            } = clienteData;

            const anioInt = anio ? parseInt(anio) : null;
            const kilometrajeInt = kilometraje ? parseInt(kilometraje) : null;

            // Insertar cliente
            const clienteResult = await client.query(
                `INSERT INTO clientes (
                    nombre, apellido, fecha_nacimiento, colonia, 
                    calle, numero_casa, codigo_postal, email, 
                    celular, telefono_casa
                ) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
                RETURNING *`,
                [nombre, apellido, fecha_nacimiento, colonia, 
                 calle, numero_casa, codigo_postal, email, 
                 celular, telefono_casa]
            );

            const cliente = clienteResult.rows[0];

            // Si hay datos del vehículo, insertarlos
            if (modelo && marca && placa && numero_serie && anio && kilometraje) {
                const anioInt = parseInt(anio);
                const kilometrajeInt = parseInt(kilometraje);
                await client.query(
                    `INSERT INTO vehiculos (
                        cliente_id, modelo, marca, placa, numero_serie, anio, kilometraje
                    ) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [cliente.id, modelo, marca, placa, numero_serie, anioInt, kilometrajeInt]
                );
            }

            await client.query('COMMIT');
            
            // Retornar cliente con datos del vehículo
            return cliente;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async findAll() {
        try {
            const result = await pool.query(`
                SELECT DISTINCT
                    c.id,
                    c.nombre,
                    c.apellido,
                    c.email,
                    c.celular,
                    c.telefono_casa,
                    c.colonia,
                    c.calle,
                    c.numero_casa,
                    c.codigo_postal
                FROM clientes c
                ORDER BY c.nombre
            `);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async findAllWithVehiculos() {
        try {
            const result = await pool.query(`
                SELECT DISTINCT ON (c.id)
                    c.id,
                    c.nombre,
                    c.apellido,
                    c.email,
                    c.celular,
                    c.telefono_casa,
                    c.colonia,
                    c.calle,
                    c.numero_casa,
                    c.codigo_postal,
                    c.fecha_nacimiento,
                    c.created_at,
                    v.id as vehiculo_id,
                    v.modelo,
                    v.marca,
                    v.placa,
                    v.numero_serie,
                    v.anio,
                    v.kilometraje
                FROM clientes c
                LEFT JOIN vehiculos v ON c.id = v.cliente_id
                ORDER BY c.id, v.id DESC NULLS LAST
            `);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT 
                    c.id,
                    c.nombre,
                    c.apellido,
                    c.email,
                    c.celular,
                    c.telefono_casa,
                    c.colonia,
                    c.calle,
                    c.numero_casa,
                    c.codigo_postal,
                    c.fecha_nacimiento,
                    c.created_at,
                    v.id as vehiculo_id,
                    v.modelo,
                    v.marca,
                    v.placa,
                    v.numero_serie,
                    v.anio,
                    v.kilometraje
                FROM clientes c
                LEFT JOIN vehiculos v ON c.id = v.cliente_id
                WHERE c.id = $1
                ORDER BY v.id DESC NULLS LAST
                LIMIT 1
            `, [id]);

            if (result.rows.length === 0) {
                return null;
            }

            return result.rows[0];
        } finally {
            client.release();
        }
    }

    static async findByIdWithAllVehiculos(id) {
        const client = await pool.connect();
        try {
            // Obtener datos del cliente
            const clienteResult = await client.query(`
                SELECT 
                    c.id,
                    c.nombre,
                    c.apellido,
                    c.email,
                    c.celular,
                    c.telefono_casa,
                    c.colonia,
                    c.calle,
                    c.numero_casa,
                    c.codigo_postal,
                    c.fecha_nacimiento,
                    c.created_at
                FROM clientes c
                WHERE c.id = $1
            `, [id]);

            if (clienteResult.rows.length === 0) {
                return null;
            }

            const cliente = clienteResult.rows[0];

            // Obtener todos los vehículos del cliente
            const vehiculosResult = await client.query(`
                SELECT 
                    v.id,
                    v.marca,
                    v.modelo,
                    v.placa,
                    v.numero_serie,
                    v.anio,
                    v.kilometraje
                FROM vehiculos v
                WHERE v.cliente_id = $1
                ORDER BY v.id DESC
            `, [id]);

            return {
                ...cliente,
                vehiculos: vehiculosResult.rows
            };
        } finally {
            client.release();
        }
    }

    static async delete(id) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            // Primero eliminar vehículos asociados
            await client.query('DELETE FROM vehiculos WHERE cliente_id = $1', [id]);
            // Luego eliminar el cliente
            const result = await client.query('DELETE FROM clientes WHERE id = $1', [id]);
            await client.query('COMMIT');
            return result.rowCount > 0;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async findVehiculos(clienteId) {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT 
                    v.id,
                    v.marca,
                    v.modelo,
                    v.placa,
                    v.kilometraje,
                    v.numero_serie,
                    v.anio
                FROM vehiculos v
                WHERE v.cliente_id = $1
                ORDER BY v.id DESC
            `, [clienteId]);
            
            return result.rows;
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }

    static async createVehiculo(clienteId, vehiculoData) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const { 
                marca, modelo, placa, numero_serie, anio, kilometraje 
            } = vehiculoData;

            const anioInt = anio ? parseInt(anio) : null;
            const kilometrajeInt = kilometraje ? parseInt(kilometraje) : null;

            // Verificar que el cliente existe
            const clienteResult = await client.query(
                'SELECT id FROM clientes WHERE id = $1',
                [clienteId]
            );

            if (clienteResult.rows.length === 0) {
                throw new Error('Cliente no encontrado');
            }

            // Insertar vehículo
            const vehiculoResult = await client.query(
                `INSERT INTO vehiculos (
                    cliente_id, marca, modelo, placa, numero_serie, anio, kilometraje
                ) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) 
                RETURNING *`,
                [clienteId, marca, modelo, placa, numero_serie, anioInt, kilometrajeInt]
            );

            await client.query('COMMIT');
            return vehiculoResult.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

export default Cliente;
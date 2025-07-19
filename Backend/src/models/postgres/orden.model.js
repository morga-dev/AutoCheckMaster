import { pool } from '../../config/db.config.js';

class Orden {
    static async create(ordenData) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const { 
                cliente,
                vehiculo,
                tecnico_id,
                servicio_id,
                descripcion_actividad,
                insumos_utilizados,
                observaciones,
                fecha_inicio
            } = ordenData;

            // Preparar datos del cliente
            const cliente_id = cliente.tipo === 'registrado' ? cliente.id : null;
            const cliente_nombre = cliente.nombre;

            // Obtener datos del cliente si es registrado
            let correo = cliente.correo;
            let telefono = cliente.telefono;

            if (cliente.tipo === 'registrado') {
                const clienteResult = await client.query(
                    'SELECT email, celular, telefono_casa FROM clientes WHERE id = $1',
                    [cliente.id]
                );
                
                if (clienteResult.rows[0]) {
                    correo = clienteResult.rows[0].email;
                    telefono = clienteResult.rows[0].celular || clienteResult.rows[0].telefono_casa;
                }
            }

            // Obtener nombres de técnico y servicio
            const tecnicoResult = await client.query(
                'SELECT nombre FROM empleados WHERE id = $1',
                [tecnico_id]
            );
            const servicioResult = await client.query(
                'SELECT nombre FROM servicios WHERE id = $1',
                [servicio_id]
            );

            const tecnico_nombre = tecnicoResult.rows[0]?.nombre;
            const servicio_nombre = servicioResult.rows[0]?.nombre;

            const result = await client.query(
                `INSERT INTO ordenes_servicio (
                    cliente_id, cliente_nombre, correo, celular,
                    modelo, marca, placa, numero_serie, anio, kilometraje,
                    tecnico_id, tecnico_nombre, servicio_id, servicio_nombre,
                    descripcion_actividad, insumos_utilizados, observaciones,
                    fecha_inicio, estado, total
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
                RETURNING *`,
                [
                    cliente_id, cliente_nombre, correo, telefono,
                    vehiculo.modelo, vehiculo.marca, vehiculo.placa, vehiculo.numero_serie,
                    vehiculo.anio ? parseInt(vehiculo.anio) : null,
                    vehiculo.kilometraje ? parseInt(vehiculo.kilometraje) : null,
                    tecnico_id, tecnico_nombre, servicio_id, servicio_nombre,
                    descripcion_actividad, insumos_utilizados, observaciones,
                    fecha_inicio, 'Pendiente', 0 // <-- total en 0
                ]
            );

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async findAll() {
        try {
            const result = await pool.query(
                'SELECT * FROM ordenes_servicio ORDER BY fecha_inicio DESC'
            );
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    static async findByFolio(folio) {
        try {
            const result = await pool.query(
                'SELECT * FROM ordenes_servicio WHERE folio = $1',
                [folio]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async updateTotal(id, total) {
        try {
            // Primero consulta el total actual
            const current = await pool.query(
                'SELECT total FROM ordenes_servicio WHERE id = $1',
                [id]
            );
            if (!current.rows.length) throw new Error('Orden no encontrada');
            if (parseFloat(current.rows[0].total) !== 0) {
                throw new Error('El total solo puede modificarse una vez');
            }
            // Si el total es 0, permite la actualización
            const result = await pool.query(
                'UPDATE ordenes_servicio SET total = $1 WHERE id = $2 RETURNING *',
                [total, id]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async updateEstado(id, estado) {
        try {
            const result = await pool.query(
                'UPDATE ordenes_servicio SET estado = $1 WHERE id = $2 RETURNING *',
                [estado, id]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            await pool.query('DELETE FROM ordenes_servicio WHERE id = $1', [id]);
            return true;
        } catch (error) {
            throw error;
        }
    }

    static async finalizar(id, fecha_fin) {
        try {
            const result = await pool.query(
                `UPDATE ordenes_servicio 
                SET estado = 'Completada', 
                    fecha_fin = $1 
                WHERE id = $2 
                RETURNING *`,
                [fecha_fin, id]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
}

export default Orden;
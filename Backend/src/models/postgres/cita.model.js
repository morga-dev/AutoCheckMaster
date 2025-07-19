import { pool } from '../../config/db.config.js';

class Cita {
    static async create(citaData) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const {
                cliente,
                vehiculo,
                servicio_id,
                descripcion,
                fecha,
                hora,
                tecnico_id,
                comentarios
            } = citaData;

            // Obtener el vehículo del cliente si es cliente registrado
            let vehiculo_id = null;
            if (cliente.tipo === 'registrado') {
                const vehiculoResult = await client.query(
                    'SELECT id FROM vehiculos WHERE cliente_id = $1 AND numero_serie = $2',
                    [cliente.id, vehiculo.numero_serie]
                );
                vehiculo_id = vehiculoResult.rows[0]?.id;
            }

            // Obtener nombres de técnico y servicio
            const tecnicoResult = await client.query(
                'SELECT nombre, apellido FROM empleados WHERE id = $1',
                [tecnico_id]
            );
            const servicioResult = await client.query(
                'SELECT nombre FROM servicios WHERE id = $1',
                [servicio_id]
            );

            const tecnico_nombre = tecnicoResult.rows[0] ? 
                `${tecnicoResult.rows[0].nombre} ${tecnicoResult.rows[0].apellido}` : '';
            const servicio_nombre = servicioResult.rows[0]?.nombre;

            // Preparar datos del cliente
            const cliente_id = cliente.tipo === 'registrado' ? cliente.id : null;
            
            // Si es cliente registrado, obtener correo y teléfono de la base de datos
            let correo = cliente.correo;
            let telefono = cliente.telefono;

            if (cliente.tipo === 'registrado') {
                const clienteResult = await client.query(
                    'SELECT email, celular FROM clientes WHERE id = $1',
                    [cliente.id]
                );
                if (clienteResult.rows[0]) {
                    correo = clienteResult.rows[0].email;
                    telefono = clienteResult.rows[0].celular;
                }
            }

            const comentariosInsert = (comentarios !== undefined && comentarios !== null) ? String(comentarios) : '';

            const result = await client.query(
                `INSERT INTO citas (
                    cliente_id, cliente_nombre, correo, telefono,
                    vehiculo_id, modelo, marca, placa, numero_serie, anio, kilometraje,
                    servicio_id, servicio_nombre, descripcion,
                    fecha, hora, tecnico_id, tecnico_nombre,
                    comentarios, estado
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
                RETURNING *`,
                [
                    cliente_id,
                    cliente.nombre,
                    correo,
                    telefono,
                    vehiculo_id,
                    vehiculo.modelo,
                    vehiculo.marca,
                    vehiculo.placa,
                    vehiculo.numero_serie,
                    vehiculo.anio ? parseInt(vehiculo.anio) : null,
                    vehiculo.kilometraje ? parseInt(vehiculo.kilometraje) : null,
                    servicio_id,
                    servicio_nombre,
                    descripcion,
                    fecha,
                    hora,
                    tecnico_id,
                    tecnico_nombre,
                    comentariosInsert,
                    'Pendiente'
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
        const result = await pool.query(`
            SELECT 
                c.*,
                COALESCE(c.correo, cl.email) as correo,
                COALESCE(c.telefono, cl.celular) as telefono,
                TO_CHAR(c.fecha, 'YYYY-MM-DD') as fecha,
                TO_CHAR(c.hora, 'HH24:MI') as hora
            FROM citas c
            LEFT JOIN clientes cl ON c.cliente_id = cl.id
            ORDER BY c.fecha ASC, c.hora ASC
        `);
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM citas WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async update(id, citaData) {
        const result = await pool.query(
            `UPDATE citas 
             SET estado = $1, 
                 comentarios = $2,
                 updated_at = CURRENT_TIMESTAMP 
             WHERE id = $3 
             RETURNING *`,
            [citaData.estado, citaData.comentarios, id]
        );
        return result.rows[0];
    }

    static async updateEstado(id, estado) {
        try {
            const result = await pool.query(
                'UPDATE citas SET estado = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
                [estado, id]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        await pool.query('DELETE FROM citas WHERE id = $1', [id]);
        return true;
    }
}

export default Cita;
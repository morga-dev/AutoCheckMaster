import { pool } from '../../config/db.config.js';

class Servicio {
    static async create(servicioData) {
        const client = await pool.connect();
        try {
            const { nombre, descripcion, precio } = servicioData;
            const result = await client.query(
                'INSERT INTO servicios (nombre, descripcion, precio) VALUES ($1, $2, $3) RETURNING *',
                [nombre, descripcion, precio]
            );
            return result.rows[0];
        } catch (error) {
            // Error
            throw new Error('Error al crear servicio: ' + error.message);
        } finally {
            client.release();
        }
    }

    static async findAll() {
        try {
            const result = await pool.query(
                'SELECT id, nombre, descripcion, CAST(precio AS FLOAT) as precio FROM servicios ORDER BY nombre'
            );
            return result.rows;
        } catch (error) {
            // Error
            throw new Error('Error al consultar servicios: ' + error.message);
        }
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM servicios WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async update(id, servicioData) {
        const { nombre, descripcion, precio } = servicioData;
        const result = await pool.query(
            'UPDATE servicios SET nombre = $1, descripcion = $2, precio = $3 WHERE id = $4 RETURNING *',
            [nombre, descripcion, precio, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM servicios WHERE id = $1', [id]);
        return true;
    }
}

export default Servicio;
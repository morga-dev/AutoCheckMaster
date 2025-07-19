import { pool } from '../../config/db.config.js';

class Empleado {
    static async create(empleadoData) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const { especialidades, ...datosEmpleado } = empleadoData;
            
            // Insertar empleado
            const empleadoQuery = `
                INSERT INTO empleados (
                    nombre, apellido, fecha_nacimiento, edad, 
                    curp, rfc, domicilio, telefono_casa,
                    celular, email, anos_experiencia,
                    contacto_nombre, contacto_parentesco, contacto_telefono
                ) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
                RETURNING id
            `;

            const empleadoValues = [
                datosEmpleado.nombre,
                datosEmpleado.apellido,
                datosEmpleado.fecha_nacimiento,
                datosEmpleado.edad,
                datosEmpleado.curp,
                datosEmpleado.rfc,
                datosEmpleado.domicilio,
                datosEmpleado.telefono_casa,
                datosEmpleado.celular,
                datosEmpleado.email,
                datosEmpleado.anos_experiencia,
                datosEmpleado.contacto_nombre,
                datosEmpleado.contacto_parentesco,
                datosEmpleado.contacto_telefono
            ];

            const empleadoResult = await client.query(empleadoQuery, empleadoValues);
            const empleadoId = empleadoResult.rows[0].id;

            // Insertar especialidades
            for (const especialidadId of especialidades) {
                await client.query(
                    'INSERT INTO empleados_especialidades (empleado_id, especialidad_id) VALUES ($1, $2)',
                    [empleadoId, especialidadId]
                );
            }

            await client.query('COMMIT');

            // Retornar empleado con sus especialidades
            const empleadoCompleto = await client.query(
                `SELECT e.*, array_agg(esp.id) as especialidades_ids, array_agg(esp.nombre) as especialidades_nombres
                 FROM empleados e
                 LEFT JOIN empleados_especialidades ee ON e.id = ee.empleado_id
                 LEFT JOIN especialidades esp ON ee.especialidad_id = esp.id
                 WHERE e.id = $1
                 GROUP BY e.id`,
                [empleadoId]
            );

            return empleadoCompleto.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async findAll() {
        const result = await pool.query(
            `SELECT e.*, 
                array_agg(esp.nombre) as especialidades
             FROM empleados e
             LEFT JOIN empleados_especialidades ee ON e.id = ee.empleado_id
             LEFT JOIN especialidades esp ON ee.especialidad_id = esp.id
             GROUP BY e.id
             ORDER BY e.nombre`
        );
        return result.rows;
    }

    static async delete(id) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query('DELETE FROM empleados_especialidades WHERE empleado_id = $1', [id]);
            await client.query('DELETE FROM empleados WHERE id = $1', [id]);
            await client.query('COMMIT');
            return true;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async getEspecialidades() {
        const result = await pool.query('SELECT * FROM especialidades ORDER BY nombre');
        return result.rows;
    }
}

export default Empleado;
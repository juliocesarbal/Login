
import {pool} from "../db.js";

export const getSucursales = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre FROM sucursal');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener sucursales:', error);
    res.status(500).json({ error: 'Error al obtener sucursales' });
  }
};

export const getRoles = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre FROM rol');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ error: 'Error al obtener roles' });
  }
};
export const getInfoSucursal = async (req, res) => {
  const { sucursalId } = req.query;

  try {
    const result = await pool.query(`
      SELECT 
        d.id AS dispensador_id,
        d.ubicacion,
        d.estado,
        d.capacidad_maxima,
        m.id AS manguera_id,
        c.nombre AS combustible_nombre,
        c.tipo AS combustible_tipo,
        c.octanaje AS combustible_octanaje
      FROM dispensador d
      LEFT JOIN manguera m ON m.id_dispensador = d.id
      LEFT JOIN combustible c ON c.id = m.id_combustible
      WHERE d.id_sucursal = $1
    `, [sucursalId]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener info de la sucursal:", error);
    res.status(500).json({ error: "Error al obtener info de la sucursal" });
  }
};




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

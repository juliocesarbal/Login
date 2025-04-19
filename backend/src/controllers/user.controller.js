import {pool} from "../db.js";
import bcryptjs from "bcryptjs";
import { validationResult } from "express-validator";

export const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        u.id,
        u.ci,
        u.nombre,
        u.telefono,
        u.sexo,
        u.correo,
        u.domicilio,
        s.nombre AS sucursal,
        r.nombre AS rol
      FROM usuario u
      JOIN sucursal s ON u.id_sucursal = s.id
      JOIN rol r ON u.id_rol = r.id
    `);

    if (rows.length === 0) {
      return res.status(404).json({ message: "users not found" });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const loginProcess = async(req,res)=>{
  try {
      const resultValidation = validationResult(req);
      if(!resultValidation.isEmpty()){
          return res.status(400).json({errors: resultValidation.array()});
      }
      const {name,password} = req.body;

      const {rows} = await pool.query('SELECT * FROM usuario WHERE nombre = $1',[name]); 

      if(rows.length === 0){
          return res.status(400).json({
              errors:[
                  {
                      path: "name",
                      msg: "usuario no registrado",
                  },
              ],
          });
      }

      const userToLogin = rows[0];
      const isOkThePassword = await bcryptjs.compare(password, userToLogin.contraseña); 
      
      if(isOkThePassword){
          delete userToLogin.contraseña;
          return res.status(200).json({
              token: "simple-token-for-demo",
              user: userToLogin,
              message: "Inicio de sesion exitoso",
          });
      }

      return res.status(400).json({
          errors:[
              {
                  path: "password",
                  msg: "contraseña incorrecta",
              },
          ],
      });

  } catch (error) {
      console.error("Error en login:", error); 
      return res.status(500).json({ message: "Error interno del servidor" });
  }
};



export const getUser = async(req,res)=>{
    const {id} =req.params;
    const {rows} = await pool.query('SELECT * FROM usuario WHERE ID = $1',[id]);
    if(rows.length===0){
        return res.status(404).json({message:"user not found"});
    }
    res.json(rows[0]);
};


export const createUser = async (req, res) => {
    try {
      const resultValidation = validationResult(req);
      if (!resultValidation.isEmpty()) {
        return res.status(400).json({ errors: resultValidation.array() });
      }
  
      const data = req.body;
  
      // Validación de campos obligatorios
      const requiredFields = ["ci", "name", "telefono", "sexo", "email", "domicilio", "password", "id_sucursal", "id_rol"];
      for (let field of requiredFields) {
        if (!data[field]) {
          return res.status(400).json({
            errors: [
              {
                path: field,
                msg: `${field} es requerido`,
              },
            ],
          });
        }
      }
  
      // Hashear contraseña
      const hashedPassword = await bcryptjs.hash(data.password, 10);
  
      // Insertar usuario
      const insertQuery = `
        INSERT INTO usuario 
        (ci, nombre, telefono, sexo, correo, domicilio, contraseña, id_sucursal, id_rol)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
  
      const values = [
        data.ci,
        data.name,
        data.telefono,
        data.sexo,
        data.email,
        data.domicilio,
        hashedPassword,
        data.id_sucursal,
        data.id_rol,
      ];
  
      const { rows } = await pool.query(insertQuery, values);
  
      return res.status(201).json({
        meta: { status: 201 },
        message: "Usuario creado con éxito",
        user: rows[0],
      });
  
    } catch (error) {
      if (error?.code === "23505") {
        return res.status(400).json({
          errors: [
            {
              path: "ci/correo",
              msg: "CI o Email ya existente",
            },
          ],
        });
      }
  
      console.error("Error en createUser:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };


export const deleteUser = async(req,res)=>{
    const {id} =req.params;
    const {rowCount} = await pool.query('DELETE FROM usuario WHERE ID = $1 RETURNING *',[id]);
    if(rowCount ===0){
        return res.status(404).json({message:"user not found"});
    }
    return res.sendStatus(204);
};


export const updateUser = async(req,res)=>{
    const {id} =req.params;
    const data = req.body;
    const {rows} =await pool.query(
        'UPDATE usuario SET name = $1 , email = $2 WHERE id=$3 RETURNING *',
        [data.name,data.email,id]
    );
    return res.json(rows[0]);
};
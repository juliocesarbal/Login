import { pool } from "../db.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";


export const enviarReset = async (req, res) => {
    const { name } = req.body;
    const { rows } = await pool.query("SELECT * FROM usuario WHERE nombre = $1", [name]);
    console.log(rows)
    if (rows.length === 0) {
      return res.status(400).json({
            msg: "usuario no registrado",
      }); 
    }
    const user = rows[0];
  
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    const resetLink = `${process.env.FRONTEND_URL}/change-password/${token}`;
  
    await transporter.sendMail({
      from: '"Octano" <noreply@octano.com>',
      to: user.correo,
      subject: "Restablece tu contraseña",
      html: `
        <p>Hola ${user.nombre},</p>
        <p>Haz clic en el siguiente enlace para cambiar tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este enlace expirará en 15 minutos.</p>
      `,
    });
  
    res.status(200).json({ msg: "Correo enviado si el usuario existe" });
  };
  
  // ✅ Cambiar contraseña con token
  export const cambiarContra = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const hashed = await bcryptjs.hash(password, 10);
  
      const { rowCount } = await pool.query(
        `UPDATE usuario SET contraseña = $1 WHERE id = $2`,
        [hashed, decoded.id]
      );
  
      if (rowCount === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      res.json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      return res.status(400).json({ message: "Token inválido o expirado" });
    }
  };
  export const verificarToken = (req, res) => {
    const { token } = req.params;
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.json({ valido: true, id: decoded.id });
    } catch (error) {
      return res.status(401).json({ valido: false, mensaje: "Token inválido o expirado" });
    }
  };
  
import { pool } from "../db.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";

// Configura tu clave API de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const enviarReset = async (req, res) => {
  const { name } = req.body;
  const { rows } = await pool.query("SELECT * FROM usuario WHERE nombre = $1", [
    name,
  ]);

  if (rows.length === 0) {
    return res.status(400).json({ msg: "Usuario no registrado" });
  }

  const user = rows[0];

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const resetLink = `${process.env.FRONTEND_URL}/change-password/${token}`;

  const msg = {
    to: user.correo,
    from: {
      email: process.env.EMAIL_USER, // Debe estar verificado en SendGrid
      name: "Octano",
    },
    subject: "🔐 Restablece tu contraseña - Octano",
    text: `
Hola ${user.nombre},

Recibiste este mensaje porque solicitaste restablecer tu contraseña.

Haz clic en el siguiente enlace para continuar:
${resetLink}

Este enlace expirará en 15 minutos.

Si no realizaste esta solicitud, puedes ignorar este mensaje.

Atentamente,
Equipo Octano
  `,
    html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Restablecer contraseña</h2>
      <p>Hola <strong>${user.nombre}</strong>,</p>
      <p>Recibiste este correo porque solicitaste cambiar tu contraseña.</p>
      <p>
        Haz clic en el siguiente botón para continuar:
      </p>
      <p style="margin: 20px 0;">
        <a href="${resetLink}" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Cambiar contraseña
        </a>
      </p>
      <p>O copia y pega el siguiente enlace en tu navegador:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p><em>Este enlace expirará en 15 minutos.</em></p>
      <hr />
      <p style="font-size: 12px; color: #777;">
        Si no realizaste esta solicitud, puedes ignorar este mensaje.<br />
        © ${new Date().getFullYear()} Octano - Todos los derechos reservados
      </p>
    </div>
  `,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ msg: "Correo enviado si el usuario existe" });
  } catch (error) {
    console.error("Error al enviar correo:", error.response?.body || error);
    res.status(500).json({ msg: "Error al enviar el correo" });
  }
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
    return res
      .status(401)
      .json({ valido: false, mensaje: "Token inválido o expirado" });
  }
};

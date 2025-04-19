import { useEffect, useState } from "react";
import "./usuarios.css";
import API_URL from "../../config/config";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch(`${API_URL}/users`);
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };
    fetchUsuarios();
  }, []);

  return (
    <div className="usuarios-container">
      <h2 className="usuarios-title">Gestión de Usuarios</h2>
      <div className="tabla-usuarios-wrapper">
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>CI</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Sucursal</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.ci}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.telefono}</td>
                <td>{usuario.sucursal}</td>
                <td>{usuario.rol}</td>
                <td>
                  <button className="edit-btn">Editar</button>
                  <button className="delete-btn">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuarios;

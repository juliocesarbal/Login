import { useEffect, useState } from "react";
import "./usuarios.css";
import API_URL from "../../config/config";
import ModalPermisos from "./ModalPermisos";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const handleDelete = async (ci) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;

    try {
      const response = await fetch(`${API_URL}/users/ci/${ci}`, {
        method: "DELETE",
      });

      if (response.status === 204) {
        alert("Usuario eliminado exitosamente");
        setUsuarios((prev) => prev.filter((u) => u.ci !== ci));
      } else {
        const errorData = await response.json();
        alert("Error: " + errorData.message);
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error del servidor");
    }
  };

  const handleCloseModal = () => {
    setUsuarioEditando(null);
    fetchUsuarios(); // Refrescar lista tras cerrar el modal
  };

  return (
    <div className="usuarios-container">
      <h2 className="usuarios-title">Gestión de Usuarios</h2>
      <div className="tabla-usuarios-wrapper">
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>CI</th>
              <th>Sexo</th>
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
                <td>{usuario.sexo}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.telefono}</td>
                <td>{usuario.sucursal}</td>
                <td>{usuario.rol}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => setUsuarioEditando(usuario)}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(usuario.ci)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {usuarioEditando && (
        <ModalPermisos
          usuarioSeleccionado={usuarioEditando}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Usuarios;

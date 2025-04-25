import { useEffect, useState } from "react";
import API_URL from "../../config/config";
import "./modalPermisos.css";

const ModalPermisos = ({ usuarioSeleccionado, onClose, onRolActualizado }) => {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [permisosUsuario, setPermisosUsuario] = useState(new Set());
  const [rolSeleccionado, setRolSeleccionado] = useState("");

  useEffect(() => {
    if (usuarioSeleccionado) {
      const fetchDatos = async () => {
        try {
          const [rolesRes, permisosRes, usuarioPermisosRes] = await Promise.all(
            [
              fetch(`${API_URL}/roles`),
              fetch(`${API_URL}/permisos`),
              fetch(`${API_URL}/usuarios/permisos/${usuarioSeleccionado.id}`),
            ]
          );

          const [rolesData, permisosData, usuarioPermisosData] =
            await Promise.all([
              rolesRes.json(),
              permisosRes.json(),
              usuarioPermisosRes.json(),
            ]);

          setRoles(rolesData);
          setPermisos(permisosData);

          const permisosDelUsuario = new Set(
            usuarioPermisosData.permisos.map((p) => p.id)
          );
          setPermisosUsuario(permisosDelUsuario);

          const rolActual = rolesData.find(
            (r) => r.nombre === usuarioPermisosData.rol
          );

          setRolSeleccionado(rolActual?.id || "");
          if (rolActual?.nombre.toLowerCase() === "administrador") {
            setPermisosUsuario(new Set(permisosData.map((p) => p.id)));
          }
        } catch (error) {
          console.error("Error al cargar datos del modal:", error);
        }
      };

      fetchDatos();
    }
  }, [usuarioSeleccionado]);

  const handlePermisoChange = (permisoId) => {
    const updated = new Set(permisosUsuario);
    if (updated.has(permisoId)) {
      updated.delete(permisoId);
    } else {
      updated.add(permisoId);
    }
    setPermisosUsuario(updated);
  };

  const handleGuardar = async () => {
    try {
      if (!rolSeleccionado) {
        alert("Debe seleccionar un rol antes de guardar.");
        return;
      }
      const response = await fetch(
        `${API_URL}/usuarios/permisos/${usuarioSeleccionado.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_rol: rolSeleccionado,
            permisosSeleccionados: Array.from(permisosUsuario),
          }),
        }
      );

      if (response.ok) {
        alert("Permisos actualizados correctamente");

        // Actualizar rol mostrado en la tabla
        const rolNombre =
          roles.find((r) => r.id === rolSeleccionado)?.nombre ||
          "Rol desconocido";
        if (onRolActualizado) {
          onRolActualizado(usuarioSeleccionado.id, rolNombre);
        }

        onClose();
      } else {
        const error = await response.json();
        alert("Error al guardar: " + error.message);
      }
    } catch (error) {
      console.error("Error al guardar permisos:", error);
      alert("Error del servidor");
    }
  };

  return (
    <div className="modal-permiso-overlay">
      <div className="modal-permiso-content">
        <h2>Gestionar Permisos</h2>

        <label>Rol:</label>
        <select
          value={rolSeleccionado}
          onChange={(e) => setRolSeleccionado(e.target.value)}
        >
          {roles.map((rol) => (
            <option key={rol.id} value={rol.id}>
              {rol.nombre}
            </option>
          ))}
        </select>

        <div className="permisos-lista">
          {permisos.map((permiso) => (
            <div key={permiso.id} className="permiso-item">
              <span>{permiso.nombre}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={permisosUsuario.has(permiso.id)}
                  onChange={() => handlePermisoChange(permiso.id)}
                />
                <span className="slider"></span>
              </label>
            </div>
          ))}
        </div>

        <div className="modal-buttons">
          <button className="guardar-btn" onClick={handleGuardar}>
            Guardar
          </button>
          <button className="cerrar-btn" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPermisos;

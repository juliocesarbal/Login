import { useEffect, useState } from "react";
import "./proveedores.css";
import API_URL from "../../config/config";
import ModalProveedor from "./ModalProveedor"; // Este modal lo crearemos también

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorEditando, setProveedorEditando] = useState(null);

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const res = await fetch(`${API_URL}/proveedores`);
      const data = await res.json();
      setProveedores(data);
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este proveedor?")) return;

    try {
      const res = await fetch(`${API_URL}/proveedores/${id}`, {
        method: "DELETE",
      });

      if (res.status === 204) {
        alert("Proveedor eliminado exitosamente");
        setProveedores((prev) => prev.filter((p) => p.id !== id));
      } else {
        const err = await res.json();
        alert("Error: " + err.message);
      }
    } catch (err) {
      console.error("Error al eliminar proveedor:", err);
      alert("Error del servidor");
    }
  };

  const handleCloseModal = () => {
    setProveedorEditando(null);
    fetchProveedores();
  };

  return (
    <div className="proveedores-container">
      <h2 className="proveedores-title">Gestión de Proveedores</h2>
      <button className="crear-btn" onClick={() => setProveedorEditando({})}>
        Crear Nuevo Proveedor
      </button>
      <div className="tabla-proveedores-wrapper">
        <table className="tabla-proveedores">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Dirección</th>
              <th>Nit</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.telefono}</td>
                <td>{p.correo}</td>
                <td>{p.direccion}</td>
                <td>{p.nit}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => setProveedorEditando(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(p.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {proveedorEditando && (
        <ModalProveedor
          proveedorSeleccionado={proveedorEditando}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Proveedores;

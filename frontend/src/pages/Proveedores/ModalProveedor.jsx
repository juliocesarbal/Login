import { useEffect, useState } from "react";
import API_URL from "../../config/config";

const ModalProveedor = ({ proveedorSeleccionado, onClose }) => {
  const esEdicion = !!proveedorSeleccionado?.id;

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    direccion: "",
    nit: "",
    detalle: "",
  });

  useEffect(() => {
    if (proveedorSeleccionado) {
      setFormData({
        nombre: proveedorSeleccionado.nombre || "",
        telefono: proveedorSeleccionado.telefono || "",
        correo: proveedorSeleccionado.correo || "",
        direccion: proveedorSeleccionado.direccion || "",
        nit: proveedorSeleccionado.nit || "",
        detalle: proveedorSeleccionado.detalle || "",
      });
    }
  }, [proveedorSeleccionado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const url = esEdicion
        ? `${API_URL}/proveedores/${proveedorSeleccionado.id}`
        : `${API_URL}/proveedores`;

      const method = esEdicion ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Error al guardar el proveedor");
      }

      onClose(); // Cierra el modal y refresca
    } catch (error) {
      console.error("Error al guardar proveedor:", error);
      alert("Ocurrió un error al guardar");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <h3>{esEdicion ? "Editar Proveedor" : "Crear Proveedor"}</h3>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            name="nombre"
            autoComplete="off"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Teléfono:</label>
          <input
            name="telefono"
            autoComplete="off"
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Correo:</label>
          <input
            name="correo"
            autoComplete="off"
            value={formData.correo}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Dirección:</label>
          <input
            name="direccion"
            autoComplete="off"
            value={formData.direccion}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>NIT:</label>
          <input
            name="nit"
            autoComplete="off"
            value={formData.nit}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Detalle:</label>
          <textarea
            name="detalle"
            value={formData.detalle}
            onChange={handleChange}
          />
        </div>

        <div className="modal-buttons">
          <button className="save-btn-pv" onClick={handleSubmit}>
            {esEdicion ? "Guardar" : "Crear"}
          </button>
          <button className="cancel-btn-pv" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalProveedor;

import { useEffect, useState } from "react";
import API_URL from "../../config/config";
import './modalOfertas.css';

const ModalOferta = ({ ofertaSeleccionada, onClose }) => {
  const esEdicion = !!ofertaSeleccionada?.id;

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    porcentaje: "",
    esta_activo: true,
  });

  useEffect(() => {
    if (ofertaSeleccionada) {
      setFormData({
        nombre: ofertaSeleccionada.nombre || "",
        descripcion: ofertaSeleccionada.descripcion || "",
        porcentaje: ofertaSeleccionada.porcentaje || "",
        esta_activo: ofertaSeleccionada.esta_activo ?? true,
      });
    }
  }, [ofertaSeleccionada]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const url = esEdicion
        ? `${API_URL}/descuentos/${ofertaSeleccionada.id}`
        : `${API_URL}/descuentos`;

      const method = esEdicion ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Error al guardar la oferta");
      }

      onClose(); // Cierra modal y recarga lista
    } catch (error) {
      console.error("Error al guardar oferta:", error);
      alert("Ocurrió un error al guardar la oferta");
    }
  };

  return (
    <div className="modal-oferta-backdrop">
      <div className="modal-oferta-contenido">
        <h3>{esEdicion ? "Editar Descuento" : "Crear Descuento"}</h3>
  
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
          <label>Descripción:</label>
          <input
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          />
        </div>
  
        <div className="form-group">
          <label>Porcentaje (%):</label>
          <input
            name="porcentaje"
            type="number"
            onWheel={(e) => e.target.blur()}
            min="1"
            max="100"
            value={formData.porcentaje}
            onChange={handleChange}
          />
        </div>
  
        <div className="switch-group">
          <span>Activo</span>
          <label className="switch">
            <input
              type="checkbox"
              name="esta_activo"
              checked={formData.esta_activo}
              onChange={handleChange}
            />
            <span className="slider"></span>
          </label>
        </div>
  
        <div className="modal-buttons">
          <button className="save-btn" onClick={handleSubmit}>
            {esEdicion ? "Guardar" : "Crear"}
          </button>
          <button className="btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalOferta;

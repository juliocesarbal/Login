import { useEffect, useState } from "react";
import "./ofertas.css";
import API_URL from "../../config/config.js";
import ModalOferta from "./ModalOfertas.jsx";

const Ofertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [ofertaEditando, setOfertaEditando] = useState(null);

  useEffect(() => {
    fetchOfertas();
  }, []);

  const fetchOfertas = async () => {
    try {
      const res = await fetch(`${API_URL}/descuentos`);
      const data = await res.json();
      setOfertas(data);
    } catch (error) {
      console.error("Error al cargar ofertas:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta oferta?")) return;

    try {
      const res = await fetch(`${API_URL}/descuentos/${id}`, {
        method: "DELETE",
      });

      if (res.status === 204) {
        alert("Oferta eliminada exitosamente");
        setOfertas((prev) => prev.filter((o) => o.id !== id));
      } else {
        const err = await res.json();
        alert("Error: " + err.message);
      }
    } catch (err) {
      console.error("Error al eliminar oferta:", err);
      alert("Error del servidor");
    }
  };

  const handleCloseModal = () => {
    setOfertaEditando(null);
    fetchOfertas();
  };

  return (
    <div className="ofertas-container">
      <h2 className="ofertas-title">Gestión de Descuentos</h2>
      <button className="crear-btn" onClick={() => setOfertaEditando({})}>
        Crear Nuevo Descuento
      </button>
      <div className="tabla-ofertas-wrapper">
        <table className="tabla-ofertas">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Porcentaje</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ofertas.map((o) => (
              <tr key={o.id}>
                <td>{o.nombre}</td>
                <td>{o.descripcion}</td>
                <td>{o.porcentaje}%</td>
                <td>{o.esta_activo ? "Sí" : "No"}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => setOfertaEditando(o)}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(o.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ofertaEditando && (
        <ModalOferta
          ofertaSeleccionada={ofertaEditando}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Ofertas;

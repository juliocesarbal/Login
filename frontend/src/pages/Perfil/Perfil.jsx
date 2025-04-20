import { useEffect, useState } from "react";
import API_URL from "../../config/config";
import "./perfil.css";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const usuarioId = sessionStorage.getItem("usuarioId");

  useEffect(() => {
    if (usuarioId) {
      fetch(`${API_URL}/users/${usuarioId}`)
        .then((res) => res.json())
        .then((data) => setUsuario(data))
        .catch((err) => console.error("Error al cargar perfil:", err));
    }
  }, [usuarioId]);

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      const res = await fetch(`${API_URL}/users/${usuarioId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      });

      const data = await res.json();
      if (res.ok) {
        setUsuario(data);
        setMensaje("Perfil actualizado con éxito");
        setEditando(false);
      } else {
        setMensaje("Error al actualizar perfil");
      }
    } catch (error) {
      console.error(error);
      setMensaje("Error al conectarse con el servidor");
    }
  };

  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <div className="perfil-container">
      <h2>Mi Perfil</h2>

      <div className="perfil-form">
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={usuario.nombre}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>
        <label>
          Correo:
          <input
            type="email"
            name="correo"
            value={usuario.correo}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>
        <label>
          Teléfono:
          <input
            type="text"
            name="telefono"
            value={usuario.telefono}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>
        <label>
          Sexo:
          <select
            name="sexo"
            value={usuario.sexo}
            onChange={handleChange}
            disabled={!editando}
          >
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro</option>
          </select>
        </label>
        <label>
          Domicilio:
          <input
            type="text"
            name="domicilio"
            value={usuario.domicilio}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>
        <label>
          CI:
          <input type="text" value={usuario.ci} disabled />
        </label>
      </div>

      <div className="perfil-actions">
        {editando ? (
          <>
            <button onClick={handleGuardar}>Guardar</button>
            <button onClick={() => setEditando(false)}>Cancelar</button>
          </>
        ) : (
          <button onClick={() => setEditando(true)}>Editar Perfil</button>
        )}
      </div>

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
};

export default Perfil;

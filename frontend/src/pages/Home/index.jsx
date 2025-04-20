import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import API_URL from "../../config/config";

const Home = () => {
  const navigate = useNavigate();
  const [sucursal, setSucursal] = useState(null);
  const [dispensadores, setDispensadores] = useState([]);
  const [permisos, setPermisos] = useState([]);

  const handleLogOut = () => {
    sessionStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    // Cargar permisos del usuario
    const usuarioId = sessionStorage.getItem("usuarioId");

    if (usuarioId) {
      fetch(`${API_URL}/usuarios/permisos/${usuarioId}`)
        .then((res) => res.json())
        .then((data) => setPermisos(data.permisos.map((p) => p.nombre)))
        .catch((err) =>
          console.error("Error al cargar permisos del usuario:", err)
        );
    }

    // Cargar datos de la sucursal
    const sucursalData = {
      id: sessionStorage.getItem("sucursalId"),
      nombre: sessionStorage.getItem("sucursalNombre"),
      direccion: sessionStorage.getItem("sucursalDireccion"),
      telefono: sessionStorage.getItem("sucursalTelefono"),
      correo: sessionStorage.getItem("sucursalCorreo"),
      esta_suspendido: sessionStorage.getItem("sucursalSuspendida") === "true",
    };

    if (sucursalData.id) {
      setSucursal(sucursalData);

      fetch(`${API_URL}/infoSucursal?sucursalId=${sucursalData.id}`)
        .then((res) => res.json())
        .then((data) => setDispensadores(data))
        .catch((err) =>
          console.error("Error al cargar info de la sucursal:", err)
        );
    }
  }, []);

  return (
    <div className="dashboard-container">

      <main className="main-content">
        <h1>Bienvenido a la Sucursal</h1>

        {sucursal ? (
          <div className="sucursal-info">
            <h2>{sucursal.nombre}</h2>
            <p>
              <strong>Dirección:</strong> {sucursal.direccion}
            </p>
            <p>
              <strong>Teléfono:</strong>{" "}
              {sucursal.telefono || "No registrado"}
            </p>
            <p>
              <strong>Correo:</strong> {sucursal.correo}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              <span
                style={{
                  color: sucursal.esta_suspendido ? "red" : "green",
                }}
              >
                {sucursal.esta_suspendido ? "Suspendida" : "Activa"}
              </span>
            </p>
          </div>
        ) : (
          <p>Cargando datos de la sucursal...</p>
        )}

        {permisos.includes("ver_dashboard") && (
          <section className="dispensadores-section">
            <h2>Dispensadores de Combustible</h2>
            {dispensadores.length > 0 ? (
              <div className="dispensadores-grid">
                {dispensadores.map((disp, idx) => (
                  <div key={idx} className="dispensador-card">
                    <h3>Ubicación: {disp.ubicacion}</h3>
                    <p>
                      <strong>Estado:</strong> {disp.estado}
                    </p>
                    <p>
                      <strong>Capacidad máxima:</strong>{" "}
                      {disp.capacidad_maxima} litros
                    </p>
                    <p>
                      <strong>Combustible:</strong>{" "}
                      {disp.combustible_nombre}
                    </p>
                    <p>
                      <strong>Tipo:</strong> {disp.combustible_tipo}
                    </p>
                    {disp.combustible_octanaje && (
                      <p>
                        <strong>Octanaje:</strong>{" "}
                        {disp.combustible_octanaje}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No se encontraron dispensadores para esta sucursal.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;

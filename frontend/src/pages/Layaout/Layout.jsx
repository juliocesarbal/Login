// src/components/Layout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./layout.css"; // puedes copiar tus estilos ahí
import API_URL from "../../config/config";

const Layout = () => {
  const navigate = useNavigate();
  const [permisos, setPermisos] = useState([]);

  const handleLogOut = () => {
    sessionStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const usuarioId = sessionStorage.getItem("usuarioId");

    if (usuarioId) {
      fetch(`${API_URL}/usuarios/permisos/${usuarioId}`)
        .then((res) => res.json())
        .then((data) => setPermisos(data.permisos.map((p) => p.nombre)))
        .catch((err) => console.error("Error al cargar permisos:", err));
    }
  }, []);

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <h2>Octano</h2>
        <ul>
          {permisos.includes("ver_dashboard") && (
            <li onClick={() => navigate("/home")}>Dashboard</li>
          )}
          {permisos.includes("gestionar_usuarios") && (
            <li onClick={() => navigate("/usuarios")}>Usuarios</li>
          )}
          {permisos.includes("gestionar_compras") && (
            <li onClick={() => navigate("/compras")}>Compras</li>
          )}
          {permisos.includes("gestionar_ventas") && (
            <li onClick={() => navigate("/ventas")}>Ventas</li>
          )}
          {permisos.includes("gestionar_inventario") && (
            <li onClick={() => navigate("/inventario")}>Inventario</li>
          )}
          <li onClick={() => navigate("/asistencias")}>Asistencias</li>
          <li onClick={() => navigate("/perfil")}>Perfil</li> {/* ✅ Nuevo botón */}
          <li onClick={handleLogOut}>Cerrar sesión</li>
        </ul>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

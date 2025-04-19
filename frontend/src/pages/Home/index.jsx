import { useNavigate } from "react-router-dom";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    sessionStorage.removeItem("authToken");
    navigate("/");
  };

  const sections = [
    { title: "Usuarios", description: "Gestión de cuentas y permisos." },
    { title: "Surtidor", description: "Control de surtidores y mantenimiento." },
    { title: "Compras", description: "Registro de compras a proveedores." },
    { title: "Ventas", description: "Seguimiento de ventas realizadas." },
    { title: "Inventario", description: "Gestión de productos y stock." },
  ];

  const handleNavigate = (section) => {
    const path = section.toLowerCase();
    navigate(`/${path}`);
  };

  return (
    <div id="divhome">
      <h2 id="titleHome">WELCOME</h2>

      <div className="home-sections">
        {sections.map((section, index) => (
          <div key={index} className="section-card">
            <h3>{section.title}</h3>
            <p>{section.description}</p>
            <button
              className="section-button"
              onClick={() => handleNavigate(section.title)}
            >
              Ir a {section.title}
            </button>
          </div>
        ))}
      </div>
      <input type="text" />

      <button className="buttonHome" onClick={handleLogOut}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Home;

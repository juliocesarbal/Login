import { Route, Routes } from "react-router-dom";
import Register from "../pages/Register/index.jsx";
import Login from "../pages/Login/index.jsx";
import Home from "../pages/Home/index.jsx";
import PrivateRoutes from "./PrivateRoutes.jsx";
import Usuarios from "../pages/Usuarios/Usuarios.jsx";
import Perfil from "../pages/Perfil/Perfil.jsx";
import Layout from "../pages/Layaout/Layout.jsx";
import RegistroAsistencia from "../pages/RegistroAsistencia/RegistroAsistencia.jsx";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas */}
      <Route element={<PrivateRoutes />}>
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/asistencias" element={<RegistroAsistencia />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;

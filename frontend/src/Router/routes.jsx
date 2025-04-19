import { Route,Routes } from "react-router-dom";
import Register from "../pages/Register/index.jsx";
import Login from "../pages/Login/index.jsx";
import Home from "../pages/Home/index.jsx";
import PrivateRoutes from "./PrivateRoutes.jsx";
import Usuarios from "../pages/Usuarios/Usuarios.jsx";


const Router = () =>{
    return(
        <Routes>
            <Route path="/" element={<Login></Login>}/>
            <Route path="/Register" element={<Register/>}/>
            <Route element={<PrivateRoutes />}>
                <Route path="/home" element={<Home />} />
                <Route path="/usuarios" element={<Usuarios />} />
            </Route>
        </Routes>
    );
};
export default Router;
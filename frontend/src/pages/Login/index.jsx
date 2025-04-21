import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faUser, faEye, faEyeSlash} from "@fortawesome/free-regular-svg-icons";
import {faLock} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from 'react';
import './login.css';
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../../config/config";

const Login =() =>{
  const navigate = useNavigate();
     const [objData,setObjData] = useState({name:"",password:""});
      const [errors,setErrors]= useState({});
      const [isDisabled,setIsDisabled] = useState(false);
      const [showPassword,setShowPassword] = useState(false);
    
      useEffect(() =>{
        const isValid =Object.values(errors).every((error) =>!error);
        const allFieldsFilled =Object.values(objData).every(
          (value)=>value.trim() !== "");
        setIsDisabled(!isValid || !allFieldsFilled)
      },[errors,objData]);
    
      const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      }
    
      const validations = (name,value)=>{
        const errorMessages ={
          name:"El usuario es requerido",
          password:"Debe tener 6 caracteres y una mayuscula",
        };
        let errorMessage = null;
        if(!value.trim()){
          errorMessage = `El ${name} es requerido`;
        }else if(name ==="password"){
          if(value.length < 6 || !/[A-Z]/.test(value)){
            errorMessage = errorMessages[name];
          }
        }
        setErrors((prevErrors) =>({
          ...prevErrors,
          [name]:errorMessage,
        }))
      };
    
      const handleChange =({target: {value,name}}) => {
        let data = {[name]:value};
        setObjData({
          ...objData,
          ...data,
        });
        validations(name,value);
      };
    
      const sendData = async () => {
        try {
          const response = await fetch(`${API_URL}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(objData),
          });
      
          if (response.status === 400) {
            const responseData = await response.json();
            const errorMessages = {};
            responseData.errors.forEach((error) => {
              errorMessages[error.path] = error.msg;
            });
            setErrors(errorMessages);
            console.warn("Errores del backend:", errorMessages);
            return;
          }
      
          if (!response.ok) {
            throw new Error("Error en el servidor");
          }
      
          const data = await response.json();
          console.log("Login successful");
      
          sessionStorage.setItem("authToken", data.token);
          sessionStorage.setItem("usuarioId", data.usuario.id);


          // ✅ Guardamos info útil para la homepage:
          const { sucursal } = data.usuario;
      
          if (sucursal) {
            sessionStorage.setItem("sucursalId", sucursal.id);
            sessionStorage.setItem("sucursalNombre", sucursal.nombre);
            sessionStorage.setItem("sucursalDireccion", sucursal.direccion);
            sessionStorage.setItem("sucursalTelefono", sucursal.telefono);
            sessionStorage.setItem("sucursalCorreo", sucursal.correo);
            sessionStorage.setItem("sucursalSuspendida", sucursal.esta_suspendido);
          }
      
          navigate("/home");
      
        } catch (error) {
          console.error("Error al enviar los datos del front:", error);
        }
      };
      
    
      const handleSubmit =(e)=>{
        e.preventDefault();
        sendData();
      };
      return (
        <div className="login-wrapper">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-title">Bienvenidos a Octano</h2>
            <p className="login-subtitle">Por favor ingrese sus datos</p>
      
            <div className="input-group">
              <label htmlFor="name">Usuario</label>
              <div className="input-icon">
                <FontAwesomeIcon icon={faUser} className="icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="usuario"
                  autoComplete="off"
                  onChange={handleChange}
                  value={objData.name}
                />
              </div>
              {errors && <span className="error">{errors.name}</span>}
            </div>
      
            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-icon">
                <FontAwesomeIcon icon={faLock} className="icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="contraseña"
                  autoComplete="off"
                  onChange={handleChange}
                  value={objData.password}
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="eye-icon"
                  onClick={togglePasswordVisibility}
                />
              </div>
              {errors && <span className="error">{errors.password}</span>}
            </div>
      
            <button disabled={isDisabled} className="login-button">
              Iniciar sesión
            </button>
      
            <div className="login-footer">
              <Link to="/Register">Crear una cuenta</Link>
            </div>
          </form>
        </div>
      );
      
      
};
export default Login;
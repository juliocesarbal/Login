import { useEffect, useState } from 'react';
import './register.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../../config/config';

const Register = () => {
  const navigate = useNavigate();
  const [objData, setObjData] = useState({
    ci: "", name: "", telefono: "", sexo: "",
    email: "", domicilio: "", password: "",
    id_sucursal: "", id_rol: ""
  });
  const [errors, setErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [sucursales, setSucursales] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/sucursales`)
      .then(res => res.json())
      .then(data => setSucursales(data))
      .catch(err => console.error('Error cargando sucursales', err));

    fetch(`${API_URL}/roles`)
      .then(res => res.json())
      .then(data => setRoles(data))
      .catch(err => console.error('Error cargando roles', err));
  }, []);

  useEffect(() => {
    const isValid = Object.values(errors).every((error) => !error);
    const allFieldsFilled = Object.values(objData).every(value => value.trim() !== "");
    setIsDisabled(!isValid || !allFieldsFilled)
  }, [errors, objData]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validations = (name, value) => {
    const errorMessages = {
      ci: "CI requerido",
      name: "El usuario es requerido",
      telefono: "Número de teléfono requerido",
      email: "Debes escribir un email válido",
      domicilio: "Domicilio requerido",
      password: "Debe tener 6 caracteres y una mayúscula",
    };
    let errorMessage = null;
    if (!value.trim()) {
      errorMessage = `El ${name} es requerido`;
    } else if (name === "password") {
      if (value.length < 6 || !/[A-Z]/.test(value)) {
        errorMessage = errorMessages[name];
      }
    } else if (name === "email") {
      const isValidEmail = /\S+@\S+\.\S+/.test(value);
      if (!isValidEmail) {
        errorMessage = errorMessages[name];
      }
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: errorMessage }));
  };

  const handleChange = ({ target: { value, name } }) => {
    setObjData({ ...objData, [name]: value });
    validations(name, value);
  };

  const sendData = async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(objData),
      });

      if (response.status === 400) {
        const responseData = await response.json();
        console.log("Errores del backend:", responseData); 
        const errorMessages = {};
        responseData.errors.forEach(error => {
          errorMessages[error.path] = error.msg;
        });
        setErrors(errorMessages);
        throw new Error("Error al enviar los datos");
      } else {
        const data = await response.json();
        console.log("Post successful");
        navigate("/");
      }

    } catch (error) {
      throw new Error("Error al enviar los datos del front", error);
    }
  };

  const handleReset = () => {
    setObjData({
      ci: "", name: "", telefono: "", sexo: "",
      email: "", domicilio: "", password: "",
      id_sucursal: "", id_rol: ""
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendData();
    handleReset();
  };

  return (
    <form className='formclass' onSubmit={handleSubmit}>
      <h2 className="title">Crea una cuenta</h2>
      <div className="Inputclass">
    <FontAwesomeIcon icon={faUser} className='icon'/>
    <input
      type="text"
      name="ci"
      placeholder="Cédula de Identidad"
      onChange={handleChange}
      value={objData.ci}
    />
    {errors.ci && <span>{errors.ci}</span>}
  </div>

  <div className="Inputclass">
    <FontAwesomeIcon icon={faUser} className='icon'/>
    <input
      type="text"
      name="name"
      placeholder="Nombre de usuario"
      onChange={handleChange}
      value={objData.name}
    />
    {errors.name && <span>{errors.name}</span>}
  </div>

  <div className="Inputclass">
    <FontAwesomeIcon icon={faUser} className='icon'/>
    <input
      type="text"
      name="telefono"
      placeholder="Teléfono"
      onChange={handleChange}
      value={objData.telefono}
    />
    {errors.telefono && <span>{errors.telefono}</span>}
  </div>
      <div className="Inputclass">
        <FontAwesomeIcon icon={faUser} className='icon' />
        <select name="sexo" onChange={handleChange} value={objData.sexo}>
          <option value="">Selecciona tu sexo</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
        {errors.sexo && <span>{errors.sexo}</span>}
      </div>
      <div className="Inputclass">
    <FontAwesomeIcon icon={faEnvelope} className='icon'/>
    <input
      type="email"
      name="email"
      placeholder="Correo electrónico"
      onChange={handleChange}
      value={objData.email}
    />
    {errors.email && <span>{errors.email}</span>}
  </div>

  <div className="Inputclass">
    <FontAwesomeIcon icon={faUser} className='icon'/>
    <input
      type="text"
      name="domicilio"
      placeholder="Domicilio"
      onChange={handleChange}
      value={objData.domicilio}
    />
    {errors.domicilio && <span>{errors.domicilio}</span>}
  </div>
  <div className="Inputclass">
    <FontAwesomeIcon icon={faLock} className='icon'/>
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Contraseña"
      onChange={handleChange}
      value={objData.password}
    />
    <FontAwesomeIcon
      icon={showPassword ? faEyeSlash : faEye}
      className='eye-icon'
      onClick={togglePasswordVisibility}
    />
    {errors.password && <span>{errors.password}</span>}
  </div>

      {/* Nueva sección dinámica de sucursales */}
      <div className="Inputclass">
        <FontAwesomeIcon icon={faUser} className='icon' />
        <select name="id_sucursal" onChange={handleChange} value={objData.id_sucursal}>
          <option value="">Selecciona una sucursal</option>
          {sucursales.map(s => (
            <option key={s.id} value={s.id}>{s.nombre}</option>
          ))}
        </select>
        {errors.id_sucursal && <span>{errors.id_sucursal}</span>}
      </div>

      {/* Nueva sección dinámica de roles */}
      <div className="Inputclass">
        <FontAwesomeIcon icon={faUser} className='icon' />
        <select name="id_rol" onChange={handleChange} value={objData.id_rol}>
          <option value="">Selecciona un rol</option>
          {roles.map(r => (
            <option key={r.id} value={r.id}>{r.nombre}</option>
          ))}
        </select>
        {errors.id_rol && <span>{errors.id_rol}</span>}
      </div>

      <button disabled={isDisabled} id="buttonLogIn">Crear cuenta</button>
      <div className="urlclass">
        <Link id='link' to="/">Iniciar sesión</Link>
      </div>
    </form>
  );
};

export default Register;

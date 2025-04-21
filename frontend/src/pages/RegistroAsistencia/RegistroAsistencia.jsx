import { useState, useEffect } from "react";
import API_URL from "../../config/config";
import "./registroAsistencia.css";

const RegistroAsistencia = () => {
  const [registro, setRegistro] = useState(null);
  const [usuarioId, setUsuarioId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = sessionStorage.getItem("usuarioId");
    setUsuarioId(id);
    if (id) verificarRegistro(id);
  }, []);

  const verificarRegistro = async (id) => {
    try {
      const res = await fetch(`${API_URL}/asistencia/hoy/${id}`);
      if (!res.ok) return setRegistro(null);
      const data = await res.json();
      setRegistro(data);
    } catch (error) {
      console.error("Error al verificar asistencia:", error);
    }
  };

  const marcarEntrada = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/asistencia/entrada`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario: usuarioId }),
      });
      const data = await res.json();
      setRegistro(data);
    } catch (error) {
      console.error("Error al marcar entrada:", error);
    } finally {
      setLoading(false);
    }
  };

  const marcarSalida = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/asistencia/salida`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario: usuarioId }),
      });
      const data = await res.json();
      setRegistro(data);
    } catch (error) {
      console.error("Error al marcar salida:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatearFechaBolivia = (fechaStr) => {
    if (!fechaStr) return "—";
  
    const utcDate = new Date(fechaStr);
    // Sumamos 4 horas (Bolivia = UTC-4)
    const boliviaDate = new Date(utcDate.getTime() - 4 * 60 * 60 * 1000);
  
    const dia = boliviaDate.getDate().toString().padStart(2, "0");
    const mes = (boliviaDate.getMonth() + 1).toString().padStart(2, "0");
    const año = boliviaDate.getFullYear();
  
    const horas = boliviaDate.getHours().toString().padStart(2, "0");
    const minutos = boliviaDate.getMinutes().toString().padStart(2, "0");
    const segundos = boliviaDate.getSeconds().toString().padStart(2, "0");
  
    return `${dia}/${mes}/${año}, ${horas}:${minutos}:${segundos}`;
  };
  const formatearFechaSinHora = (fechaStr) => {
    if (!fechaStr) return "—";
    const [fecha] = fechaStr.split("T"); // se queda con la parte antes de la T
    const [año, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${año}`;
  };
  
  
  

  const calcularTiempoTrabajado = () => {
    if (!registro?.hora_entrada || !registro?.hora_salida) return "—";
    const entrada = new Date(registro.hora_entrada);
    const salida = new Date(registro.hora_salida);
    const diffMs = salida - entrada;
    const diffMin = Math.floor(diffMs / 60000);
    const horas = Math.floor(diffMin / 60);
    const minutos = diffMin % 60;
    return `${horas}h ${minutos}m`;
  };

  return (
    <div className="asistencia-container">
      <h2>Registro de Asistencia</h2>

      {registro ? (
        <div className="asistencia-info">
         <p><strong>Fecha:</strong> {formatearFechaSinHora(registro.fecha)}</p>
          <p><strong>Entrada:</strong> {formatearFechaBolivia(registro.hora_entrada)}</p>
          <p><strong>Salida:</strong> {registro.hora_salida ? formatearFechaBolivia(registro.hora_salida) : "—"}</p>
          <p><strong>Tiempo trabajado:</strong> {calcularTiempoTrabajado()}</p>

          {!registro.hora_salida && (
            <button className="asistencia-btn" onClick={marcarSalida} disabled={loading}>
              {loading ? "Guardando..." : "Marcar Salida"}
            </button>
          )}
        </div>
      ) : (
        <button className="asistencia-btn" onClick={marcarEntrada} disabled={loading}>
          {loading ? "Registrando..." : "Marcar Entrada"}
        </button>
      )}
    </div>
  );
};

export default RegistroAsistencia;

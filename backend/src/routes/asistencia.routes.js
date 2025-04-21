import express from "express";
import {
  marcarEntrada,
  marcarSalida,
  obtenerRegistroHoy,
} from "../controllers/asistencia.controller.js";

const router = express.Router();

router.post("/entrada", marcarEntrada);
router.put("/salida", marcarSalida);
router.get("/hoy/:id_usuario", obtenerRegistroHoy);

export default router;

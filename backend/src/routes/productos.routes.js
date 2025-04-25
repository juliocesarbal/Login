import { Router } from "express";
import {
  createProducto,
  updateProducto,
  deleteProducto,
} from "../controllers/productos.controller.js";

const router = Router();

router.post("/", createProducto);
router.put("/:id", updateProducto);
router.delete("/:id", deleteProducto);

export default router;

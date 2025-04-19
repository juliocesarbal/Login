import{Router} from "express";
import { getSucursales,getRoles } from "../controllers/general.controller.js";


const router = Router();


router.get('/sucursales', getSucursales);
router.get('/roles', getRoles);

export default router;

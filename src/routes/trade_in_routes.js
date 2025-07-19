import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";

import {
    agregarTradein,
    listarTradein,
    listarTradeinPorId,
    actualizarTradein,
    eliminarTradein
} from '../controllers/trade_in_controller.js'

const router = Router()

router.post('/agregarTradein', autenticar, verificarRol('Administrador', 'Cliente'), agregarTradein) 

router.get('/listarTradein', autenticar, verificarRol('Administrador', 'Cliente'), listarTradein) 

router.get('/listarTradeinPorId/:id', autenticar, verificarRol('Administrador', 'Cliente'), listarTradeinPorId) 

router.put('/actualizarTradein/:id', autenticar, verificarRol('Administrador', 'Cliente'), actualizarTradein) 

router.delete('/eliminarTradein/:id', autenticar, verificarRol('Administrador', 'Cliente'), eliminarTradein) 

export default router

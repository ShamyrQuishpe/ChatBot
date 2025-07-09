import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";

import{
    crearCategoria,
    listarCategorias,
    actualizarCategorias,
    eliminarCategoria,

} from '../controllers/category_controller.js'

const router = Router()

router.post('/crearCategoria', autenticar, verificarRol('Administrador', 'Cliente'), crearCategoria) //Monica

router.get('/listarCategorias', autenticar, verificarRol('Administrador', 'Cliente'), listarCategorias) //Monica Miguel

router.put('/actualizarCategoria/:id', autenticar, verificarRol('Administrador', 'Cliente'), actualizarCategorias) //Monica

router.delete('/eliminarCategoria/:id', autenticar, verificarRol('Administrador', 'Cliente'), eliminarCategoria) //Monica

export default router
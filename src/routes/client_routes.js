import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";

const router = Router()

import {
    loginUsuario,
    registroUsuario,
    perfilCliente,
    listarUsuarios,
    nuevaPassword,
    eliminarUsuario,
    actualizarUsuario,


} from '../controllers/client_controller.js'

router.post('/login', loginUsuario) 

router.post('/registro',autenticar, verificarRol('Administrador'), registroUsuario) 

router.get('/perfil', autenticar, perfilCliente)

router.get('/users',autenticar, verificarRol('Administrador'), listarUsuarios) 

router.put('/nuevapassword/:id',autenticar, verificarRol('Administrador'), nuevaPassword) 

router.put('/users/:id',autenticar, verificarRol('Administrador'), actualizarUsuario)

router.delete('/users/:id',autenticar, verificarRol('Administrador'), eliminarUsuario) 

export default router

import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";

const router = Router()

import {
    loginUsuario,
    registroUsuario,
    perfilUsuario,
    listarUsuarios,
    nuevaPassword,
    eliminarUsuario,
    actualizarUsuario,

} from '../controllers/client_controller.js'

router.post('/login', loginUsuario) 

router.post('/registro' /*,autenticar, verificarRol('Administrador')*/, registroUsuario) 

router.get('/perfil', autenticar, perfilUsuario)

router.get('/users',autenticar, verificarRol('Administrador'), listarUsuarios) 

router.put('/nuevapassword/:cedula',autenticar, verificarRol('Administrador'), nuevaPassword) 

router.put('/users/:cedula',autenticar, verificarRol('Administrador'), actualizarUsuario)

router.delete('/users/:cedula',autenticar, verificarRol('Administrador'), eliminarUsuario) 

export default router

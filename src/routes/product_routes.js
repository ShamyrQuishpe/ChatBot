import { Router } from "express";
import autenticar from "../middlewares/auth.js";
import verificarRol from "../middlewares/verifyrol.js";

import { 
    agregarProducto, 
    listarProductos, 
    actualizarProducto, 
    eliminarProducto, 
    listarProductoPorId
} from "../controllers/product_controller.js";

const router = Router()


router.post('/agregarProducto', autenticar, verificarRol('Administrador', 'Cliente'), agregarProducto) 

router.get('/listarProductos', autenticar, verificarRol('Administrador', 'Cliente'), listarProductos) 

router.get('/listarProducto/:id', autenticar, verificarRol('Administrador', 'Cliente'), listarProductoPorId) 

router.put('/actualizarProducto/:id', autenticar, verificarRol('Administrador', 'Cliente'), actualizarProducto) 

router.delete('/eliminarProducto/:id', autenticar, verificarRol('Administrador', 'Cliente'), eliminarProducto) 


export default router
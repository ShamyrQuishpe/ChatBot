import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routerClients from './routes/client_routes.js'
import routerProducts from './routes/product_routes.js'
import routerCategories from './routes/category_routes.js'

const app = express ()
dotenv.config()

app.set('port', process.env.port || 3000)
app.use(cors())

app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Server on")
})

app.use('/chat/users',routerClients) 
app.use('/chat/products',routerProducts)
app.use('/chat/products',routerCategories)


// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

// Exportar la instancia de express por medio de app
export default app
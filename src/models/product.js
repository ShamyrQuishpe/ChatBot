import mongoose, {Schema, model} from 'mongoose'

const productSchema = new Schema({
    codigoModelo:{
        type: String,
        required: true,
    },
    nombreEquipo:{
        type: String,
        required: true,
    },
    color:{
        type: String,
        required: true,
    },
    capacidad:{
        type: String,
        required: true,
    },
    precio:{
        type: Number,
        required: true
    },
    precioPromocional:{
        type: Number,
        default: null
    },
    responsable: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'client' },
            nombre: { type: String },
        }
    ],
    tipo:{
        type: String,
        required: true
    },
    estado:{
        type: String,
        required: true
    },
    categoriaNombre: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'category'},
            nombreCategoria: { type:String },
        }
    ],
})

export default mongoose.model('Products',productSchema) 
import mongoose, {Schema, model} from 'mongoose'

const tradeSchema = new Schema({
    nombreEquipo:{
        type: String,
        required: true,
    },
    valorMaximo:{
        type: Number,
        required: true
    },
    valorMinimo:{
        type: Number,
        required: true
    },
    responsable: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'client' },
            nombre: { type: String },
        }
    ],
    categoriaNombre: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'category'},
            nombreCategoria: { type:String },
        }
    ],
})

export default mongoose.model('Tradein',tradeSchema) 
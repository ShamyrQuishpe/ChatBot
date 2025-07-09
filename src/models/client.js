import {Schema, model} from 'mongoose'
import bcrypt from 'bcryptjs'

const clientSchema = new Schema({
    nombre:{
        type:String,
        required:true,
    },
    apellido:{
        type:String,
        required:true,
    },
    cedula:{
        type:String,
        required:true,
    },
    telefono:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    area:{
        type:String,
        requiered:true,
    },
    rol:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        default: true,
    },
    
},{
    timestamps:true
})

clientSchema.methods.encrypPassword = async function(password){
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};


clientSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password,this.password)
    return response
}

clientSchema.methods.crearToken = function(){
    const tokenGenerado = this.token = Math.random().toString(36)
    return tokenGenerado
}

export default model('Clients',clientSchema)
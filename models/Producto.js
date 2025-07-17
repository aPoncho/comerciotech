import mongoose from "mongoose";

const productosSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        unique : true
    },
    descripcion:{
        type: String,
        required: true,
    },
    precio:{
        type: Number,
        required: true,
        min: 0
    },
    stock:{
        type: Number,
        required: true,
        min: 0
    },
    categoria:{
        type: String,
        enum:['Electronica','Computadores','Perifericos','Telefonos'],
        default: 'Electronica'
    }
})

export default mongoose.model('Producto',productosSchema);
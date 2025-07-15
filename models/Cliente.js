import mongoose from "mongoose";


const clienteSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    apellido:{
        type: String,
        required: true,
        trim: true
    },

   telefono:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    correo:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/,'Por favor ingrese un correo valido']
    },

    direccion:{
        type: {
            calle:{
                type: String,
                required: true,
                trim: true
            },
            ciudad:{
                type: String,
                required: true,
                trim: true
            },
            region:{
                type: String,
                required: true,
                trim: true
            },
            codigo_postal:{
                type: Number,
                required: true,
                trim: true
            }
        },
        _id : false    // para evitar que tenga id propio
    },

    fechaRegistro:{
        type: Date,
        defailt: Date.now
    }
})



export default mongoose.model('Cliente',clienteSchema);
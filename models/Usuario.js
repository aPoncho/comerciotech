import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/,'Por favor ingrese un correo valido']
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres.'],
    }
})



export default mongoose.model('Usuario', usuarioSchema);
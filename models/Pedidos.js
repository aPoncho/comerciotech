import mongoose from "mongoose";
import Cliente from "./Cliente.js";
import Productos from "./Producto.js";




const pedidoSchema = new mongoose.Schema({
    cliente:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required : true
    },
    productos:[
        {
            producto:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Producto'
            },
            cantidad:{
                type:Number,
                required: true,
                min: 1
            },
            precio:{
                type:Number,
                required: true,
                min: 1
            }
        }
    ],
    fechaPedido:{
        type: Date,
        default: Date.now   
    },
    estado:{
        type: String,
        enum: ['Pendiente','Procesando','Enviado','Cancelado'],
        default: 'Pendiente'
    },
    total:{
        type:Number,
        required: true,
        min:0
    }  
})

export default mongoose.model('Pedido',pedidoSchema);
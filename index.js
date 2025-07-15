import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import authMiddleware from './middleware/auth.js';
import authRoute from './routes/auth.js';
import mongoose from 'mongoose';
import clienteRoute from './routes/clientes.js';
import productoRoute from './routes/productos.js';
import pedidoRoute from './routes/pedidos.js';


const app = express();
app.use(express.json());
const PORT = process.env.PORT;
const MONGO_URL = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.MONGODB_URI}/${process.env.DB_NAME}?authSource=${process.env.DB_NAME}`
console.log(MONGO_URL)
mongoose.connect(MONGO_URL)
    .then(()=>{
        console.log('Se conecto al servidor de MongoDB');
    })
    .catch((error)=>{
        console.log('Error al conectar al servidor de BD', error);
        process.exit(1);
    });

app.listen(PORT,()=>{
    console.log(`Conectado al puerto ${PORT}`)
} );

app.get('/',(req,res)=>{
    res.send('*Pagina Principal*')
});

app.use('/api/auth', authRoute);

app.use('/clientes', authMiddleware, clienteRoute);

app.use('/productos', authMiddleware, productoRoute);

app.use('/pedidos', authMiddleware, pedidoRoute);


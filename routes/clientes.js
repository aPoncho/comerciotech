import { Router} from 'express';
import Cliente from '../models/Cliente.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config()
//esto deberia estar en un .ENV

const clienteRoute=Router();


//GET: todos los clientes
clienteRoute.get('/', async (req, res)=>{
    try{
        const clientes = await Cliente.find({});
        res.status(200).json(clientes);
    }catch(error){
        res.status(500).json({message: error.message})

    }
    
});

//GET: cliente por id
clienteRoute.get('/:id', async (req, res)=>{
    try{
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) {
            return res.status(400).json({ message: 'No se encontro un cliente con ese ID' });
        }
        res.status(200).json(cliente);
    }catch(error){
        res.status(500).json({message: error.message})
    }
    
});

//GET: cliente por correo
clienteRoute.get('/buscar-correo/:correo', async (req, res)=>{
    try{
        const correoBuscado = req.params.correo
        const cliente = await Cliente.findOne({correo : correoBuscado});
        if (!cliente) {
            return res.status(404).json({ message: 'No se encontró un cliente con ese correo.'}); 
        }
        res.status(200).json(cliente);
    }catch(error){
        res.status(500).json({message: error.message})
    }
    
});

//Sincrono = de uno en uno (recuerda las apps que hemos hecho en python)
//aSYNC = aSINCRONO todo funciona a la vez 

//PUT: obtener cliente por id y actualizar
clienteRoute.put('/:id', async (req, res)=>{
    try {
        const clienteActualizado = await req.body;
        const cliente  = await Cliente.findByIdAndUpdate(req.params.id, clienteActualizado);
        if (!clienteActualizado) {
            return res.status(404).json({ message: 'No se encontro ningun cliente con ese ID' });
        }
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

//POST: 
clienteRoute.post('/', async (req, res)=>{
    try{
        console.log(req.body)
        const password = req.body.password;
        const saltRounds = Number(process.env.SALTROUNDS);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newCliente = new Cliente({
            nombre : req.body.nombre,
            apellido: req.body.apellido,
            telefono: req.body. telefono,
            correo: req.body.correo,
            direccion: req.body.direccion,
            password: hashedPassword
        });
        console.log(newCliente);
        await newCliente.save();
        res.status(201).json(newCliente);
    }catch(error){
        res.status(500).json({message: error.message})

    }
    
});


// DELETE: Elimina cliente por ID
clienteRoute.delete('/:id', async (req,res) =>{
    try {
        const cliente = await Cliente.findByIdAndDelete(req.params.id);
        res.status(204).json("Cliente eliminado con exito");
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

export default clienteRoute;
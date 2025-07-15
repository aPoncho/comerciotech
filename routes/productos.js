import { Router} from 'express';
import Producto from '../models/Producto.js';


const productoRoute=Router();



// GET: Todos los productos
productoRoute.get('/', async (req, res)=>{
    try{
        const productos = await Producto.find();
        if (productos.length === 0) {
            return res.status(204).json()};
        res.status(200).json(productos);
    }catch (error) {
        res.status(500).json({message: error.message});
    }
});


// GET: Producto por Nombre
productoRoute.get('/:nombre', async (req, res)=>{
    try{
        const producto = await Producto.findOne({nombre: req.params.nombre});
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        res.status(200).json(producto);
    }catch(error){
        res.status(500).json({message: error.message})
    }
    
});


// POST:
productoRoute.post('/', async (req, res)=>{
    try{
        const newProducto = new Producto({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            stock: req.body.precio,
            categoria: req.body.categoria
        });
        console.log(newProducto);
        await newProducto.save();
        res.status(200).json(newProducto);
    }catch (error) {
        res.status(500).json({message: error.message});
    }
})


// PUT: Encuentra por ID y actualiza
productoRoute.put('/:id', async (req, res)=>{
    try {
        const productoActualizado = await req.body;
        const producto  = await Producto.findByIdAndUpdate(req.params.id, productoActualizado);
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


// DELETE:
productoRoute.delete('/:id', async (req,res) =>{
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        res.status(204).json(producto);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})



export default productoRoute;

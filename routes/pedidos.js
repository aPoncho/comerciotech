import { Router } from 'express';
import Pedido from '../models/Pedidos.js';
import Cliente from '../models/Cliente.js';
import Producto from '../models/Producto.js'; 

const pedidoRoute = Router();

// GET: Todos los pedidos
pedidoRoute.get('/', async (req, res) => {
    try {
        const pedidos = await Pedido.find()
            .populate('cliente') // El populate hace que cuando muestres los datos en vez de verse solo el ID del cliente como referenciado, se vean todos los datos del cliente
            .populate('productos.producto');
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET: Pedido por ID
pedidoRoute.get('/:id', async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id)
            .populate('cliente', '-password')
            .populate('productos.producto');
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado.' });
        }
        res.status(200).json(pedido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST: Crear un nuevo pedido
pedidoRoute.post('/', async (req, res) => {
    const { cliente, productos, precio } = req.body; 
    console.log(req.body)

    try {
        const existingCliente = await Cliente.findById(cliente); // Verifica si el cliente existe
        if (!existingCliente) {
            return res.status(404).json({ message: 'No se encontro un cliente con ese ID' });
        }

        let totalCalculado = 0;
        const productosPedido = [];

        
        for (let item of productos) { // Verifica el stock
            const existingProducto = await Producto.findOne({ nombre: item.nombre });
            if (!existingProducto) {
                return res.status(404).json({ message: `No se encontro ningun producto con ese ID.` });//Si hay producto con ese ID
            }
            if (item.cantidad <= 0) {
                 return res.status(400).json({ message: `Debe haber al menos un producto` }); // Si la cantidad de productos es 0
            }
            if (existingProducto.stock < item.cantidad) {
                return res.status(409).json({ message: `No hay suficiente stock para el producto ${existingProducto.nombre} Stock disponible: ${existingProducto.stock}}` }); // Si no hay stock del producto
            }
            console.log(precio, item.precio)
            if (existingProducto.precio !== item.precio){
                return res.status(400).json({ message: 'El precio indicado no corresponde al precio en la BDD'})
            }

            totalCalculado += existingProducto.precio * item.cantidad; //Suma la cantidad de cada producto y calcula el total


            productosPedido.push({ // Agrega cada producto con su cantidad a el arreglo de los productos totales
                producto: item.producto,
                cantidad: item.cantidad,
                precio: item.precio
            });
        }

        const newPedido = new Pedido({
            cliente,
            productos: productosPedido,
            fechaPedido: req.body.fechaPedido || Date.now(),
            estado: req.body.estado || 'Pendiente',
            total: totalCalculado
        });

        await newPedido.save();
        res.status(201).json(newPedido);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




// PUT: Actualizar solo el estado del pedido por su ID
pedidoRoute.put('/:id', async (req, res) => {
    try {
        const { estado } = req.body; // Solo se usa el estado del body


        if (!estado) {
            return res.status(400).json({ message: 'No se dio ningun estado' });
        }

        const pedidoActualizado = await Pedido.findByIdAndUpdate(
            req.params.id,
            { estado: estado }, // Objeto con los campos a actualizar
            {
                new: true,           // Para que devuelva el estado modificado
                runValidators: true, // Para que solo pueda actualizar segun los estados del schema
            }
        )
        .populate('cliente')       
        .populate('productos.producto'); 

        if (!pedidoActualizado) {
            return res.status(404).json({ message: 'No se encontro ningun pedido con ese ID' });
        }

        res.status(200).json(pedidoActualizado);
    } catch (error) {
        if (error.name === 'ValidationError') { // Error por si se pone algun estado que no esta en el schema
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
});



export default pedidoRoute;
import { Router} from 'express';
import Cliente from '../models/Cliente.js';
import bcrypt from 'bcryptjs';

const loginRoute = Router();

//GET: obtener datos y comparar
// {correo : 'correo @gmail.com', password: 'inputcontraseña'}
loginRoute.post('/', async (req, res) => {
    try {
        const correoInput = req.body.correo;
        const passwordInput = req.body.password;
        //vamos a obtener un cliente por su correo
        const cliente = await Cliente.findOne({correo : correoInput});
        if (!cliente) {
            return res.status(401).json({ message: 'Credenciales inválidas.' }); // Corregido: 401 para credenciales incorrectas (usuario no encontrado)
        }
        //si encuentra el cliente, separamos su contraseña (que esta encriptada en la BD)
        const password = cliente.password;
        //encriptamos el input 
        const isMatch = await bcrypt.compare(passwordInput, password);
    if (isMatch) {
        res.status(200).json({message : 'Usuario Loggeado!!'});
    }
    //esto es necesario porque el compare sigue funcionando
    if (!isMatch) {
        res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    } catch (error) {
        res.status(500).json({message : error.message});
    }
    
})


export default loginRoute;
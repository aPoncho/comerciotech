import { Router } from 'express'; // Importa authRouter directamente​
import Usuario from '../models/Usuario.js'; // Importa el modelo de Usuario con .js​
import jwt from 'jsonwebtoken'; // Importa jsonwebtoken​ 
import bcrypt from 'bcryptjs';

const authRoute = Router(); // Crea una instancia de authRouter​

// --- RUTA: REGISTRO DE USUARIO ---​

authRoute.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }
        
        const saltRounds = Number(process.env.SALTROUNDS);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        usuario = new Usuario({email : email,password : hashedPassword});
        await usuario.save();

        const token = jwt.sign( { id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'Usuario registrado exitosamente', token });

    } catch (error) {

        res.status(500).json({ message: 'Error en el servidor', error: error.message });

    }

});

// --- RUTA: INICIO DE SESIÓN DE USUARIO ---​

authRoute.post('/login', async (req, res) => {

    const { email, password } = req.body;

    try {
        //sae obtiene el usuario en la bd a traves del email
        const usuario = await Usuario.findOne({ email });
        console.log(usuario)
        if (!usuario) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const passwordInput = password;
        const userPassword = usuario.password
        const isMatch = await bcrypt.compare(passwordInput, userPassword);

        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign( { id: usuario._id }, process.env.JWT_SECRET,  { expiresIn: '1h' }    );

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });

    } catch (error) {

        res.status(500).json({ message: 'Error en el servidor', error: error.message });

    } });

export default authRoute; 


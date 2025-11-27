// backend/src/controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { usuarioModel } = require('../../database/index.js'); // Importa el modelo correctamente

// Configuración de seguridad
const saltRounds = 10;
const secret = process.env.JWT_SECRET;


const generateToken = (user) => {
  const payload = {
    id: user.id,
    nombre: user.nombre,
    email: user.email
  };

  return jwt.sign(payload, secret, { expiresIn: process.env.JWT_EXPIRATION || '1h' });
};

const testMethod = async (req, res) => {return res.status(200).json({ message: 'Llegaste al controlador.' });};

// ----------------------------------------------------
// 1. REGISTRO (POST /api/auth/register)
// ----------------------------------------------------
const registro = async (req, res) => {
  const { nombre, apellido, email, telefono, fecha_nacimiento, password } = req.body;

  try {
    // 1. Validar que el usuario no exista
    let existingUser = await usuarioModel.findOne({ where: { email } }); //@todo que tan útil son estas lineas ??
    if (existingUser) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }
   
    // 2. Cifrar la contraseña
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Crear el inversionista con el saldo inicial ($1000.00 MXN)
    const newUser = await usuarioModel.create({
      nombre,
      apellido,
      email,
      telefono,
      fecha_nacimiento,
      password: passwordHash,
      saldo: 1000.00, // Saldo inicial por regla de negocio
    });

    // 4. Generar el token (opcional en registro, pero útil para iniciar sesión automático)
    const token = generateToken(newUser);

    // Respuesta al cliente
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        //saldo: newUser.saldo_actual,
        nombre: newUser.nombre,
        apellido: newUser.apellido
      },
      message: 'Registro exitoso.'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor durante el registro.', error});
  }
};

// ----------------------------------------------------
// 2. LOGIN (POST /api/auth/login)
// ----------------------------------------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar al usuario
    const user = await usuarioModel.findOne({ where: { email } });
    if (!user) {
      // Usar un mensaje genérico para no dar pistas
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // 2. Comparar la contraseña cifrada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // 3. Generar el JWT
    const token = generateToken(user);

    // Respuesta al cliente
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        saldo: user.saldo,
        nombre: user.nombre,
        apellido: user.apellido,
        fecha_nacimiento: user.fecha_nacimiento,
        telefono: user.telefono
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor durante el login.' });
  }
};

module.exports = {
  registro,
  login,
  testMethod
};
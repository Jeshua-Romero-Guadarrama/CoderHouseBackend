const { crearToken } = require('../utils/jwt');

// Se responde con los datos del usuario recien registrado.
const registrarUsuario = async (solicitud, respuesta) => {
  return respuesta.status(201).json({ estado: 'success', usuario: solicitud.usuario });
};

// Se crea el token JWT al iniciar sesion.
const loginUsuario = async (solicitud, respuesta) => {
  const token = crearToken(solicitud.usuario);
  return respuesta.json({ estado: 'success', token, usuario: solicitud.usuario });
};

// Se devuelve el usuario asociado al token vigente.
const usuarioActual = async (solicitud, respuesta) => {
  return respuesta.json({ estado: 'success', usuario: solicitud.usuario });
};

module.exports = { registrarUsuario, loginUsuario, usuarioActual };

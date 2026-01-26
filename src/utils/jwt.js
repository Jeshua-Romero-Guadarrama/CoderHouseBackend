const jwt = require('jsonwebtoken');
const { jwtSecreto } = require('../configuracion/entorno');

const crearToken = (usuario) => {
  // Se arma la carga util con los datos minimos del usuario.
  const cargaToken = {
    id: usuario._id,
    email: usuario.email,
    role: usuario.role
  };

  // Se firma el token con expiracion de una hora.
  return jwt.sign(cargaToken, jwtSecreto, { expiresIn: '1h' });
};

module.exports = { crearToken };

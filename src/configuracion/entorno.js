const dotenv = require('dotenv');

// Se cargan variables de entorno desde el archivo .env.
dotenv.config();

// Validar que JWT_SECRETO esté definido (requerido en producción)
if (!process.env.JWT_SECRETO) {
  throw new Error('La variable de entorno JWT_SECRETO es requerida y no está definida.');
}

module.exports = {
  // Se define la URL de MongoDB con un valor por defecto.
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/ecommerce',
  // Se define el secreto JWT desde la variable de entorno (obligatorio).
  jwtSecreto: process.env.JWT_SECRETO,
  // Se define el puerto de escucha del servidor.
  puerto: process.env.PORT || 8080
};

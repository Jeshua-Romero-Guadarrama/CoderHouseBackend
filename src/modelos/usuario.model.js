const mongoose = require('mongoose');

// Se define el esquema de usuario con los campos requeridos.
const usuarioEsquema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carts' },
    role: { type: String, default: 'user' }
  },
  { timestamps: true }
);

// Se limpia la salida JSON para no exponer datos sensibles.
usuarioEsquema.set('toJSON', {
  transform: (documento, retorno) => {
    delete retorno.password;
    delete retorno.__v;
    return retorno;
  }
});

// Se registra el modelo de usuarios en MongoDB.
const UsuarioModelo = mongoose.model('Users', usuarioEsquema);

module.exports = { UsuarioModelo };

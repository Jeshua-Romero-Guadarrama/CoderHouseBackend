const mongoose = require('mongoose');

// Se define el esquema de carrito con productos y cantidades.
const carritoEsquema = new mongoose.Schema(
  {
    productos: [
      {
        producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
        cantidad: { type: Number, default: 1 }
      }
    ]
  },
  { timestamps: true }
);

// Se registra el modelo de carritos en MongoDB.
const CarritoModelo = mongoose.model('Carts', carritoEsquema);

module.exports = { CarritoModelo };

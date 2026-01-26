const express = require('express');
const passport = require('passport');

const { conectarBaseDatos } = require('./configuracion/db');
const { inicializarPassport } = require('./configuracion/passport');
const { puerto } = require('./configuracion/entorno');
const enrutadorUsuarios = require('./rutas/usuarios.router');
const enrutadorSesiones = require('./rutas/sesiones.router');

const aplicacion = express();

// Se habilita el parseo de JSON y datos de formulario.
aplicacion.use(express.json());
aplicacion.use(express.urlencoded({ extended: true }));

// Se inicializa Passport para las estrategias.
inicializarPassport();
aplicacion.use(passport.initialize());

// Se expone un endpoint base de salud.
aplicacion.get('/', (solicitud, respuesta) => {
  return respuesta.json({ estado: 'ok', mensaje: 'API ecommerce activa' });
});

// Se registran las rutas principales del API.
aplicacion.use('/api/usuarios', enrutadorUsuarios);
aplicacion.use('/api/sessions', enrutadorSesiones);

// Se maneja cualquier error no controlado.
aplicacion.use((error, solicitud, respuesta, siguiente) => {
  console.error(error);
  return respuesta.status(500).json({ estado: 'error', mensaje: 'Error interno del servidor' });
});

// Se conecta la base de datos y se inicia el servidor.
conectarBaseDatos().then(() => {
  aplicacion.listen(puerto, () => {
    console.log(`Servidor escuchando en puerto ${puerto}`);
  });
});

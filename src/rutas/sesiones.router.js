const { Router } = require('express');
const { registrarUsuario, loginUsuario, usuarioActual } = require('../controladores/sesiones.controlador');
const { autenticar } = require('../middlewares/passport');

const enrutador = Router();

// Se registra un usuario nuevo con estrategia local.
enrutador.post('/registro', autenticar('registro', { codigo: 400 }), registrarUsuario);
// Se autentica un usuario y se genera token.
enrutador.post('/login', autenticar('login'), loginUsuario);
// Se valida el token y se devuelve el usuario actual.
enrutador.get('/current', autenticar('current'), usuarioActual);

module.exports = enrutador;

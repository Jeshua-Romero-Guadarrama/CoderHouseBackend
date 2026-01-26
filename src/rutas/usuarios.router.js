const { Router } = require('express');
const {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controladores/usuarios.controlador');
const { autenticar } = require('../middlewares/passport');
const { autorizarRoles, autorizarUsuarioOAdmin } = require('../middlewares/autorizacion');

const enrutador = Router();

// Se protege el listado completo para rol admin.
enrutador.get('/', autenticar('current'), autorizarRoles(['admin']), obtenerUsuarios);
// Se protege el detalle por id para admin o mismo usuario.
enrutador.get('/:id', autenticar('current'), autorizarUsuarioOAdmin, obtenerUsuarioPorId);
// Se permite crear usuarios solo a admin.
enrutador.post('/', autenticar('current'), autorizarRoles(['admin']), crearUsuario);
// Se permite actualizar solo a admin o al mismo usuario.
enrutador.put('/:id', autenticar('current'), autorizarUsuarioOAdmin, actualizarUsuario);
// Se permite eliminar usuarios solo a admin.
enrutador.delete('/:id', autenticar('current'), autorizarRoles(['admin']), eliminarUsuario);

module.exports = enrutador;

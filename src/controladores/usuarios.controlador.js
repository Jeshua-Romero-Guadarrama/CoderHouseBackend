const { UsuarioModelo } = require('../modelos/usuario.model');
const { CarritoModelo } = require('../modelos/carrito.model');
const { crearHash } = require('../utils/seguridad');

// Se obtiene el listado completo de usuarios (sin password).
const obtenerUsuarios = async (solicitud, respuesta, siguiente) => {
  try {
    const usuarios = await UsuarioModelo.find().select('-password -__v').lean();
    return respuesta.json({ estado: 'success', usuarios });
  } catch (error) {
    return siguiente(error);
  }
};

// Se obtiene un usuario especifico por id.
const obtenerUsuarioPorId = async (solicitud, respuesta, siguiente) => {
  try {
    const usuario = await UsuarioModelo.findById(solicitud.params.id)
      .select('-password -__v')
      .lean();
    if (!usuario) {
      return respuesta.status(404).json({ estado: 'error', mensaje: 'Usuario no encontrado' });
    }

    return respuesta.json({ estado: 'success', usuario });
  } catch (error) {
    return siguiente(error);
  }
};

// Se crea un usuario nuevo desde el CRUD administrativo.
const crearUsuario = async (solicitud, respuesta, siguiente) => {
  try {
    const {
      first_name: nombre,
      last_name: apellido,
      email: correo,
      age: edad,
      password: contrasena,
      role: rol
    } = solicitud.body;

    // Se valida la presencia de campos obligatorios.
    if (!nombre || !apellido || !correo || !edad || !contrasena) {
      return respuesta.status(400).json({
        estado: 'error',
        mensaje: 'Faltan campos obligatorios'
      });
    }

    // Se evita duplicar el email en la base de datos.
    const usuarioExistente = await UsuarioModelo.findOne({ email: correo });
    if (usuarioExistente) {
      return respuesta.status(409).json({ estado: 'error', mensaje: 'El email ya existe' });
    }

    // Se crea un carrito vacio y se encripta la contrasena.
    const carrito = await CarritoModelo.create({ productos: [] });
    const contrasenaEncriptada = crearHash(contrasena);

    const usuarioCreado = await UsuarioModelo.create({
      first_name: nombre,
      last_name: apellido,
      email: correo,
      age: edad,
      password: contrasenaEncriptada,
      cart: carrito._id,
      role: rol || 'user'
    });

    return respuesta.status(201).json({ estado: 'success', usuario: usuarioCreado });
  } catch (error) {
    if (error.code === 11000) {
      return respuesta.status(409).json({ estado: 'error', mensaje: 'El email ya existe' });
    }

    return siguiente(error);
  }
};

// Se actualizan datos de un usuario existente.
const actualizarUsuario = async (solicitud, respuesta, siguiente) => {
  try {
    const datosActualizacion = { ...solicitud.body };

    // Se vuelve a encriptar la contrasena si llega en el body.
    if (datosActualizacion.password) {
      datosActualizacion.password = crearHash(datosActualizacion.password);
    }

    const usuarioActualizado = await UsuarioModelo.findByIdAndUpdate(
      solicitud.params.id,
      datosActualizacion,
      { new: true }
    );

    if (!usuarioActualizado) {
      return respuesta.status(404).json({ estado: 'error', mensaje: 'Usuario no encontrado' });
    }

    return respuesta.json({ estado: 'success', usuario: usuarioActualizado });
  } catch (error) {
    if (error.code === 11000) {
      return respuesta.status(409).json({ estado: 'error', mensaje: 'El email ya existe' });
    }

    return siguiente(error);
  }
};

// Se elimina un usuario y su carrito asociado si existe.
const eliminarUsuario = async (solicitud, respuesta, siguiente) => {
  try {
    const usuario = await UsuarioModelo.findByIdAndDelete(solicitud.params.id);
    if (!usuario) {
      return respuesta.status(404).json({ estado: 'error', mensaje: 'Usuario no encontrado' });
    }

    if (usuario.cart) {
      await CarritoModelo.findByIdAndDelete(usuario.cart);
    }

    return respuesta.json({ estado: 'success', mensaje: 'Usuario eliminado' });
  } catch (error) {
    return siguiente(error);
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};

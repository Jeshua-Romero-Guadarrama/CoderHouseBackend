// Se valida que el usuario tenga uno de los roles permitidos.
const autorizarRoles = (rolesPermitidos) => (solicitud, respuesta, siguiente) => {
  if (!solicitud.usuario) {
    return respuesta.status(401).json({ estado: 'error', mensaje: 'No autenticado' });
  }

  if (!rolesPermitidos.includes(solicitud.usuario.role)) {
    return respuesta.status(403).json({ estado: 'error', mensaje: 'Sin permisos' });
  }

  return siguiente();
};

// Se permite el acceso si es admin o si es el mismo usuario.
const autorizarUsuarioOAdmin = (solicitud, respuesta, siguiente) => {
  if (!solicitud.usuario) {
    return respuesta.status(401).json({ estado: 'error', mensaje: 'No autenticado' });
  }

  // Se identifica si el rol es admin.
  const esAdmin = solicitud.usuario.role === 'admin';
  // Se compara el id del token contra el id del parametro.
  const esMismoUsuario =
    solicitud.usuario._id && solicitud.usuario._id.toString() === solicitud.params.id;

  if (!esAdmin && !esMismoUsuario) {
    return respuesta.status(403).json({ estado: 'error', mensaje: 'Sin permisos' });
  }

  return siguiente();
};

module.exports = { autorizarRoles, autorizarUsuarioOAdmin };

const passport = require('passport');
const LocalStrategy = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { UsuarioModelo } = require('../modelos/usuario.model');
const { CarritoModelo } = require('../modelos/carrito.model');
const { crearHash, compararHash } = require('../utils/seguridad');
const { jwtSecreto } = require('./entorno');

// Se inicializa el conjunto de estrategias de autenticacion y autorizacion.
const inicializarPassport = () => {
  // Se define la estrategia de registro y se crea el usuario con carrito.
  passport.use(
    'registro',
    new LocalStrategy(
      { usernameField: 'email', passReqToCallback: true },
      async (solicitud, correo, contrasena, done) => {
        try {
          const {
            first_name: nombre,
            last_name: apellido,
            age: edad,
            role: rol
          } = solicitud.body;

          if (!nombre || !apellido || !edad || !correo || !contrasena) {
            return done(null, false, { message: 'Faltan campos obligatorios' });
          }

          const usuarioExistente = await UsuarioModelo.findOne({ email: correo });
          if (usuarioExistente) {
            return done(null, false, { message: 'El usuario ya existe' });
          }

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

          return done(null, usuarioCreado);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Se valida el usuario y la contrasena para login.
  passport.use(
    'login',
    new LocalStrategy({ usernameField: 'email' }, async (correo, contrasena, done) => {
      try {
        const usuario = await UsuarioModelo.findOne({ email: correo });
        if (!usuario) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        const esValido = compararHash(contrasena, usuario.password);
        if (!esValido) {
          return done(null, false, { message: 'Credenciales invalidas' });
        }

        return done(null, usuario);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Se configura la extraccion del token y la clave secreta.
  const opcionesJwt = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecreto
  };

  // Se valida el token JWT y se carga el usuario actual.
  passport.use(
    'current',
    new JwtStrategy(opcionesJwt, async (cargaToken, done) => {
      try {
        const usuario = await UsuarioModelo.findById(cargaToken.id)
          .select('-password -__v')
          .lean();
        if (!usuario) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        return done(null, usuario);
      } catch (error) {
        return done(error);
      }
    })
  );
};

module.exports = { inicializarPassport };

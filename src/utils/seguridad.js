const bcrypt = require('bcrypt');

// Se genera el hash de la contrasena con un salt seguro.
const crearHash = (contrasena) => bcrypt.hashSync(contrasena, bcrypt.genSaltSync(10));

// Se compara la contrasena con el hash almacenado.
const compararHash = (contrasena, hashContrasena) => bcrypt.compareSync(contrasena, hashContrasena);

module.exports = { crearHash, compararHash };

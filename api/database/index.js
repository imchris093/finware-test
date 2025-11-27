const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('./config/config.js');
const usuario = require('./models/usuario.js');
const oportunidad = require('./models/oportunidad.js');
const transaccion = require('./models/transaccion.js');
const estado = require('./models/estado.js');
const environment = process.env.NODE_ENV || 'development';
const config = dbConfig[environment];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const usuarioModel = usuario(sequelize, DataTypes);
const oportunidadModel = oportunidad(sequelize, DataTypes);
const transaccionModel = transaccion(sequelize, DataTypes);
const estadoModel = estado(sequelize, DataTypes);


const models = {
    Usuario: usuarioModel,
    Oportunidad: oportunidadModel,
    Transaccion: transaccionModel,
    Estado: estadoModel
  };
  
  Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

module.exports = {
    sequelize,
    usuarioModel,
    oportunidadModel,
    transaccionModel,
    estadoModel
};
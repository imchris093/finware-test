'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.belongsToMany(models.Oportunidad, {
        through: 'usuarios_oportunidades',
        foreignKey: 'usuario_id',
        otherKey: 'oportunidad_id',
        as: 'oportunidades'
      });
      
      Usuario.hasMany(models.Transaccion, {
        foreignKey: 'usuario_id',
        as: 'transacciones'
      });
    }
  }
  Usuario.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    fecha_nacimiento: {
      type: DataTypes.DATE,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    saldo: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: true
  });
  
  return Usuario;
};
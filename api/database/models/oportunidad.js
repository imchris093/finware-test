'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Oportunidad extends Model {
    static associate(models) {
      Oportunidad.belongsToMany(models.Usuario, {
        through: 'usuarios_oportunidades',
        foreignKey: 'oportunidad_id',
        otherKey: 'usuario_id',
        as: 'usuarios'
      });
      
      Oportunidad.hasMany(models.Transaccion, {
        foreignKey: 'oportunidad_id',
        as: 'transacciones'
      });
    }
  }
  
  Oportunidad.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    monto_total: {
      type: DataTypes.DECIMAL(8,2),
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Oportunidad',
    tableName: 'oportunidades',
    timestamps: true
  });
  
  return Oportunidad;
};
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaccion extends Model {
    static associate(models) {
      Transaccion.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });

      Transaccion.belongsTo(models.Oportunidad, {
        foreignKey: 'oportunidad_id',
        as: 'oportunidad'
      });
    }
  }

  Transaccion.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    usuario_id: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'usuarios',
        key: 'id',
      }
    },
    oportunidad_id: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'oportunidades',
        key: 'id',
      }
    },
    monto: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    tipo: {
      allowNull: false,
      type: DataTypes.ENUM('correcta', 'fallida'),
      defaultValue: 'correcta'
    },
    fecha_movimiento: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Transaccion',
    tableName: 'transacciones',
    timestamps: true
  });
  
  return Transaccion;
};
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Estado extends Model {
    static associate(models) {
      Estado.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });

      Estado.belongsTo(models.Oportunidad, {
        foreignKey: 'oportunidad_id',
        as: 'oportunidad'
      });
    }
  }

  Estado.init({
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
    monto_invertido: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Estado',
    tableName: 'estados',
    timestamps: true
  });
  
  return Estado;
};
'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    
    await queryInterface.createTable('usuarios', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      apellido: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      telefono: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      fecha_nacimiento: {
        type: Sequelize.DATE,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      saldo: {
        type: Sequelize.DECIMAL(8,2)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    
    await queryInterface.createTable('oportunidades', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      monto_total: {
        type: Sequelize.DECIMAL(8,2),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable('transacciones', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      usuario_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      oportunidad_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'oportunidades',
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      monto: {
        type: Sequelize.DECIMAL(8,2),
        allowNull: false
      },
      tipo: {
        allowNull: false,
        type: Sequelize.ENUM('correcta', 'fallida')
      },
      fecha_movimiento: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable('estados', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      usuario_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      oportunidad_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'oportunidades',
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      monto_invertido: {
        type: Sequelize.DECIMAL(8,2),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('estados');
    await queryInterface.dropTable('transacciones');
    await queryInterface.dropTable('oportunidades');
    await queryInterface.dropTable('usuarios');
  }
};
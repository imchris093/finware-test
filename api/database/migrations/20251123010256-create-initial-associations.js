'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    
    await queryInterface.createTable('usuarios_oportunidades', {
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('usuarios_oportunidades', {
      fields: ['usuario_id', 'oportunidad_id'],
      type: 'primary key',
      name: 'pk_usuarios_oportunidades'
    });
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeConstraint('usuarios_oportunidades', 'pk_usuarios_oportunidades');
    } catch (error) {
      console.log('Constraint no encontrado o ya eliminado:', error.message);
    }
    await queryInterface.dropTable('usuarios_oportunidades');
  }
};
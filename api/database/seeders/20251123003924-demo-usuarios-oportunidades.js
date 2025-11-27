'use strict';
const { randomUUID } = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // Insertar oportunidades

    await queryInterface.bulkInsert('oportunidades', [
      {
        id: randomUUID(),
        nombre: 'Inversión Tech',
        descripcion: 'Startup tecnológica',
        monto_total: 100000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        nombre: 'Fondo Verde',
        descripcion: 'Energía renovable',
        monto_total: 150000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        nombre: 'Infraestructura Urbana',
        descripcion: 'Proyecto de mejora vial en Latinoamérica',
        monto_total: 220000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        nombre: 'Agrotech Sustentable',
        descripcion: 'Tecnología para optimizar cultivos',
        monto_total: 120000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        nombre: 'Biotech Salud',
        descripcion: 'Investigación de terapias genéticas',
        monto_total: 180000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        nombre: 'Energía Marina',
        descripcion: 'Plataforma de turbinas mareomotrices',
        monto_total: 260000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        nombre: 'Logística Inteligente',
        descripcion: 'Red de bodegas automatizadas',
        monto_total: 140000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        nombre: 'Turismo Digital',
        descripcion: 'Marketplace de experiencias inmersivas',
        monto_total: 90000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        nombre: 'Finanzas Inclusivas',
        descripcion: 'Microcréditos para pymes rurales',
        monto_total: 80000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        nombre: 'Smart Mobility',
        descripcion: 'Red de vehículos eléctricos compartidos',
        monto_total: 200000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        nombre: 'DataShield',
        descripcion: 'Ciberseguridad para pymes',
        monto_total: 110000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        nombre: 'MedTech Portable',
        descripcion: 'Dispositivo portátil de diagnóstico',
        monto_total: 135000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        nombre: 'Cadenas Frías',
        descripcion: 'Almacenamiento para vacunas',
        monto_total: 165000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        nombre: 'Construcción Modular',
        descripcion: 'Vivienda de bajo costo',
        monto_total: 195000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        nombre: 'IA Educativa',
        descripcion: 'Plataforma de tutorías personalizadas',
        monto_total: 130000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        nombre: 'Circular Plastics',
        descripcion: 'Reciclaje de plásticos industriales',
        monto_total: 170000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        nombre: 'Energia Doméstica',
        descripcion: 'Paneles solares para hogares',
        monto_total: 145000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('oportunidades', null, {});
  }
};


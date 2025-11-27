const { oportunidadModel } = require('../../database/index.js');
const generarAnalisisDeMercado = require('../services/ollama.js');

const getOpportunities = async (req, res) => {
  try {
    const oportunidades = await oportunidadModel.findAll({
      attributes: ['id', 'nombre', 'monto_total', 'descripcion', 'createdAt'],
      order: [['createdAt', 'ASC']],
    });
    res.status(200).json(oportunidades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las oportunidades.' });
  }
};

const opportunities = async (req, res) => {
  const { nombre, monto_total } = req.body;
  const monto = parseFloat(monto_total);

  if (monto < 40000 || monto > 600000) {
      return res.status(400).json({ message: 'El monto total debe estar entre $40,000.00 y $600,000.00 MXN.' });
  }

  try {
    const nuevaOportunidad = await oportunidadModel.create({
        nombre,
        monto_total: monto,
        descripcion: "pendiente",
    });

    generarAnalisisDeMercado(nuevaOportunidad.id, nuevaOportunidad.nombre, nuevaOportunidad.monto_total);
    res.status(201).json(nuevaOportunidad);

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear la oportunidad.' });
    }
}

module.exports = {
  getOpportunities,
  opportunities,
};
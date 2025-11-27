  const { 
    sequelize, 
    usuarioModel, 
    oportunidadModel, 
    transaccionModel, 
    estadoModel 
  } = require('../../database/index.js');
  
  const invest = async (req, res) => {
  const usuario_id = req.user.id; 
  const { oportunidad_id, monto_invertido } = req.body;
  const monto = parseFloat(monto_invertido);


 /**
 * No invertir 0 o negativos
 * ;)
 */
  if (monto <= 0 || isNaN(monto)) {
    return res.status(400).json({ message: 'El monto a invertir debe ser un número positivo.' });
  }

  const t = await sequelize.transaction();

  try {
/**
 * Infoemacion de usuario y oportunidad de inversión
 * 
 */
    const usuario = await usuarioModel.findByPk(usuario_id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!usuario) {
      await t.rollback();
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const oportunidad = await oportunidadModel.findByPk(oportunidad_id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!oportunidad) {
      await t.rollback();
      return res.status(404).json({ message: 'Oportunidad no encontrada.' });
    }

/**
 * Reglas de negicio y validaciones
 * 
 */

    if (usuario.saldo < monto) {
      await t.rollback();
      return res.status(400).json({ message: `Saldo insuficiente. Tu saldo actual es de $${usuario.saldo}.` });
    }
   
    if (monto > parseFloat(oportunidad.monto_total)) {
      await t.rollback();
      return res.status(400).json({ 
        message: `La inversión excede el monto máximo de inversión.` 
      });
    }

    const nuevaTransaccion = await transaccionModel.create({
      tipo: 'correcta',
      fecha_movimiento: new Date(),
      usuario_id: usuario.id,
      oportunidad_id: oportunidad.id,
      monto: monto,
    }, { transaction: t });


/**
 * Ejecucion de los cambios.
 * El commit de postgrase y registros en las tablas necesarias
 * 
 */
  
    const estadoActual = await estadoModel.findOne({
      where: {
        usuario_id: usuario_id,
        oportunidad_id: oportunidad_id
      },
      transaction: t, lock: t.LOCK.UPDATE
    });

    let estado;
    if (!estadoActual) {
      estado = await estadoModel.create({
        usuario_id: usuario.id,
        oportunidad_id: oportunidad.id,
        monto_invertido: monto
      }, { transaction: t });
    } else {
      estadoActual.monto_invertido = parseFloat(estadoActual.monto_invertido) + monto;
      await estadoActual.save({ transaction: t });
      estado = estadoActual;
    }

    usuario.saldo -= monto;
    await usuario.save({ transaction: t });

    await usuario.addOportunidades(oportunidad, { transaction: t });

    await t.commit();
    
    res.status(201).json({ 
      message: 'Inversión realizada con éxito.', 
      transaccion: nuevaTransaccion,
      estadoOportunidad: estado,
      nuevo_saldo: usuario.saldo
    });

  } catch (error) {

/**
 * Si falla, aqui el rollback
 * 
*/
    await t.rollback();
    console.error('Error durante la transacción de inversión:', error);
    res.status(500).json({ message: 'Error interno del servidor al procesar la inversión.' });
  }
};


const investments = async (req, res) => {
  const usuario_id = req.user.id;
  try {
    const inversiones = await estadoModel.findAll({
      where: { usuario_id },
      include: [
        {
          model: oportunidadModel,
          as: 'oportunidad',
          attributes: ['id', 'nombre', 'monto_total', 'descripcion'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json(inversiones);
  } catch (error) {
    console.error('Error al obtener inversiones:', error);
    return res.status(500).json({ message: 'Error al obtener tus inversiones.' });
  }
};

const transactions = async (req, res) => {
  const usuario_id = req.user.id;
  try {
    const transacciones = await transaccionModel.findAll({
      where: { usuario_id },
      include: [
        {
          model: oportunidadModel,
          as: 'oportunidad',
          attributes: ['id', 'nombre', 'monto_total', 'descripcion'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json(transacciones);
  } catch (error) {
    console.error('Error al obtener inversiones:', error);
    return res.status(500).json({ message: 'Error al obtener tus inversiones.' });
  }
};

module.exports = {
  invest,
  investments,
  transactions
}
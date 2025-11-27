const express = require('express');
const router = express.Router();
const { getOpportunities, opportunities } = require('../controllers/oportunidadController.js');
const auth = require('../middlewares/authMiddleware.js');

router.get('/', auth, getOpportunities);

//Este endpoint no esta protegido por auth pensando en que se debe crear una politica de roles
router.post('/', opportunities);

module.exports = router;
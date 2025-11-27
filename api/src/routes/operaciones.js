const express = require('express');
const router = express.Router();
const { invest, investments, transactions} = require('../controllers/operacionController.js');
const auth = require('../middlewares/authMiddleware.js');

router.get('/user/:id/investments', auth, investments);
router.get('/user/:id/transactions', auth, transactions);
router.post('/invest', auth, invest);

module.exports = router;
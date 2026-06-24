const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/category.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

router.get('/', verifyToken, ctrl.getAll);
router.post('/', verifyToken, verifyAdmin, ctrl.create);
router.put('/:id', verifyToken, verifyAdmin, ctrl.update);
router.delete('/:id', verifyToken, verifyAdmin, ctrl.remove);

module.exports = router;
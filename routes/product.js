const express = require('express');

const productController = require('../controllers/product');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post(
  '/uploadProduct',isAuth, productController.uploadProduct
);

router.get(
  '/getProduct',isAuth, productController.getProduct
);

module.exports = router;

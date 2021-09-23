const express = require('express');

const orderController = require('../controllers/order');
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator/check');

const router = express.Router();

router.post(
  '/createOrder',isAuth, [
    body('userId', 'UserId is required.')
    .not().isEmpty(),
    body('orderDate', 'Order date is required.')
    .not().isEmpty(),
    body('productId.*', 'Product is required.')
    .not().isEmpty(),
    body('qty.*', 'Quantity is required.')
    .not().isEmpty()
  ], orderController.createOrder
);

router.put(
    '/updateOrder',isAuth, [
      body('userId', 'UserId is required.')
      .not().isEmpty(),
      body('orderDate', 'Order date is required.')
      .not().isEmpty(),
      body('productId.*', 'Product is required.')
      .not().isEmpty(),
      body('qty.*', 'Quantity is required.')
      .not().isEmpty()
    ], orderController.updateOrder
  );
  router.post(
    '/cancelOrder',isAuth, orderController.cancelOrder
  );

  router.post(
    '/getOrderBasedDate',isAuth, orderController.getOrderBasedDate
  );

  router.get(
    '/getOrderBasedCustomer',isAuth, orderController.getOrderBasedCustomer
  );
  
  router.post(
    '/getOrderProductBasedCustomer', isAuth, orderController.getOrderProductBasedCustomer
  );

module.exports = router;

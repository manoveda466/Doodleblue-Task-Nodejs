const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const { validationResult } = require('express-validator/check');

exports.createOrder = (req, res, next) => {
    const orderDate = req.body.orderDate;
    const userId = req.body.userId;
    const productId = req.body.productId;
    const qty = req.body.qty;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ message: errors.array()});
      }
    const productArray = [];
    for(let i = 0; i < productId.length; ++i)
    {
        const productObject = {
            productId: productId[i],
            qty: qty[i],
        };
        productArray.push(productObject);
    }

    const order = new Order({
        orderDate: new Date(orderDate),
        userId:userId,
        products: productArray
    })
    return order.save()
    .then(result => {
        res.status(201).json({ message: 'Order created succesfully!', orderId: result._id});
    })
    .catch(err => {
        console.log(err);
    });
}

exports.updateOrder = (req, res, next) => {
    const orderId = req.body.orderId;
    const orderDate = req.body.orderDate;
    const userId = req.body.userId;
    const productId = req.body.productId;
    const qty = req.body.qty;
    const errors = validationResult(req);
    console.log(errors.isEmpty());
    if (!errors.isEmpty()) {
        res.status(422).json({ message: errors.array()});
    }

    const productArray = [];
    for(let i = 0; i < productId.length; ++i)
    {
        const productObject = {
            productId: productId[i],
            qty: qty[i],
        };
        productArray.push(productObject);
    }

    Order.findById(orderId)
        .then(orderData => {
            orderData.userId = userId;
            orderData.orderDate = new Date(orderDate);
            orderData.products = productArray;
            return orderData.save()
            .then(result => {
                res.status(200).json({ message: 'Order updated succesfully!', orderId: orderData._id});
            })
        })
        .catch(err => {
            res.status(404).json({ message: 'Order does not exist'});
        });
    
}

exports.cancelOrder = (req, res, next) => {
    const orderId = req.body.orderId;
    console.log(orderId);
    Order.findById(orderId)
        .then(orderData => {
            orderData.status = 0;
            return orderData.save()
            .then(result => {
                res.status(200).json({ message: 'Order canceled succesfully!', orderId: orderData._id});
            })
        })
        .catch(err => {
            res.status(404).json({ message: 'Order does not exist'});
        });
    
}

exports.getOrderBasedDate = (req, res, next) => {
    const orderDate = new Date(req.body.orderDate);
    orderDate.setDate(orderDate.getDate() + 1)

    Order.getProductCount(orderDate)
    .then(result => {
        if(result.length > 0) {
            productArray = [];
            result.forEach(p => 
                productArray.push({'Product' : p.product[0].productName, 'Count' : p.totalOrderQty})
            )
            res.status(200).json(productArray);
        } else {
            res.status(404).json({ message: 'Order does not exist'});
        }
    })
    .catch(err => {
        res.status(404).json({ message: 'Order does not exist'});
    })
}

exports.getOrderBasedCustomer = (req, res, next) => {
    Order.getProductCountBasedCustomer()
    .then(result => {
        console.log(result);
        if(result.length > 0) {
            productArray = [];
            result.forEach(p => 
                productArray.push({'Customer' : p.user[0].name, 'Product purchased' : p.totalProduct})
            )
            res.status(200).json(productArray);
        } else {
            res.status(404).json({ message: 'Product does not exist'});
        }
    })
    .catch(err => {
        res.status(404).json({ message: 'Product does not exist'});
    })
}

exports.getOrderProductBasedCustomer = (req, res, next) => {
    const customerName = req.body.customerName;
    Order.getOrderProductBasedCustomer(customerName)
    .then(result => {
        console.log(result);
        if(result.length > 0) {
            productArray = [];
            result.forEach(p => 
                productArray.push({'Order Id' : p._id._id,'Order Date' : p._id.orderDate, 'Customer' : p.user.name, ' Purcahsed Products' : [p.products.productId]})
            )
            res.status(200).json(productArray);
        } else {
            res.status(404).json({ message: 'Product does not exist'});
        }
    })
    .catch(err => {
        res.status(404).json({ message: 'Product does not exist'});
    })
}
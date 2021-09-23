const mongoose = require('mongoose');
const Product = require('./product');
const User = require('./user');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderDate : {
        type: Date,
        required: true
    },
    products:[{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        qty: {
            type: Number,
            required: true
        }
    }],
    status: {
        type: Number,
        default: 1
    },
},
{ timestamps: true });

orderSchema.statics.getProductCount = function(orderDate='') {
    let match = {
        '$match':{}
    };
    if(orderDate){
        match = {
            $match: {
                $and: [
                    { status: { $ne: 0 } },
                    {orderDate: {$gte: orderDate, $lte: orderDate}}
                ]
            }
        }
    }
    return this.model('Order').aggregate([
        { $unwind: "$products" },
        match,
        { $group: {
            _id: {
                "productId": "$products.productId",
                },
            totalOrderQty: { "$sum": "$products.qty" }
            }
        },
        {
        $lookup:{
            from: "products",
            localField: "_id.productId",
            foreignField: "_id",
            as: 'product'
            }
        }
    ])
}

orderSchema.statics.getProductCountBasedCustomer = function() {
    let match = {
        '$match':{}
    };
    
    match = {
        $match:{ status: { $ne: 0 } }
        }
    
    
    return this.model('Order').aggregate([
        match,
        { $group: {
            _id: {
                "userId": "$userId",
                },
           
            totalProduct: { $sum: 1 },
            }
        },
        
        {
        $lookup:{
            from: "users",
            localField: "_id.userId",
            foreignField: "_id",
            as: 'user'
            }
        }
    ])
}

orderSchema.statics.getProductCountBasedCustomer = function() {
    let match = {
        '$match':{}
    };
    
    match = {
        $match:{ status: { $ne: 0 } }
        }
    
    
    return this.model('Order').aggregate([
        match,
        { $group: {
            _id: {
                "userId": "$userId",
                },
           
            totalProduct: { $sum: 1 },
            }
        },
        
        {
        $lookup:{
            from: "users",
            localField: "_id.userId",
            foreignField: "_id",
            as: 'user'
            }
        }
    ])
}

orderSchema.statics.getOrderProductBasedCustomer = function(customerName) {
    let match = {
        '$match':{}
    };
    
    if(customerName) {
        match = {
            $match: {
                $and: [
                    { status: { $ne: 0 } },
                    { 'user.name': {'$regex': customerName} }
                ]
            }
                
            }
    } else {
        match = {
            $match: {
                $and: [
                    { status: { $ne: 0 } }
                ]
            }
                
            }
    }
    
    return this.model('Order').aggregate([
       
        { $group: {
            _id: {
                "userId": "$userId",
                "_id": "$_id",
                "orderDate": "$orderDate"
                },
           
            TotalOrders: { $sum: 1 },
            "products": { "$first": "$products" },
            }
        },
        
        {
        $lookup:{
            from: "users",
            localField: "_id.userId",
            foreignField: "_id",
            as: 'user'
            }
        },
        
        
        { "$unwind": { "path" : "$user" } },
        {
            $lookup: {
                from: 'products',
                localField: 'products.productId',
                foreignField: '_id',
                as: 'products.productId'
            }
        },
        { "$unwind": { "path" : "$products" } },
        { $sort: { orderDate: 1 } },
        match
    ])
}

module.exports = mongoose.model('Order', orderSchema);




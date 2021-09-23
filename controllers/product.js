const fs = require('fs');
const csvParser = require('csv-parser');
const path = require('path');
const Product = require('../models/product');

exports.uploadProduct = (req, res, next) => {
    fs.createReadStream(req.files.product[0].path)
    .pipe(csvParser())
    .on('data', (row) => {
        Product.find({productCode: row.CODE}).then(productExist => {
                if(productExist.length > 0){
                    productExist[0].productName = row.PRODUCT;
                    productExist[0].cost = row.COST;
                    productExist[0].description = row.DESCRIPTION;                    
                    productExist[0].save();

                }else{
                    const product = new Product({
                        productCode: row.CODE,
                        productName: row.PRODUCT,
                        cost: row.COST,
                        description: row.DESCRIPTION,
                    });
                    product.save();
                }
            })
            .catch(err => {
              res.status(500).json({ message: 'Not uploaded!'});
            });
    })
    .on('end', () => {
        res.status(201).json({ message: 'Product added succesfully!'});
    });
  };

exports.getProduct = (req, res, next) => {
   Product.find().sort({updatedAt: 'desc'}).then(productList => {
    res.status(200).json({ productList: productList});
  })
  .catch(err => {
      console.log(err);
  });
}


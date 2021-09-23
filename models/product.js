const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    productCode: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);

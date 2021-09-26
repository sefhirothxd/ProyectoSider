const { Schema, model } = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');

const statusOrder = {
  values: ['PENDING', 'DELIVERED', 'CANCELED', 'DELIVERING'],
  message: '`{VALUE}` is not a valid status. Insert: PENDING, DELIVERED, CANCELED, DELIVERING',
};
// definir el modelo de la base de datos
const orderSchema = new Schema({

  __v: { type: Number, select: false },
  userId: {
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  products: [{
    qty: {
      type: Number,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  }],
  status: {
    type: String,
    required: true,
    default: 'pending',
  },
  dateEntry: {
    type: Date,
    default: Date.now,
  },
  dateProcessed: {
    type: Date,
    required: false,
    default: Date.now,
  },
});

orderSchema.plugin(mongoosePaginate);

module.exports = model('Order', orderSchema);

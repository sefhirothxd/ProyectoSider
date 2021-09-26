const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// definir el modelo de la base de datos
const productSchema = new Schema({
  __v: { type: Number, select: false },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  type: {
    type: String,
  },
  dateEntry: {
    type: Date,
    default: Date.now,
  },

});

productSchema.plugin(mongoosePaginate);

module.exports = model('Product', productSchema);

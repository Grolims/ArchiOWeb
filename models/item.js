const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define a schema
const itemSchema= new Schema({
  type: String,
  description: String,
  price: Number,
  creationDate: {
    type: Date,
    default: Date.now
  },
  label: String,
  rating: {
    type: Number,
    min: 0,
    max: 10
  },
  lastModified: { type: Date, default: Date.now  },

});

//create model
mongoose.model('Item', itemSchema)
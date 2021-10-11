const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define a schema
const itemSchema= new Schema({
  type: {
    type:String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  picture:String,
  name: {
    type:String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  price: {
    type:Number,
    required: true,
    min:0
  },
   description: String,
  creationDate: {
    type: Date,
    default: Date.now
  },
  label:{
      type:String,
      enum:['Bio','Vegan']
  },
  lastModified: { type: Date, default: Date.now  },
  userid: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    required: false,
 /*validate: {
      // Validate that the directorId is a valid ObjectId
      // and references an existing person
      validator: validateDirector,
      message: props => props.reason.message
    }*/
  }

});

// Export model
module.exports = mongoose.model('Item', itemSchema);
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
  rating: {
    type: Number,
    min: 0,
    max: 10
  },
  lastModified: { type: Date, default: Date.now  },
  userid: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    required: true,
 /*validate: {
      // Validate that the directorId is a valid ObjectId
      // and references an existing person
      validator: validateDirector,
      message: props => props.reason.message
    }*/
  }

});

//create model
mongoose.model('Item', itemSchema)
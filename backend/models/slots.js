const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const slotsSchema = new Schema({
  slotTime: { 
    type: String, 
    require: true 
  },
  slotDate: {
    type: String, 
    require: true 
  }, 
}, { versionKey: false })

module.exports = mongoose.model('Slot', slotsSchema);

// module.exports = slotsModel;
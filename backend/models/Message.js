const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {//track message content,do not allow to be empty
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  user: {//track the user who posted the message
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true  //Adds createdAt and updatedAt
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

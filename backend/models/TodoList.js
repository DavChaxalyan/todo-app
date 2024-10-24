const mongoose = require('mongoose');

const TodoListSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
        text: { type: String, required: true }, 
        createdAt: { type: Date, default: Date.now } 
      }
    ]
  }, { timestamps: true });  
  

module.exports = mongoose.model('TodoList', TodoListSchema);

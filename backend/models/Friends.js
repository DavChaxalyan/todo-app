const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendsSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  friends: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }]
});

const Friends = mongoose.model('Friends', FriendsSchema);

module.exports = Friends;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
   
  password: String,
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  state: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started',
  },
  deadline: Date,
   createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedTo: [{
    user :{type: mongoose.Schema.Types.ObjectId,
    ref: 'User'},
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started',
    },
  }],

});

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

module.exports = { User, Task };

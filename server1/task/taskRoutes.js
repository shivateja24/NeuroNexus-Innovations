const express = require('express');
const JWT_SECRET = require('../config/keys.js')
const authorizationToken = require('../middleware/middleware.js');
 const { User, Task } = require('../models/models');

const router = express.Router();

// Create task route
router.post('/create' ,authorizationToken,  async (req, res) => {
  try {
    console.log(req)
    const { title, description ,state, deadline, assignedto } = req.body;
    const newTask = new Task({ title, description, state, deadline, createdBy: req.user._id, assignedTo: assignedto});
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all tasks route 
router.get('/alltasks', authorizationToken, async (req, res) => {
  try {
    const userId = req.user._id; // Replace with the actual user ID you are querying for
     // Find tasks created by the requested user or assigned to the requested user
    const tasks = await Task.find({
      $or: [
        { createdBy: userId }, // Tasks created by the user
        { 'assignedTo.user': userId }, // Tasks where the user is assigned
      ],
    });

     return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Update task state route
router.put('/update/:taskId',authorizationToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;
    console.log("updating the task with status", status)
    // Find the task by ID and createdBy (user who created it)
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, createdBy: userId },
      { state : status },
      { new: true }
    );

    // If the task was not found, try to update the state within the assignedTo array
    if (!updatedTask) {
      const taskInAssignedTo = await Task.findOneAndUpdate(
        { _id: taskId, 'assignedTo.user': userId },
        { 'assignedTo.$.status': status },
        { new: true }
      );

      // Check if the task was not found in assignedTo array as well
      if (!taskInAssignedTo) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Task was found in assignedTo array and updated successfully
      res.status(200).json(taskInAssignedTo);
    } else {
      // Task was found and updated successfully (createdBy and req.user._id matched)
      res.status(200).json(updatedTask);
    }
  } catch (error) {
    console.error('Error updating task state:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Delete task route
router.delete('/delete/:taskId' ,authorizationToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    await Task.findOneAndDelete({ _id: taskId, createdBy: req.user._id });
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


 

router.post('/searchusername', authorizationToken, async (req, res) => {
  try {
    const { searchQuery } = req.body;
    const regex = new RegExp(searchQuery, 'i');

    console.log('inside searchusername');

    // Use Mongoose's find method with a regular expression to search for users
    const filteredUsers = await User.find({
      username: { $regex: regex },
      _id: { $ne: req.user._id }, // Exclude the currently logged-in user
    });

    console.log(filteredUsers);
    return res.json(filteredUsers);
  } catch (error) {
    console.error('Error during user search:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

 




module.exports = router;

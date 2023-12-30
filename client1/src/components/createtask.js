import React, { useState } from 'react';
import SearchFilter from './searchfilter'; // Update the import statement
import './css/CreateTask.css'; // Import the CSS file for styling

const CreateTask = ({ handleCreateTask }) => {
  const currentUserId = localStorage.getItem('username'); // Get current user ID from local storage

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    state: 'Not Started',
    createdby: currentUserId, // Use current user ID as the created by
    deadline: '',
    assignedto: [] // Initially an empty array
  });

  // State to store selected users
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const convertToMongoDBDate = (dateTimeLocal) => {
    // Convert date from local format to ISO format
    const localDate = new Date(dateTimeLocal);
    const isoDate = localDate.toISOString();
    return isoDate;
  };

  // Update the selected users state
  const handleUserSelection = (selectedUsers) => {
    setSelectedUsers(selectedUsers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert deadline to MongoDB date format
    const mongoDBDeadline = convertToMongoDBDate(newTask.deadline);
    const updatedAssignedTo = selectedUsers.map((userId) => ({
      user: userId,
      status: 'Not Started'
    }));

    try {
      const response = await fetch('http://localhost:3001/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          state: newTask.state,
          createdby: newTask.createdby, // Use the current user ID
          deadline: mongoDBDeadline,
          assignedto: updatedAssignedTo
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Notify success or update state as needed
        console.log('Task created successfully:', data);
        handleCreateTask();

        // Invoke the callback to refresh the tasks in the dashboard
      } else {
        // Notify failure or handle errors
        console.error('Error creating task:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error during task creation:', error);
    }
  };

  return (
    <div className="create-task-container">
      <h3>Create New Task</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={newTask.title}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={newTask.description}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="deadline">Deadline:</label>
        <input
          type="datetime-local"
          id="deadline"
          name="deadline"
          value={newTask.deadline}
          onChange={handleInputChange}
          required
        />
        <div>Assign to:</div>
        {/* Include the SearchFilter component for selecting users */}
        <SearchFilter
          username="currentUsername" // Replace with the actual current username
          user_id="currentUserId" // Replace with the actual current user ID
          onSelect={handleUserSelection} // Callback to handle user selection
        />

        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default CreateTask;

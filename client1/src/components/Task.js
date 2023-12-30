import React, { useState } from 'react';
import TaskDetails from './Taskdetails';

const Task = ({ task, onUpdateStatus, onDelete }) => {
  const [updatedStatus, setUpdatedStatus] = useState(task.state);
  const currentUserId = localStorage.getItem('userId');

  const handleStatusChange = (newStatus) => {
    setUpdatedStatus(newStatus);
  };

  const handleUpdateStatus = () => {
    // Perform the status update
    onUpdateStatus(task._id, updatedStatus);
  };

  // Determine the status to display based on conditions
  let displayStatus;
  if (task.createdBy === currentUserId) {
    // If the current user created the task, show the task's own status
    displayStatus = task.state;
  } else {
    // If the current user did not create the task, search the status in assignedTo array
    const assignment = task.assignedTo.find(assignment => assignment.user === currentUserId);
    displayStatus = assignment ? assignment.status : 'Not Assigned';
  }

  // Calculate time difference in milliseconds between the deadline and current time
  const timeDifference = new Date(task.deadline) - new Date();

  // Determine the background color based on conditions
  let backgroundColor;
  if (timeDifference < 0) {
    // Deadline has passed
    backgroundColor = 'red';
  } else if (displayStatus === 'Completed') {
    // Task is completed
    backgroundColor = 'green';
  } else {
    // Any other status
    backgroundColor = 'blue';
  }

  const [showDetails, setShowDetails] = useState(false);

  const handleShowDetails = () => {
    // Toggle the showDetails state between true and false
    setShowDetails((prevShowDetails) => !prevShowDetails);
  };

  return (
    <li key={task._id} className="task-item" style={{ backgroundColor }}>
      <div className="task-header">
        <strong>{task.title}</strong>
        <div>
          {/* Display current status */}
          <p>Current Status: {displayStatus}</p>

          {/* Show details button for tasks created by the current user and have assignedTo array */}
          {task.createdBy === currentUserId && task.assignedTo.length > 0 && (
            <button className="show-details-button" onClick={handleShowDetails}>
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          )}

          {/* Dropdown for selecting the new status */}
          <select value={updatedStatus} onChange={(e) => handleStatusChange(e.target.value)}>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button className="update-button" onClick={handleUpdateStatus}>
            Update Status
          </button>
          {task.createdBy === currentUserId && (
            <button className="delete-button" onClick={() => onDelete(task._id)}>
              Delete
            </button>
          )}
        </div>
      </div>
      <p>{task.description}</p>
      <p>Deadline: {new Date(task.deadline).toLocaleString()}</p>

      {/* Render TaskDetails if showDetails is true */}
      {showDetails && <TaskDetails task={task} />}
    </li>
  );
};

export default Task;

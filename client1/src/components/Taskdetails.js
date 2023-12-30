import React from 'react';

const TaskDetails = ({ task }) => {
  return (
    <div className="task-details">
       
      <p>Deadline: {new Date(task.deadline).toLocaleString()}</p>
      <h4>Assigned Users:</h4>
      <ul>
        {task.assignedTo.map((assignment) => (
          <li key={assignment._id} style={{ color: assignment.state === 'Completed' ? 'green' : 'orange' }}>
            User: {assignment.user}
            <br />
            Status: {assignment.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskDetails;

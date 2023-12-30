import React, { useState, useEffect } from 'react';
import './css/Dashboard.css';
import Task from './Task';
import CreateTask from './createtask'; // Corrected import statement
import LogoutButton from './Logout';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const username = localStorage.getItem('username');
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3001/tasks/alltasks', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      const data = await response.json();

      if (response.ok) {
        const sortedTasks = data.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        setTasks(sortedTasks);

        const pendingCount = sortedTasks.filter(task => task.state === 'Not Started').length;
        const completedCount = sortedTasks.filter(task => task.state === 'Completed').length;

        setPendingTasksCount(pendingCount);
        setCompletedTasksCount(completedCount);
      } else {
        console.error('Error fetching tasks:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error during task fetch:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/update/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Status updated successfully:', data);
        await fetchTasks(); // Ensure that fetchTasks is awaited
      } else {
        console.error('Error updating status:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error during status update:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/delete/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Task deleted successfully:', data);
      } else {
        console.error('Error deleting task:', data.message || 'Unknown error');
      }

       fetchTasks(); // Ensure that fetchTasks is awaited

    } catch (error) {
      console.error('Error during task deletion:', error);
    }
  };

  const handleCreateTask = () => {
    fetchTasks();
  };

  return (
    <div className="dashboard-container">
      <div className="top-right">
        <LogoutButton />
      </div>
      <h1>Welcome {username}</h1>
      <h2>Dashboard</h2>

      <div className="task-counts">
        <h3>Task Counts</h3>
        <p>Pending Tasks: {pendingTasksCount}</p>
        <p>Completed Tasks: {completedTasksCount}</p>
      </div>

      <CreateTask handleCreateTask={handleCreateTask} />

      <div className="all-tasks">
        <h3>All Tasks</h3>
        <ul>
          {tasks.map(task => (
            <Task
              key={task._id}
              task={task}
              onUpdateStatus={updateStatus}
              onDelete={handleDeleteTask}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

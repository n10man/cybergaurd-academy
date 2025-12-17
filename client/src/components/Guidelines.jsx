import React, { useState, useEffect } from 'react';
import './Guidelines.css';

function Guidelines() {
  const [tasks, setTasks] = useState([
    { id: 'hr', name: 'Talk to HR Manager', completed: false },
    { id: 'senior_dev', name: 'Talk to Senior Dev', completed: false },
    { id: 'sticky', name: 'Get Login Credentials', completed: false },
    { id: 'whiteboard', name: 'Check Whiteboard', completed: false },
    { id: 'computer', name: 'Access Main Computer', completed: false },
    { id: 'emails', name: 'Complete Email Training', completed: false }
  ]);

  useEffect(() => {
    // Check initial status from localStorage
    updateTasks();

    // Listen for guideline update events
    const handleUpdate = () => {
      updateTasks();
    };

    window.addEventListener('updateGuidelines', handleUpdate);
    return () => window.removeEventListener('updateGuidelines', handleUpdate);
  }, []);

  const updateTasks = () => {
    setTasks(prevTasks => prevTasks.map(task => {
      let completed = false;

      switch (task.id) {
        case 'hr':
          completed = localStorage.getItem('hrInteracted') === 'true';
          break;
        case 'senior_dev':
          completed = localStorage.getItem('seniorDevInteracted') === 'true';
          break;
        case 'sticky':
          completed = localStorage.getItem('stickyNoteViewed') === 'true';
          break;
        case 'whiteboard':
          completed = localStorage.getItem('whiteboardInteracted') === 'true';
          break;
        case 'computer':
          completed = localStorage.getItem('computerAccessed') === 'true';
          break;
        case 'emails':
          // Check if emails completed (0 remaining)
          const emailState = JSON.parse(localStorage.getItem('emailState') || '{}');
          completed = emailState.inboxCount === 0;
          break;
        default:
          break;
      }

      return { ...task, completed };
    }));
  };

  const getProgressPercentage = () => {
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  return (
    <div className="guidelines-container">
      <div className="guidelines-header">
        <h3>📋 MISSION OBJECTIVES</h3>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <span className="progress-text">{getProgressPercentage()}%</span>
        </div>
      </div>

      <div className="tasks-list">
        {tasks.map((task, index) => (
          <div 
            key={task.id} 
            className={`task-item ${task.completed ? 'completed' : 'pending'}`}
          >
            <div className="task-checkbox">
              {task.completed ? (
                <span className="checkbox-checked">✓</span>
              ) : (
                <span className="checkbox-empty"></span>
              )}
            </div>
            <span className="task-name">{task.name}</span>
          </div>
        ))}
      </div>

      <div className="guidelines-footer">
        <p className="instructions">Complete all objectives to finish the mission</p>
      </div>
    </div>
  );
}

export default Guidelines;

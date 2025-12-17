import React, { useState, useEffect } from 'react';
import './Guidelines.css';

function Guidelines() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 'hr', name: 'Greet HR Manager', hint: 'Learn about your role and responsibilities', completed: false },
    { id: 'senior_dev', name: 'Meet Senior Dev', hint: 'Get login credentials from David', completed: false },
    { id: 'sticky', name: 'View Sticky Note', hint: 'Collect email and password for access', completed: false },
    { id: 'whiteboard', name: 'Check Whiteboard', hint: 'Review progress and guidelines', completed: false },
    { id: 'computer', name: 'Access Computer', hint: 'Log in and start email training', completed: false },
    { id: 'emails', name: 'Complete Training', hint: 'Filter all phishing emails', completed: false }
  ]);

  const fullGuidelines = `
Welcome to CyberGuard Academy!

Your Mission:
Learn to identify and filter phishing emails to protect company security.

Step-by-Step Guide:
1. Talk to HR Manager - She'll brief you on the mission
2. Visit Senior Dev - Get login credentials from David
3. Check Sticky Note - The credentials are there
4. Review Whiteboard - See your progress
5. Access Main Computer - Use credentials to log in
6. Complete Email Training - Filter phishing emails to finish

Tips:
- Look for suspicious sender addresses
- Check for unusual links or requests
- Watch for urgent language
- Verify before clicking
- When stuck, reference the Phishing Manual on the shelf

Good luck! The security of our company depends on you!
  `;

  useEffect(() => {
    updateTasks();

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

  const nextIncompleteTask = tasks.find(t => !t.completed);

  if (isExpanded) {
    return (
      <div className="guidelines-notebook expanded">
        <div className="notebook-header">
          <h2>📖 Mission Notebook</h2>
          <button className="close-btn" onClick={() => setIsExpanded(false)}>✕</button>
        </div>
        
        <div className="notebook-content">
          <pre className="guidelines-text">{fullGuidelines}</pre>
          
          <div className="progress-section">
            <h3>Progress: {getProgressPercentage()}%</h3>
            <div className="progress-bar-expanded">
              <div 
                className="progress-fill" 
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          <div className="tasks-section">
            <h3>Checklist:</h3>
            {tasks.map((task) => (
              <div key={task.id} className={`task-item-expanded ${task.completed ? 'completed' : 'pending'}`}>
                <span className="checkbox">{task.completed ? '☑' : '☐'}</span>
                <span className="task-text">{task.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="notebook-footer">
          <p>Click the tab to return to mission overview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="guidelines-sticky-note">
      <div className="sticky-header">
        <h3>Objectives</h3>
        <button className="expand-btn" onClick={() => setIsExpanded(true)}>📖 Read More</button>
      </div>

      <div className="sticky-progress">
        <div className="progress-bar-small">
          <div 
            className="progress-fill" 
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <span className="progress-label">{getProgressPercentage()}%</span>
      </div>

      <div className="sticky-task">
        {nextIncompleteTask ? (
          <>
            <p className="current-step">Next Step:</p>
            <p className="task-main">{nextIncompleteTask.name}</p>
            <p className="task-hint">{nextIncompleteTask.hint}</p>
          </>
        ) : (
          <>
            <p className="current-step">Excellent Work!</p>
            <p className="task-main">Mission Complete!</p>
            <p className="task-hint">You've successfully completed the training!</p>
          </>
        )}
      </div>

      <div className="sticky-checklist">
        {tasks.map((task) => (
          <div key={task.id} className={`mini-check ${task.completed ? 'done' : ''}`}>
            {task.completed ? '✓' : '•'}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Guidelines;

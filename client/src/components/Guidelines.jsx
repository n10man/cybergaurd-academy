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
1. Talk to the HR Manager - She'll brief you on the objectives of your job
2. Visit Senior Dev - You then proceed to get the login credentials from David
3. Check Sticky Note - The credentials are on the sticky note on the desk on the top right side of the office
4. Review Whiteboard - Check the whiteboard to view your progress and how much emails you have left
5. Access Main Computer - Once you have interacted with the sticky note and the whiteboard, you can access the computer with the login credentials from the sticky note
6. Complete Email Training - Filter phishing emails in the email client until your inbox is clear to finish your work

Tips:
- Look for suspicious sender addresses
- Check for unusual links or requests
- Watch for urgent language
- Verify before clicking
- When stuck, reference the Phishing Manual on the shelf

Good luck! The security of our company depends on you!
  `;

  useEffect(() => {
    // ✅ Reset progress on FIRST page load (new user or new session)
    // Only reset if user is truly new to the game
    if (!localStorage.getItem('gameStarted')) {
      localStorage.setItem('gameStarted', 'true');
      // Clear all progress tracking (but NOT emailState - that's managed by Dashboard)
      localStorage.removeItem('hrInteracted');
      localStorage.removeItem('seniorDevInteracted');
      localStorage.removeItem('stickyNoteViewed');
      localStorage.removeItem('whiteboardInteracted');
      localStorage.removeItem('computerAccessed');
      localStorage.removeItem('metSeniorDev');
      localStorage.removeItem('seniorDevProgress');
      console.log('🎮 Fresh game session started - progress reset to 0%');
      console.log('📍 Cleared flags:', {
        gameStarted: false,
        hrInteracted: false,
        seniorDevInteracted: false,
        stickyNoteViewed: false,
        whiteboardInteracted: false,
        computerAccessed: false
      });
    }
    
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
          // Only mark as complete if:
          // 1. User has accessed the computer (logged in)
          // 2. AND all emails are processed (inboxCount === 0)
          const hasAccessedComputer = localStorage.getItem('computerAccessed') === 'true';
          const emailStateStr = localStorage.getItem('emailState');
          
          if (hasAccessedComputer && emailStateStr) {
            try {
              const emailState = JSON.parse(emailStateStr);
              completed = emailState.inboxCount === 0;
              console.log(`📧 Email task: computerAccessed=${hasAccessedComputer}, inboxCount=${emailState.inboxCount}, completed=${completed}`);
            } catch (e) {
              console.error('❌ Failed to parse emailState:', e);
              completed = false;
            }
          } else {
            console.log(`📧 Email task: computerAccessed=${hasAccessedComputer}, hasEmailState=${!!emailStateStr} - NOT COMPLETE YET`);
            completed = false;
          }
          break;
        default:
          break;
      }

      if (completed) {
        console.log(`✅ Task "${task.id}" marked as COMPLETED`);
      }

      return { ...task, completed };
    }));
  };

  const getProgressPercentage = () => {
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const nextIncompleteTask = tasks.find(t => !t.completed);

  const resetProgress = () => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      localStorage.removeItem('hrInteracted');
      localStorage.removeItem('seniorDevInteracted');
      localStorage.removeItem('stickyNoteViewed');
      localStorage.removeItem('whiteboardInteracted');
      localStorage.removeItem('computerAccessed');
      localStorage.removeItem('metSeniorDev');
      localStorage.removeItem('seniorDevProgress');
      localStorage.removeItem('gameProgress');
      localStorage.removeItem('emailState');
      updateTasks();
      window.dispatchEvent(new CustomEvent('updateGuidelines', {}));
    }
  };

  if (isExpanded) {
    return (
      <div className="guidelines-notebook expanded">
        <div className="notebook-header">
          <h2>Mission Notebook</h2>
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
        </div>

        <div className="notebook-footer">
          <p>Click the tab to return to mission overview</p>
          <button className="reset-progress-btn" onClick={resetProgress}>Reset Progress</button>
        </div>
      </div>
    );
  }

  return (
    <div className="guidelines-sticky-note">
      <div className="sticky-header">
        <h3>Objectives</h3>
        <button className="expand-btn" onClick={() => setIsExpanded(true)}>Read More</button>
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

    </div>
  );
}

export default Guidelines;

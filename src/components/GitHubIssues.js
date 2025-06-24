import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import classes from './GitHubIssues.module.css';

export const GitHubIssues = () => {
  const [issues, setIssues] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showIssues, setShowIssues] = useState(false);

  const backendURL = process.env.REACT_APP_BACKENDURL;

  useEffect(() => {
    const socket = io(backendURL);

    socket.on('connect', () => {
      console.log('Connected to Socket.IO');
    });

    socket.on('github_event', ({ event, payload }) => {
      if (event === 'issues') {
        const issue = payload.issue;
        if (issue) {
          setNotifications(prev => [issue, ...prev]);
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [backendURL]);

  const handleNotificationClick = () => {
    setShowIssues(true);
    setIssues(notifications);
    setNotifications([]);
  };

  return (
    <div>
      <div 
        onClick={handleNotificationClick}
       className={classes.notification}
      >
        <span role="img" aria-label="bell" className={classes.notification_bell} >🔔</span>
        {notifications.length > 0 && (
          <span className={classes.notification_count}>
            {notifications.length}
          </span>
        )}
      </div>

      {showIssues && (
        <>
          <h2>GitHub Issues</h2>
          {issues.length === 0 ? (
            <p>No issues found.</p>
          ) : (
            <ul>
              {issues.map((issue) => (
                <li key={issue.id}>
                  <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
                    #{issue.number} - {issue.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

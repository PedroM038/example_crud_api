/**
 * @file LongTaskPanel.js - panel to manage async tasks
 * 
 * @description allows starting long-running tasks and monitoring their status
 * through API polling.
 */
import React, { useState, useEffect, useRef } from 'react';

import { startLongTask, getTaskStatus } from '../api';

function LongTaskPanel() {
  const [taskId, setTaskId] = useState(null);
  const [taskState, setTaskState] = useState(null);
  const [taskResult, setTaskResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pollingRef = useRef(null);

  
   //starts a new async task.
  const handleStartTask = async () => {
    setError(null);
    setLoading(true);
    setTaskResult(null);

    try {
      const data = await startLongTask();
      setTaskId(data.task_id);
      setTaskState('PENDING');
      startPolling(data.task_id);
    } catch (err) {
      setError('Error starting task. Check if Celery is running.');
      console.error('Error starting task:', err);
    } finally {
      setLoading(false);
    }
  };

  //starts polling to check task status.
  const startPolling = (id) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    pollingRef.current = setInterval(async () => {
      try {
        const status = await getTaskStatus(id);
        setTaskState(status.state);
        
        if (status.state === 'SUCCESS' || status.state === 'FAILURE') {
          setTaskResult(status.result);
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      } catch (err) {
        console.error('Error checking status:', err);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  //returns CSS class based on task state.
  const getStatusClass = () => {
    switch (taskState) {
      case 'PENDING':
        return 'pending';
      case 'STARTED':
        return 'started';
      case 'SUCCESS':
        return 'success';
      case 'FAILURE':
        return 'failure';
      default:
        return '';
    }
  };

  return (
    <div className="long-task-panel">
      <h5>Long Async Task</h5>

      <button
        className="btn btn-warning"
        onClick={handleStartTask}
        disabled={loading || (taskState === 'PENDING' || taskState === 'STARTED')}
      >
        {loading ? 'Starting...' : 'Start Task'}
      </button>

      {error && (
        <div className="text-danger mt-2" style={{ fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {taskState && (
        <div className={`task-status ${getStatusClass()}`}>
          <div>
            <strong>Status:</strong> {taskState}
          </div>
          
          {taskResult !== null && (
            <div className="mt-2">
              <strong>Result:</strong> {JSON.stringify(taskResult)}
            </div>
          )}
        </div>
      )}

      {taskId && (
        <div className="mb-2">
          <strong>Task ID:</strong>
          <div className="task-id">
            <code>{taskId}</code>
          </div>
        </div>
      )}
    </div>
  );
}

export default LongTaskPanel;

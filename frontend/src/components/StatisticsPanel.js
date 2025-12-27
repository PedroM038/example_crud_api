/**
 * StatisticsPanel.js - Statistics calculation panel
 * 
 * Allows calculating mean and standard deviation from numeric values
 * using async processing via Celery.
 */
import React, { useState, useEffect, useRef } from 'react';

import { startStatisticsTask, getTaskStatus } from '../api';

function StatisticsPanel() {
  const [inputValues, setInputValues] = useState('');
  
  const [taskId, setTaskId] = useState(null);
  const [taskState, setTaskState] = useState(null);
  const [taskResult, setTaskResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pollingRef = useRef(null);

  /**
   * Validates and converts input string to number array.
   */
  const parseValues = (input) => {
    if (!input.trim()) return [];
    
    const values = input
      .split(/[,\s\n]+/)
      .map(v => v.trim())
      .filter(v => v !== '')
      .map(v => parseFloat(v));
    
    if (values.some(isNaN)) {
      throw new Error('All values must be valid numbers');
    }
    
    return values;
  };

  /**
   * Starts statistics calculation.
   */
  const handleCalculate = async () => {
    setError(null);
    setTaskResult(null);
    
    try {
      const values = parseValues(inputValues);
      
      if (values.length === 0) {
        setError('Enter at least one numeric value');
        return;
      }
      
      if (values.length < 2) {
        setError('Enter at least 2 values to calculate standard deviation');
        return;
      }
      
      setLoading(true);
      
      const data = await startStatisticsTask(values);
      setTaskId(data.task_id);
      setTaskState('PENDING');
      
      startPolling(data.task_id);
      
    } catch (err) {
      setError(err.message || 'Error processing values');
      setLoading(false);
    }
  };

  /**
   * Starts polling to check task status.
   */
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
          setLoading(false);
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      } catch (err) {
        console.error('Error checking status:', err);
      }
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  /**
   * Clears results and resets the form.
   */
  const handleClear = () => {
    setInputValues('');
    setTaskId(null);
    setTaskState(null);
    setTaskResult(null);
    setError(null);
  };

  /**
   * Returns CSS class based on task state.
   */
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
    <div className="statistics-panel">
      <h5>Statistics Calculation</h5>
      <p className="text-muted small">
        Calculate mean and standard deviation using async processing (Celery)
      </p>

      <div className="mb-3">
        <label className="form-label">
          Numeric values (comma or space separated):
        </label>
        <textarea
          className="form-control"
          rows="3"
          placeholder="E.g.: 10, 20, 30, 40, 50 or 10 20 30 40 50"
          value={inputValues}
          onChange={(e) => setInputValues(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="d-flex gap-2 mb-3">
        <button
          className="btn btn-success"
          onClick={handleCalculate}
          disabled={loading || !inputValues.trim()}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Calculating...
            </>
          ) : (
            'Calculate'
          )}
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={handleClear}
          disabled={loading}
        >
          Clear
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {taskState && (
        <div className={`task-status ${getStatusClass()}`}>
          <div className="d-flex justify-content-between align-items-center">
            <span><strong>Status:</strong> {taskState}</span>
            {taskId && (
              <small className="text-muted">
                Task: {taskId.substring(0, 8)}...
              </small>
            )}
          </div>
        </div>
      )}

      {taskResult && taskState === 'SUCCESS' && (
        <div className="statistics-result mt-3">
          <h6>Results:</h6>
          <div className="row g-2">
            <div className="col-6 col-md-4">
              <div className="stat-card">
                <span className="stat-label">Mean</span>
                <span className="stat-value">{taskResult.mean}</span>
              </div>
            </div>
            <div className="col-6 col-md-4">
              <div className="stat-card">
                <span className="stat-label">Std Deviation</span>
                <span className="stat-value">{taskResult.std_dev}</span>
              </div>
            </div>
            <div className="col-6 col-md-4">
              <div className="stat-card">
                <span className="stat-label">Count</span>
                <span className="stat-value">{taskResult.count}</span>
              </div>
            </div>
            <div className="col-6 col-md-6">
              <div className="stat-card">
                <span className="stat-label">Min</span>
                <span className="stat-value">{taskResult.min}</span>
              </div>
            </div>
            <div className="col-6 col-md-6">
              <div className="stat-card">
                <span className="stat-label">Max</span>
                <span className="stat-value">{taskResult.max}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatisticsPanel;

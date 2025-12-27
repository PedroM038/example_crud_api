/**
 * LongTaskPanel.js - Painel para gerenciar tarefas assíncronas
 * 
 * Permite iniciar tarefas de longa duração e acompanhar seu status
 * através de polling na API.
 */
import React, { useState, useEffect, useRef } from 'react';

import { startLongTask, getTaskStatus } from '../api';

function LongTaskPanel() {
  // Estado da tarefa
  const [taskId, setTaskId] = useState(null);
  const [taskState, setTaskState] = useState(null);
  const [taskResult, setTaskResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref para controlar o intervalo de polling
  const pollingRef = useRef(null);

  /**
   * Inicia uma nova tarefa assíncrona
   */
  const handleStartTask = async () => {
    setError(null);
    setLoading(true);
    setTaskResult(null);

    try {
      const data = await startLongTask();
      setTaskId(data.task_id);
      setTaskState('PENDING');
      // inicia o polling para verificar o status
      startPolling(data.task_id);
    } catch (err) {
      setError('Erro ao iniciar tarefa. Verifique se o Celery está rodando.');
      console.error('Erro ao iniciar tarefa:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * inicia o polling para verificar status da tarefa
   */
  const startPolling = (id) => {
    // limpa polling anterior se existir
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    // polling a cada 1 segundo
    pollingRef.current = setInterval(async () => {
      try {
        const status = await getTaskStatus(id);
        setTaskState(status.state);
        
        // Se a tarefa terminou (sucesso ou falha), para o polling
        if (status.state === 'SUCCESS' || status.state === 'FAILURE') {
          setTaskResult(status.result);
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      } catch (err) {
        console.error('Erro ao verificar status:', err);
        // Continua tentando
      }
    }, 1000);
  };

  // Limpa o polling quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  /**
   * Retorna a classe CSS baseada no estado da tarefa
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

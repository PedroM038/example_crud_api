/**
 * StatisticsPanel.js - Painel para cálculo de estatísticas
 * 
 * Permite calcular média e desvio padrão de valores numéricos
 * usando processamento assíncrono via Celery.
 */
import React, { useState, useEffect, useRef } from 'react';

import { startStatisticsTask, getTaskStatus } from '../api';

function StatisticsPanel() {
  // Estado do input
  const [inputValues, setInputValues] = useState('');
  
  // Estado da tarefa
  const [taskId, setTaskId] = useState(null);
  const [taskState, setTaskState] = useState(null);
  const [taskResult, setTaskResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref para controlar o intervalo de polling
  const pollingRef = useRef(null);

  /**
   * Valida e converte string de entrada para array de números
   */
  const parseValues = (input) => {
    if (!input.trim()) return [];
    
    // Aceita valores separados por vírgula, espaço ou quebra de linha
    const values = input
      .split(/[,\s\n]+/)
      .map(v => v.trim())
      .filter(v => v !== '')
      .map(v => parseFloat(v));
    
    // Verifica se todos são números válidos
    if (values.some(isNaN)) {
      throw new Error('Todos os valores devem ser números válidos');
    }
    
    return values;
  };

  /**
   * Inicia o cálculo de estatísticas
   */
  const handleCalculate = async () => {
    setError(null);
    setTaskResult(null);
    
    try {
      const values = parseValues(inputValues);
      
      if (values.length === 0) {
        setError('Insira pelo menos um valor numérico');
        return;
      }
      
      if (values.length < 2) {
        setError('Insira pelo menos 2 valores para calcular desvio padrão');
        return;
      }
      
      setLoading(true);
      
      const data = await startStatisticsTask(values);
      setTaskId(data.task_id);
      setTaskState('PENDING');
      
      // Inicia polling para verificar status
      startPolling(data.task_id);
      
    } catch (err) {
      setError(err.message || 'Erro ao processar valores');
      setLoading(false);
    }
  };

  /**
   * Inicia o polling para verificar status da tarefa
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
        console.error('Erro ao verificar status:', err);
      }
    }, 500);
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
   * Limpa os resultados e reseta o formulário
   */
  const handleClear = () => {
    setInputValues('');
    setTaskId(null);
    setTaskState(null);
    setTaskResult(null);
    setError(null);
  };

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
    <div className="statistics-panel">
      <h5>📊 Cálculo de Estatísticas</h5>
      <p className="text-muted small">
        Calcule média e desvio padrão usando processamento assíncrono (Celery)
      </p>

      {/* Input de valores */}
      <div className="mb-3">
        <label className="form-label">
          Valores numéricos (separados por vírgula ou espaço):
        </label>
        <textarea
          className="form-control"
          rows="3"
          placeholder="Ex: 10, 20, 30, 40, 50 ou 10 20 30 40 50"
          value={inputValues}
          onChange={(e) => setInputValues(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Botões de ação */}
      <div className="d-flex gap-2 mb-3">
        <button
          className="btn btn-success"
          onClick={handleCalculate}
          disabled={loading || !inputValues.trim()}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Calculando...
            </>
          ) : (
            'Calcular'
          )}
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={handleClear}
          disabled={loading}
        >
          Limpar
        </button>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Status da tarefa */}
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

      {/* Resultados */}
      {taskResult && taskState === 'SUCCESS' && (
        <div className="statistics-result mt-3">
          <h6>Resultados:</h6>
          <div className="row g-2">
            <div className="col-6 col-md-4">
              <div className="stat-card">
                <span className="stat-label">Média</span>
                <span className="stat-value">{taskResult.mean}</span>
              </div>
            </div>
            <div className="col-6 col-md-4">
              <div className="stat-card">
                <span className="stat-label">Desvio Padrão</span>
                <span className="stat-value">{taskResult.std_dev}</span>
              </div>
            </div>
            <div className="col-6 col-md-4">
              <div className="stat-card">
                <span className="stat-label">Quantidade</span>
                <span className="stat-value">{taskResult.count}</span>
              </div>
            </div>
            <div className="col-6 col-md-6">
              <div className="stat-card">
                <span className="stat-label">Mínimo</span>
                <span className="stat-value">{taskResult.min}</span>
              </div>
            </div>
            <div className="col-6 col-md-6">
              <div className="stat-card">
                <span className="stat-label">Máximo</span>
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

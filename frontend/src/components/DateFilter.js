/**
 * DateFilter.js - Componente de filtro por data
 * 
 * Permite filtrar pessoas por data de criação ou modificação.
 * Suporta filtros "de" e "até" para ambos os campos.
 */
import React, { useState } from 'react';

/**
 * @param {function} onFilter - Callback chamado quando os filtros são aplicados
 * @param {function} onClear - Callback chamado quando os filtros são limpos
 * @param {boolean} loading - Indica se está carregando
 */
function DateFilter({ onFilter, onClear, loading }) {
  // Estado dos filtros
  const [filterType, setFilterType] = useState('created'); // 'created' ou 'modified'
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * Aplica os filtros selecionados
   */
  const handleApplyFilter = () => {
    const filters = {};
    
    if (dateFrom) {
      if (filterType === 'created') {
        filters.created_after = dateFrom;
      } else {
        filters.modified_after = dateFrom;
      }
    }
    
    if (dateTo) {
      // Adiciona 1 dia para incluir o dia selecionado (até 23:59:59)
      const toDate = new Date(dateTo);
      toDate.setDate(toDate.getDate() + 1);
      const toDateStr = toDate.toISOString().split('T')[0];
      
      if (filterType === 'created') {
        filters.created_before = toDateStr;
      } else {
        filters.modified_before = toDateStr;
      }
    }
    
    onFilter(filters);
  };

  /**
   * Limpa todos os filtros
   */
  const handleClearFilter = () => {
    setDateFrom('');
    setDateTo('');
    onClear();
  };

  /**
   * Verifica se há filtros ativos
   */
  const hasActiveFilters = dateFrom || dateTo;

  return (
    <div className="date-filter mb-3">
      {/* Botão para expandir/colapsar filtros */}
      <button
        type="button"
        className={`btn btn-sm ${hasActiveFilters ? 'btn-dark' : 'btn-outline-secondary'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        Filtros {hasActiveFilters && '(ativos)'}
        <span className="ms-2">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {/* Painel de filtros (colapsável) */}
      {isExpanded && (
        <div className="filter-panel mt-2 p-3 border rounded bg-light">
          {/* Seletor de tipo de filtro */}
          <div className="mb-3">
            <label className="form-label fw-bold">Filtrar por:</label>
            <div className="btn-group w-100" role="group">
              <input
                type="radio"
                className="btn-check"
                name="filterType"
                id="filterCreated"
                checked={filterType === 'created'}
                onChange={() => setFilterType('created')}
              />
              <label className="btn btn-outline-primary" htmlFor="filterCreated">
                Data de Criação
              </label>

              <input
                type="radio"
                className="btn-check"
                name="filterType"
                id="filterModified"
                checked={filterType === 'modified'}
                onChange={() => setFilterType('modified')}
              />
              <label className="btn btn-outline-primary" htmlFor="filterModified">
                Data de Modificação
              </label>
            </div>
          </div>

          {/* Campos de data */}
          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label">De:</label>
              <input
                type="date"
                className="form-control"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="col-6">
              <label className="form-label">Até:</label>
              <input
                type="date"
                className="form-control"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Botões de ação */}
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleApplyFilter}
              disabled={loading || (!dateFrom && !dateTo)}
            >
              Aplicar Filtro
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleClearFilter}
              disabled={loading || !hasActiveFilters}
            >
              Limpar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateFilter;

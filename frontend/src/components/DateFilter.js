/**
 * DateFilter.js - Date filter component
 * 
 * Allows filtering persons by creation or modification date.
 * Supports "from" and "to" filters for both fields.
 */
import React, { useState } from 'react';

/**
 * @param {function} onFilter - Callback when filters are applied
 * @param {function} onClear - Callback when filters are cleared
 * @param {boolean} loading - Loading state
 */
function DateFilter({ onFilter, onClear, loading }) {
  const [filterType, setFilterType] = useState('created');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * Applies the selected filters.
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
   * Clears all filters.
   */
  const handleClearFilter = () => {
    setDateFrom('');
    setDateTo('');
    onClear();
  };

  /**
   * Checks if there are active filters.
   */
  const hasActiveFilters = dateFrom || dateTo;

  return (
    <div className="date-filter mb-3">
      <button
        type="button"
        className={`btn btn-sm ${hasActiveFilters ? 'btn-dark' : 'btn-outline-secondary'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        Filters {hasActiveFilters && '(active)'}
        <span className="ms-2">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <div className="filter-panel mt-2 p-3 border rounded bg-light">
          <div className="mb-3">
            <label className="form-label fw-bold">Filter by:</label>
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
                Created Date
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
                Modified Date
              </label>
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label">From:</label>
              <input
                type="date"
                className="form-control"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="col-6">
              <label className="form-label">To:</label>
              <input
                type="date"
                className="form-control"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleApplyFilter}
              disabled={loading || (!dateFrom && !dateTo)}
            >
              Apply Filter
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleClearFilter}
              disabled={loading || !hasActiveFilters}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateFilter;

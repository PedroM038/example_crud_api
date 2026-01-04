/**
 * @file SearchFilters.js - Unified search and filter component
 * 
 * @description Provides a simplified interface for filtering persons
 * by name search and date range.
 */

import React, { useState, useEffect, useCallback } from 'react';

/**
 * @param {function} onFilter - Callback when filters are applied
 * @param {boolean} loading - Loading state
 */
function SearchFilters({ onFilter, loading }) {
  const [searchName, setSearchName] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showDateFilters, setShowDateFilters] = useState(false);

  const buildFilters = useCallback((searchValue) => {
    const filters = {};

    if (searchValue.trim()) {
      filters.search = searchValue.trim();
    }

    if (dateFrom) {
      filters.created_after = dateFrom;
    }

    if (dateTo) {
      // add one day to include the entire "to" date
      const toDate = new Date(dateTo);
      toDate.setDate(toDate.getDate() + 1);
      filters.created_before = toDate.toISOString().split('T')[0];
    }

    return filters;
  }, [dateFrom, dateTo]);

  // apply filters when dates change
  useEffect(() => {
    onFilter(buildFilters(appliedSearch));
  }, [dateFrom, dateTo, appliedSearch, buildFilters, onFilter]);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setAppliedSearch(searchName);
    }
  };

  const handleClearAll = () => {
    setSearchName('');
    setAppliedSearch('');
    setDateFrom('');
    setDateTo('');
    setShowDateFilters(false);
    onFilter({});
  };

  const hasActiveFilters = appliedSearch || dateFrom || dateTo;

  return (
    <div className="search-filters mb-3">
      <div className="search-bar mb-2">
        <div className="input-group">
          <span className="input-group-text bg-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            disabled={loading}
          />
          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleClearAll}
              title="Clear all filters"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 mb-2">
        <button
          type="button"
          className={`btn btn-sm ${showDateFilters || dateFrom || dateTo ? 'btn-dark' : 'btn-outline-secondary'}`}
          onClick={() => setShowDateFilters(!showDateFilters)}
        >
          Date Filter {(dateFrom || dateTo) && '(active)'}
          <span className="ms-1">{showDateFilters ? '▲' : '▼'}</span>
        </button>
        
        {hasActiveFilters && (
          <small className="text-muted">
            Filters active
          </small>
        )}
      </div>

      {showDateFilters && (
        <div className="date-filter-panel p-3 border rounded bg-light">
          <div className="row g-2 align-items-end">
            <div className="col-sm-5">
              <label className="form-label small mb-1">From:</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="col-sm-5">
              <label className="form-label small mb-1">To:</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="col-sm-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary w-100"
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                }}
                disabled={loading || (!dateFrom && !dateTo)}
              >
                Clear
              </button>
            </div>
          </div>
          <small className="text-muted mt-2 d-block">
            Filter by creation date
          </small>
        </div>
      )}
    </div>
  );
}

export default SearchFilters;

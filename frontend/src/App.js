/**
 * @file App.js - Main application component
 * 
 * @description Manages global state and coordinates child components.
 * Handles CRUD logic and API communication.
 */
import React, { useState, useEffect, useCallback } from 'react';

import { listPersons, createPerson, updatePerson, deletePerson } from './api';

import PersonForm from './components/PersonForm';
import PersonList from './components/PersonList';
import DateFilter from './components/DateFilter';
import LongTaskPanel from './components/LongTaskPanel';
import StatisticsPanel from './components/StatisticsPanel';

function App() {
  
  const [persons, setPersons] = useState([]);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [editingPerson, setEditingPerson] = useState(null);
  
  const [successMessage, setSuccessMessage] = useState(null);
  
  const [activeFilters, setActiveFilters] = useState({});

  /**
   * Loads the list of persons from the API.
   * @param {string} url - URL for pagination (optional)
   * @param {object} filters - Date filters (optional)
   */
  const loadPersons = useCallback(async (url = null, filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await listPersons(url, filters);
      setPersons(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
    } catch (err) {
      setError('Error loading persons. Check if the API is running.');
      console.error('Error loading persons:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPersons();
  }, [loadPersons]);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  /**
   * Handler to create a new person.
   * @param {object} personData - Person data { person_name, hobbies }
   */
  const handleCreatePerson = async (personData) => {
    try {
      await createPerson(personData);
      await loadPersons();
      showSuccess(`Person "${personData.person_name}" created successfully!`);
      return { success: true };
    } catch (err) {
      console.error('Error creating person:', err);
      return { success: false, error: err.message };
    }
  };

  /**
   * Handler to update an existing person.
   * @param {number} id - Person ID
   * @param {object} personData - Updated data
   */
  const handleUpdatePerson = async (id, personData) => {
    try {
      await updatePerson(id, personData);
      setEditingPerson(null);
      await loadPersons();
      showSuccess(`Person "${personData.person_name}" updated successfully!`);
      return { success: true };
    } catch (err) {
      console.error('Error updating person:', err);
      return { success: false, error: err.message };
    }
  };

  /**
   * Handler to delete a person.
   * @param {number} id - Person ID
   */
  const handleDeletePerson = async (id) => {
    try {
      await deletePerson(id);
      await loadPersons();
      showSuccess('Person deleted successfully!');
      return { success: true };
    } catch (err) {
      console.error('Error deleting person:', err);
      return { success: false, error: err.message };
    }
  };

  /**
   * Handler to start editing a person.
   * @param {object} person - Person to edit
   */
  const handleEditPerson = (person) => {
    setEditingPerson(person);
  };

  const handleCancelEdit = () => {
    setEditingPerson(null);
  };

  const handleFilter = (filters) => {
    setActiveFilters(filters);
    loadPersons(null, filters);
  };

  const handleClearFilter = () => {
    setActiveFilters({});
    loadPersons();
  };

  const handleNextPage = () => {
    if (pagination.next) {
      loadPersons(pagination.next);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.previous) {
      loadPersons(pagination.previous);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Person CRUD Demo</h3>

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setSuccessMessage(null)}
            aria-label="Close"
          />
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
          <button 
            className="btn btn-link" 
            onClick={() => loadPersons()}
          >
            Try again
          </button>
        </div>
      )}

      <PersonForm
        onSubmit={editingPerson 
          ? (data) => handleUpdatePerson(editingPerson.id, data)
          : handleCreatePerson
        }
        initialData={editingPerson}
        isEditing={!!editingPerson}
        onCancel={handleCancelEdit}
      />

      <DateFilter
        onFilter={handleFilter}
        onClear={handleClearFilter}
        loading={loading}
      />

      <PersonList
        persons={persons}
        loading={loading}
        onEdit={handleEditPerson}
        onDelete={handleDeletePerson}
        editingPersonId={editingPerson?.id}
      />

      <div className="pagination-controls d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          onClick={handlePreviousPage}
          disabled={!pagination.previous || loading}
        >
          Prev
        </button>
        <span className="align-self-center text-muted">
          {pagination.count} person(s) found
          {Object.keys(activeFilters).length > 0 && ' (filtered)'}
        </span>
        <button
          className="btn btn-secondary"
          onClick={handleNextPage}
          disabled={!pagination.next || loading}
        >
          Next
        </button>
      </div>

      <hr className="my-4" />

      <h4 className="mb-3">Extra Features</h4>
      
      <LongTaskPanel />
      
      <StatisticsPanel />
    </div>
  );
}

export default App;

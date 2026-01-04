/**
 * @file PersonList.js - person list with edit and delete actions
 * 
 * displays persons in a Bootstrap list format.
 * each item has edit and delete buttons.
 */
import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';

const ORDERING_OPTIONS = [
  { value: '-created_date', label: 'Newest First' },
  { value: 'created_date', label: 'Oldest First' },
  { value: 'person_name', label: 'Name (A-Z)' },
  { value: '-person_name', label: 'Name (Z-A)' },
  { value: '-modified_date', label: 'Recently Modified' },
  { value: 'modified_date', label: 'Least Recently Modified' },
];

/**
 * @param {array} persons - list of persons to display
 * @param {boolean} loading - loading state
 * @param {function} onEdit - callback to edit person
 * @param {function} onDelete - callback to delete person
 * @param {number} editingPersonId - id of person being edited
 */
function PersonList({ persons, loading, onEdit, onDelete, editingPersonId, ordering = '-created_date', onOrderingChange }) {
  const [deletingId, setDeletingId] = useState(null);
  const [personToDelete, setPersonToDelete] = useState(null);

  const OrderingSelector = () => (
    <div className="d-flex align-items-center gap-2">
      <label htmlFor="ordering" className="text-muted small mb-0">Sort by:</label>
      <select
        id="ordering"
        className="form-select form-select-sm"
        style={{ width: 'auto' }}
        value={ordering}
        onChange={(e) => onOrderingChange(e.target.value)}
        disabled={loading}
      >
        {ORDERING_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const handleDeleteClick = (person) => {
    setPersonToDelete(person);
  };

  const handleCancelDelete = () => {
    setPersonToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!personToDelete) return;

    setDeletingId(personToDelete.id);
    
    try {
      await onDelete(personToDelete.id);
    } finally {
      setDeletingId(null);
      setPersonToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (persons.length === 0) {
    return (
      <div className="empty-state">
        <p>No persons registered.</p>
        <small>Use the form above to add the first person.</small>
      </div>
    );
  }

  return (
    <div className="person-list">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Persons</h5>
        <OrderingSelector />
      </div>
      
      <ul className="list-group mb-3">
        {persons.map((person) => (
          <li
            key={person.id}
            className={`list-group-item d-flex justify-content-between align-items-start person-item ${
              editingPersonId === person.id ? 'editing-mode' : ''
            }`}
          >
            <div className="me-auto">
              <span className="person-name">
                <strong>{person.person_name}</strong>
              </span>
              <br />
              <small className="person-hobbies">
                {JSON.stringify(person.hobbies)}
              </small>
            </div>

            <div className="btn-action-group">
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={() => onEdit(person)}
                disabled={deletingId === person.id}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDeleteClick(person)}
                disabled={deletingId === person.id}
              >
                {deletingId === person.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmModal
        isOpen={personToDelete !== null}
        title="Delete Person"
        message={`Are you sure you want to delete "${personToDelete?.person_name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deletingId !== null}
      />
    </div>
  );
}

export default PersonList;

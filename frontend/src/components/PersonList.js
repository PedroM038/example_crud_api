/**
 * PersonList.js - Person list with edit and delete actions
 * 
 * Displays persons in a Bootstrap list format.
 * Each item has edit and delete buttons.
 */
import React, { useState } from 'react';

/**
 * @param {array} persons - List of persons to display
 * @param {boolean} loading - Loading state
 * @param {function} onEdit - Callback to edit person
 * @param {function} onDelete - Callback to delete person
 * @param {number} editingPersonId - ID of person being edited
 */
function PersonList({ persons, loading, onEdit, onDelete, editingPersonId }) {
  const [deletingId, setDeletingId] = useState(null);

  /**
   * Handler to delete person with confirmation.
   */
  const handleDelete = async (person) => {
    if (!window.confirm(`Are you sure you want to delete "${person.person_name}"?`)) {
      return;
    }

    setDeletingId(person.id);
    
    try {
      await onDelete(person.id);
    } finally {
      setDeletingId(null);
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
      <h5>Persons</h5>
      
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
                onClick={() => handleDelete(person)}
                disabled={deletingId === person.id}
              >
                {deletingId === person.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PersonList;

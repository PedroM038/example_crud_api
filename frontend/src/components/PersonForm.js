/**
 * PersonForm.js - Form to create and edit persons
 * 
 * Controlled component that manages form fields.
 * Supports create and edit modes.
 */
import React, { useState, useEffect, useRef } from 'react';

/**
 * @param {function} onSubmit - Function called on form submit
 * @param {object} initialData - Initial data for editing
 * @param {boolean} isEditing - Indicates edit mode
 * @param {function} onCancel - Function called on cancel edit
 */
function PersonForm({ onSubmit, initialData, isEditing, onCancel }) {
  const formRef = useRef(null);
  
  const [personName, setPersonName] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setPersonName(initialData.person_name || '');
      setHobbies(
        Array.isArray(initialData.hobbies) 
          ? initialData.hobbies.join(', ') 
          : ''
      );
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setPersonName('');
      setHobbies('');
    }
  }, [initialData]);

  /**
   * Form submit handler.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!personName.trim()) {
      setError('Name is required');
      return;
    }

    const hobbiesArray = hobbies
      .split(',')
      .map(h => h.trim())
      .filter(h => h.length > 0);

    setSubmitting(true);

    try {
      const result = await onSubmit({
        person_name: personName.trim(),
        hobbies: hobbiesArray,
      });

      if (result.success) {
        if (!isEditing) {
          setPersonName('');
          setHobbies('');
        }
      } else {
        setError(result.error || 'Error saving person');
      }
    } catch (err) {
      setError('Unexpected error saving person');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div ref={formRef} className={`person-form ${isEditing ? 'edit-form' : ''}`}>
      <h5>{isEditing ? 'Edit Person' : 'Create Person'}</h5>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Person name"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          disabled={submitting}
        />

        <input
          type="text"
          className="form-control mb-2"
          placeholder="Hobbies (comma separated)"
          value={hobbies}
          onChange={(e) => setHobbies(e.target.value)}
          disabled={submitting}
        />

        {error && (
          <div className="text-danger mb-2" style={{ fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <div className="d-flex gap-2">
          <button
            type="submit"
            className={`btn ${isEditing ? 'btn-warning' : 'btn-primary'}`}
            disabled={submitting}
          >
            {submitting 
              ? 'Saving...' 
              : (isEditing ? 'Update' : 'Create')
            }
          </button>

          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PersonForm;

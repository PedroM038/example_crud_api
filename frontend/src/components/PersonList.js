/**
 * PersonList.js - Lista de pessoas com ações de editar e deletar
 * 
 * Exibe as pessoas em formato de lista com Bootstrap.
 * Cada item tem botões para editar e deletar.
 */
import React, { useState } from 'react';

/**
 * @param {array} persons - Lista de pessoas a exibir
 * @param {boolean} loading - Indica se está carregando
 * @param {function} onEdit - Callback para editar pessoa
 * @param {function} onDelete - Callback para deletar pessoa
 * @param {number} editingPersonId - ID da pessoa sendo editada
 */
function PersonList({ persons, loading, onEdit, onDelete, editingPersonId }) {
  // estado para controlar qual item está sendo deletado
  const [deletingId, setDeletingId] = useState(null);

  /**
   * handler para deletar pessoa com confirmação
   */
  const handleDelete = async (person) => {
    // confirmação antes de deletar
    if (!window.confirm(`Tem certeza que deseja deletar "${person.person_name}"?`)) {
      return;
    }

    setDeletingId(person.id);
    
    try {
      await onDelete(person.id);
    } finally {
      setDeletingId(null);
    }
  };

  // se está carregando, mostra spinner
  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  // estado vazio
  if (persons.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhuma pessoa cadastrada.</p>
        <small>Use o formulário acima para adicionar a primeira pessoa.</small>
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
                {/* exibe hobbies como JSON string para manter o formato do mock */}
                {JSON.stringify(person.hobbies)}
              </small>
            </div>

            <div className="btn-action-group">
              <button
                className="btn btn-sm btn-outline-secondary"
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

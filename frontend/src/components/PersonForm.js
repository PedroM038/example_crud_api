/**
 * PersonForm.js - Formulário para criar e editar pessoas
 * 
 * Componente controlado que gerencia os campos do formulário.
 * Suporta modo de criação e edição.
 */
import React, { useState, useEffect } from 'react';

/**
 * @param {function} onSubmit - Função chamada ao submeter o formulário
 * @param {object} initialData - Dados iniciais para edição
 * @param {boolean} isEditing - Indica se está em modo de edição
 * @param {function} onCancel - Função chamada ao cancelar edição
 */
function PersonForm({ onSubmit, initialData, isEditing, onCancel }) {
  // estado do formulário
  const [personName, setPersonName] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // preenche o formulário quando initialData muda (modo edição)
  useEffect(() => {
    if (initialData) {
      setPersonName(initialData.person_name || '');
      // converte array de hobbies para string separada por vírgulas
      setHobbies(
        Array.isArray(initialData.hobbies) 
          ? initialData.hobbies.join(', ') 
          : ''
      );
    } else {
      // limpa o formulário quando sai do modo edição
      setPersonName('');
      setHobbies('');
    }
  }, [initialData]);

  /**
   * handler de submit do formulário
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // validação básica
    if (!personName.trim()) {
      setError('O nome é obrigatório');
      return;
    }

    // converte string de hobbies para array
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
        // limpa o formulário após sucesso (apenas no modo criação)
        if (!isEditing) {
          setPersonName('');
          setHobbies('');
        }
      } else {
        setError(result.error || 'Erro ao salvar pessoa');
      }
    } catch (err) {
      setError('Erro inesperado ao salvar pessoa');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`person-form ${isEditing ? 'edit-form' : ''}`}>
      <h5>{isEditing ? 'Edit Person' : 'Create Person'}</h5>
      
      <form onSubmit={handleSubmit}>
        {/* campo de nome */}
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Person name"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          disabled={submitting}
        />

        {/* campo de hobbies */}
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Hobbies (comma separated)"
          value={hobbies}
          onChange={(e) => setHobbies(e.target.value)}
          disabled={submitting}
        />

        {/* mensagem de erro */}
        {error && (
          <div className="text-danger mb-2" style={{ fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {/* botões de ação */}
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

          {/* botão cancelar (apenas no modo edição) */}
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

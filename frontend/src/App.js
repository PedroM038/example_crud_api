/**
 * App.js - Componente principal da aplicação
 * 
 * Gerencia o estado global e coordena os componentes filhos.
 * Responsável pela lógica de CRUD e comunicação com a API.
 */
import React, { useState, useEffect, useCallback } from 'react';

// Importa funções da API
import { listPersons, createPerson, updatePerson, deletePerson } from './api';

// Importa componentes
import PersonForm from './components/PersonForm';
import PersonList from './components/PersonList';
import DateFilter from './components/DateFilter';
import LongTaskPanel from './components/LongTaskPanel';
import StatisticsPanel from './components/StatisticsPanel';

function App() {
  
  // Lista de pessoas e dados de paginação
  const [persons, setPersons] = useState([]);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  
  // Estado de carregamento e erros
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para edição de pessoa
  const [editingPerson, setEditingPerson] = useState(null);
  
  // Estado para mensagem de sucesso
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Estado para filtros ativos
  const [activeFilters, setActiveFilters] = useState({});

  /**
   * Carrega a lista de pessoas da API
   * @param {string} url - URL para paginação (opcional)
   * @param {object} filters - Filtros de data (opcional)
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
      setError('Erro ao carregar pessoas. Verifique se a API está rodando.');
      console.error('Erro ao carregar pessoas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega pessoas na montagem do componente
  useEffect(() => {
    loadPersons();
  }, [loadPersons]);


  /**
   * Handler para criar uma nova pessoa
   * @param {object} personData - Dados da pessoa { person_name, hobbies }
   */
  /**
   * Exibe mensagem de sucesso temporária
   */
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCreatePerson = async (personData) => {
    try {
      await createPerson(personData);
      // Recarrega a lista para mostrar a nova pessoa
      await loadPersons();
      showSuccess(`Pessoa "${personData.person_name}" criada com sucesso!`);
      return { success: true };
    } catch (err) {
      console.error('Erro ao criar pessoa:', err);
      return { success: false, error: err.message };
    }
  };

  /**
   * Handler para atualizar uma pessoa existente
   * @param {number} id - ID da pessoa
   * @param {object} personData - Dados atualizados
   */
  const handleUpdatePerson = async (id, personData) => {
    try {
      await updatePerson(id, personData);
      // Limpa o estado de edição e recarrega a lista
      setEditingPerson(null);
      await loadPersons();
      showSuccess(`Pessoa "${personData.person_name}" atualizada com sucesso!`);
      return { success: true };
    } catch (err) {
      console.error('Erro ao atualizar pessoa:', err);
      return { success: false, error: err.message };
    }
  };

  /**
   * Handler para deletar uma pessoa
   * @param {number} id - ID da pessoa
   */
  const handleDeletePerson = async (id) => {
    try {
      await deletePerson(id);
      // Recarrega a lista após deletar
      await loadPersons();
      showSuccess('Pessoa removida com sucesso!');
      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar pessoa:', err);
      return { success: false, error: err.message };
    }
  };

  /**
   * Handler para iniciar edição de uma pessoa
   * @param {object} person - Pessoa a ser editada
   */
  const handleEditPerson = (person) => {
    setEditingPerson(person);
  };

  /**
   * Handler para cancelar edição
   */
  const handleCancelEdit = () => {
    setEditingPerson(null);
  };

  /**
   * Handler para aplicar filtros de data
   */
  const handleFilter = (filters) => {
    setActiveFilters(filters);
    loadPersons(null, filters);
  };

  /**
   * Handler para limpar filtros
   */
  const handleClearFilter = () => {
    setActiveFilters({});
    loadPersons();
  };

  /**
   * Navega para a próxima página
   */
  const handleNextPage = () => {
    if (pagination.next) {
      loadPersons(pagination.next);
    }
  };

  /**
   * Navega para a página anterior
   */
  const handlePreviousPage = () => {
    if (pagination.previous) {
      loadPersons(pagination.previous);
    }
  };


  return (
    <div className="container mt-4">
      <h3>Person CRUD Demo</h3>

      {/* Mensagem de sucesso */}
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

      {/* Mensagem de erro global */}
      {error && (
        <div className="error-message">
          {error}
          <button 
            className="btn btn-link" 
            onClick={() => loadPersons()}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Formulário para criar/editar pessoa */}
      <PersonForm
        onSubmit={editingPerson 
          ? (data) => handleUpdatePerson(editingPerson.id, data)
          : handleCreatePerson
        }
        initialData={editingPerson}
        isEditing={!!editingPerson}
        onCancel={handleCancelEdit}
      />

      {/* Filtros por data */}
      <DateFilter
        onFilter={handleFilter}
        onClear={handleClearFilter}
        loading={loading}
      />

      {/* Lista de pessoas */}
      <PersonList
        persons={persons}
        loading={loading}
        onEdit={handleEditPerson}
        onDelete={handleDeletePerson}
        editingPersonId={editingPerson?.id}
      />

      {/* Controles de paginação */}
      <div className="pagination-controls d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          onClick={handlePreviousPage}
          disabled={!pagination.previous || loading}
        >
          Prev
        </button>
        <span className="align-self-center text-muted">
          {pagination.count} pessoa(s) encontrada(s)
          {Object.keys(activeFilters).length > 0 && ' (filtrado)'}
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

      {/* Seção de funcionalidades extras */}
      <h4 className="mb-3">Funcionalidades Extras</h4>
      
      {/* Painel de tarefas assíncronas */}
      <LongTaskPanel />
      
      {/* Painel de estatísticas */}
      <StatisticsPanel />
    </div>
  );
}

export default App;

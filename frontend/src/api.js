/**
 * api.js - Módulo de comunicação com a API Backend
 * 
 * Centraliza todas as chamadas HTTP para a API Django REST Framework.
 * Facilita manutenção e reutilização das operações CRUD.
 */

// URL base da API - pode ser configurada via variável de ambiente (vide .env)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8001/api';

/**
 * função auxiliar para fazer requisições HTTP
 * trata erros de forma consistente e converte respostas para JSON
 * 
 * @param {string} endpoint - Endpoint da API (sem a URL base)
 * @param {object} options - Opções do fetch (method, body, headers, etc.)
 * @returns {Promise} - Promise com os dados da resposta
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // para DELETE, pode não ter corpo na resposta
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      // cria um erro com informações detalhadas da API
      const error = new Error(data.detail || 'Erro na requisição');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // lança novamente erros de rede ou erros já tratados
    console.error(`Erro na requisição ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Lista todas as pessoas com paginação
 * 
 * @param {string} url - URL completa para paginação (opcional)
 * @returns {Promise} - Promise com lista paginada de pessoas
 * 
 * Resposta esperada:
 * {
 *   count: number,
 *   next: string | null,
 *   previous: string | null,
 *   results: Person[]
 * }
 */
export async function listPersons(url = null) {
  // se uma URL completa for passada (para paginação), usa ela diretamente
  if (url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erro ao buscar pessoas');
    }
    return response.json();
  }
  
  return apiRequest('/persons/');
}

/**
 * busca uma pessoa específica pelo ID
 * 
 * @param {number} id - ID da pessoa
 * @returns {Promise} - Promise com os dados da pessoa
 */
export async function getPerson(id) {
  return apiRequest(`/persons/${id}/`);
}

/**
 * cria uma nova pessoa
 * 
 * @param {object} personData - Dados da pessoa { person_name, hobbies }
 * @returns {Promise} - Promise com a pessoa criada
 */
export async function createPerson(personData) {
  return apiRequest('/persons/', {
    method: 'POST',
    body: JSON.stringify(personData),
  });
}

/**
 * atualiza uma pessoa existente (atualização parcial)
 * 
 * @param {number} id - ID da pessoa
 * @param {object} personData - Dados a serem atualizados
 * @returns {Promise} - Promise com a pessoa atualizada
 */
export async function updatePerson(id, personData) {
  return apiRequest(`/persons/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(personData),
  });
}

/**
 * Remove uma pessoa
 * 
 * @param {number} id - ID da pessoa
 * @returns {Promise} - Promise vazia em caso de sucesso
 */
export async function deletePerson(id) {
  return apiRequest(`/persons/${id}/`, {
    method: 'DELETE',
  });
}

// Os métodos a seguir ainda precisam ser revisados TODO

/**
 * inicia uma tarefa assíncrona de longa duração
 * 
 * @returns {Promise} - Promise com { task_id, status: "accepted" }
 */
export async function startLongTask() {
  return apiRequest('/long-task/', {
    method: 'POST',
  });
}

/**
 * Verifica o status de uma tarefa assíncrona
 * 
 * @param {string} taskId - UUID da tarefa
 * @returns {Promise} - Promise com { task_id, state, result }
 * 
 * Estados possíveis:
 * - PENDING: Aguardando execução
 * - STARTED: Em execução
 * - RETRY: Será reexecutada
 * - FAILURE: Falhou
 * - SUCCESS: Concluída com sucesso
 */
export async function getTaskStatus(taskId) {
  return apiRequest(`/long-task/${taskId}/`);
}

export default {
  listPersons,
  getPerson,
  createPerson,
  updatePerson,
  deletePerson,
  startLongTask,
  getTaskStatus,
};

/**
 * @file api.js - Backend API communication module
 * 
 * @description Centralizes all HTTP calls to the Django REST Framework API.
 * Facilitates maintenance and reuse of CRUD operations.
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8001/api';

/**
 * Helper function to make HTTP requests.
 * Handles errors consistently and converts responses to JSON.
 * 
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise} - Promise with response data
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
    
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.detail || 'Request error');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Request error ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Lists all persons with pagination and optional filters.
 * 
 * @param {string} url - Full URL for pagination (optional)
 * @param {object} filters - Optional filters { search, created_after, created_before, modified_after, modified_before }
 * @param {number} pageSize - Number of items per page (optional)
 * @param {string} ordering - Field to order by (optional), prefix with '-' for descending
 * @returns {Promise} - Promise with paginated list of persons
 */
export async function listPersons(url = null, filters = {}, pageSize = null, ordering = null) {
  if (url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error fetching persons');
    }
    return response.json();
  }
  
  const params = new URLSearchParams();
  
  // Pagination
  if (pageSize) {
    params.append('limit', pageSize);
  }
  
  // Ordering
  if (ordering) {
    params.append('ordering', ordering);
  }
  
  // Search by name
  if (filters.search) {
    params.append('search', filters.search);
  }
  
  // Date filters
  if (filters.created_after) {
    params.append('created_date__gte', filters.created_after);
  }
  if (filters.created_before) {
    params.append('created_date__lte', filters.created_before);
  }
  if (filters.modified_after) {
    params.append('modified_date__gte', filters.modified_after);
  }
  if (filters.modified_before) {
    params.append('modified_date__lte', filters.modified_before);
  }
  
  const queryString = params.toString();
  const endpoint = queryString ? `/persons/?${queryString}` : '/persons/';
  
  return apiRequest(endpoint);
}

/**
 * Fetches a specific person by ID.
 * 
 * @param {number} id - Person ID
 * @returns {Promise} - Promise with person data
 */
export async function getPerson(id) {
  return apiRequest(`/persons/${id}/`);
}

/**
 * Creates a new person.
 * 
 * @param {object} personData - Person data { person_name, hobbies }
 * @returns {Promise} - Promise with created person
 */
export async function createPerson(personData) {
  return apiRequest('/persons/', {
    method: 'POST',
    body: JSON.stringify(personData),
  });
}

/**
 * Updates an existing person (partial update).
 * 
 * @param {number} id - Person ID
 * @param {object} personData - Data to update
 * @returns {Promise} - Promise with updated person
 */
export async function updatePerson(id, personData) {
  return apiRequest(`/persons/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(personData),
  });
}

/**
 * Deletes a person.
 * 
 * @param {number} id - Person ID
 * @returns {Promise} - Empty promise on success
 */
export async function deletePerson(id) {
  return apiRequest(`/persons/${id}/`, {
    method: 'DELETE',
  });
}

/**
 * Starts a long-running async task.
 * 
 * @returns {Promise} - Promise with { task_id, status: "accepted" }
 */
export async function startLongTask() {
  return apiRequest('/long-task/', {
    method: 'POST',
  });
}

/**
 * Checks the status of an async task.
 * 
 * @param {string} taskId - Task UUID
 * @returns {Promise} - Promise with { task_id, state, result }
 */
export async function getTaskStatus(taskId) {
  return apiRequest(`/long-task/${taskId}/`);
}

/**
 * Starts an async task to calculate statistics (mean and standard deviation).
 * 
 * @param {number[]} values - List of numeric values
 * @returns {Promise} - Promise with { task_id, status: "accepted", values_count }
 */
export async function startStatisticsTask(values) {
  return apiRequest('/statistics/', {
    method: 'POST',
    body: JSON.stringify({ values }),
  });
}

export default {
  listPersons,
  getPerson,
  createPerson,
  updatePerson,
  deletePerson,
  startLongTask,
  getTaskStatus,
  startStatisticsTask,
};

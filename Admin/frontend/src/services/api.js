const API_BASE_URL = 'http://localhost:8001/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Try to get error message from response body
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // If we can't parse JSON, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    
    // Enhance network error messages
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please check your internet connection and ensure the backend server is running.');
    }
    
    throw error;
  }
};

// User API functions
export const userAPI = {
  getAllUsers: () => apiRequest('/users'),
  getUserById: (id) => apiRequest(`/users/${id}`),
  updateUser: (id, userData) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  deleteUser: (id) => apiRequest(`/users/${id}`, {
    method: 'DELETE',
  }),
  getUsersByStatus: (status) => apiRequest(`/users/status/${status}`),
};

// Tournament API functions
export const tournamentAPI = {
  getAllTournaments: () => apiRequest('/tournaments'),
  getTournamentById: (id) => apiRequest(`/tournaments/${id}`),
  createTournament: (tournamentData) => apiRequest('/tournaments', {
    method: 'POST',
    body: JSON.stringify(tournamentData),
  }),
  updateTournament: (id, tournamentData) => apiRequest(`/tournaments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tournamentData),
  }),
  deleteTournament: (id) => apiRequest(`/tournaments/${id}`, {
    method: 'DELETE',
  }),
  getTournamentsByStatus: (status) => apiRequest(`/tournaments/status/${status}`),
};

// Match API functions
export const matchAPI = {
  getAllMatches: () => apiRequest('/matches'),
  getMatchById: (id) => apiRequest(`/matches/${id}`),
  createMatch: (matchData) => apiRequest('/matches', {
    method: 'POST',
    body: JSON.stringify(matchData),
  }),
  updateMatch: (id, matchData) => apiRequest(`/matches/${id}`, {
    method: 'PUT',
    body: JSON.stringify(matchData),
  }),
  deleteMatch: (id) => apiRequest(`/matches/${id}`, {
    method: 'DELETE',
  }),
  updateMatchStatus: (id, status) => apiRequest(`/matches/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  getMatchesByTournament: (tournamentId) => apiRequest(`/matches/tournament/${tournamentId}`),
  getMatchesByStatus: (status) => apiRequest(`/matches/status/${status}`),
};

// Health check
export const healthCheck = () => apiRequest('/health');

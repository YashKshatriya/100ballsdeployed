// API base URL configuration
const API_BASE_URL = 'https://one00ballsdeployed-11.onrender.com/api';

// Log environment for debugging
console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', process.env.NODE_ENV);

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Log the URL for debugging
  console.log(`API Request: ${url}`, { options });
  
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Tournament API functions
export const tournamentAPI = {
  getAllTournaments: () => apiRequest('/tournaments'),
  getTournamentById: (id) => apiRequest(`/tournaments/${id}`),
  getTournamentsByStatus: (status) => apiRequest(`/tournaments/status/${status}`),
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
};

// User registration API
export const userAPI = {
  registerUser: (userData) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
};

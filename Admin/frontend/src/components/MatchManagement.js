import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, Users, MapPin, Trophy, Play, Pause } from 'lucide-react';
import { matchAPI } from '../services/api';

const MatchManagement = () => {
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [formData, setFormData] = useState({
    tournamentId: '',
    teamA: '',
    teamB: '',
    matchNumber: '',
    matchType: 'league',
    scheduledDate: '',
    venue: ''
  });

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const matchesData = await matchAPI.getAllMatches();
        setMatches(matchesData);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingMatch) {
      // Update existing match
      setMatches(matches.map(m => 
        m.id === editingMatch.id ? { ...formData, id: editingMatch.id } : m
      ));
    } else {
      // Create new match
      const newMatch = {
        ...formData,
        id: matches.length + 1,
        status: 'upcoming',
        winner: null,
        manOfTheMatch: null
      };
      setMatches([...matches, newMatch]);
    }
    setIsModalOpen(false);
    setEditingMatch(null);
    setFormData({
      tournamentId: '',
      teamA: '',
      teamB: '',
      matchNumber: '',
      matchType: 'league',
      scheduledDate: '',
      venue: '',
      teamAScore: '',
      teamBScore: ''
    });
  };

  const handleEdit = (match) => {
    setEditingMatch(match);
    setFormData({
      tournamentId: match.tournamentId,
      teamA: match.teamA,
      teamB: match.teamB,
      matchNumber: match.matchNumber,
      matchType: match.matchType,
      scheduledDate: match.scheduledDate,
      venue: match.venue,
      teamAScore: match.teamAScore || '',
      teamBScore: match.teamBScore || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (matchId) => {
    setMatches(matches.filter(m => m.id !== matchId));
  };

  const updateMatchStatus = (matchId, newStatus) => {
    setMatches(matches.map(m => 
      m.id === matchId ? { ...m, status: newStatus } : m
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Match Management</h1>
          <p className="text-gray-600 mt-2">Schedule and manage cricket matches</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Match
        </button>
      </div>

      {/* Matches List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Matches</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {matches.map((match) => (
            <div key={match.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Match #{match.matchNumber} - {match.tournamentName}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(match.status)}`}>
                    {match.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(match)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(match.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(match.scheduledDate).toLocaleDateString()} at {new Date(match.scheduledDate).toLocaleTimeString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {match.venue}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {match.matchType}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Trophy className="h-4 w-4 mr-2" />
                  {match.winner || 'TBD'}
                </div>
              </div>

              {/* Match Score Card */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-center flex-1">
                    <h4 className="font-semibold text-gray-900">{match.teamA}</h4>
                    <p className="text-2xl font-bold text-blue-600">{match.teamAScore || '0/0'}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-500 text-sm">VS</span>
                  </div>
                  <div className="text-center flex-1">
                    <h4 className="font-semibold text-gray-900">{match.teamB}</h4>
                    <p className="text-2xl font-bold text-red-600">{match.teamBScore || '0/0'}</p>
                  </div>
                </div>

                {match.status === 'completed' && match.manOfTheMatch && (
                  <div className="text-center mt-4">
                    <span className="text-sm text-gray-600">Man of the Match: </span>
                    <span className="font-semibold text-yellow-600">{match.manOfTheMatch}</span>
                  </div>
                )}

                {/* Match Actions */}
                <div className="flex justify-center gap-4 mt-4">
                  {match.status === 'upcoming' && (
                    <button
                      onClick={() => updateMatchStatus(match.id, 'in_progress')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Start Match
                    </button>
                  )}
                  {match.status === 'in_progress' && (
                    <button
                      onClick={() => updateMatchStatus(match.id, 'completed')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                    >
                      <Pause className="h-4 w-4" />
                      End Match
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Match Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingMatch ? 'Edit Match' : 'Create Match'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team A</label>
                <input
                  type="text"
                  name="teamA"
                  value={formData.teamA}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team B</label>
                <input
                  type="text"
                  name="teamB"
                  value={formData.teamB}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Match Number</label>
                  <input
                    type="number"
                    name="matchNumber"
                    value={formData.matchNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Match Type</label>
                  <select
                    name="matchType"
                    value={formData.matchType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="league">League</option>
                    <option value="quarter_final">Quarter Final</option>
                    <option value="semi_final">Semi Final</option>
                    <option value="final">Final</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  {editingMatch ? 'Update Match' : 'Create Match'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchManagement;

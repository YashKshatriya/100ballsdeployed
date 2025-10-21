import React, { useState, useEffect } from 'react';
import { Plus, Edit, Check, Trash2, Users, Calendar, MapPin, DollarSign, Clock } from 'lucide-react';
import { tournamentAPI } from '../services/api';

const TournamentManagement = () => {
  const [tournaments, setTournaments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    venue: '',
    maxTeams: '',
    registrationFee: '',
    prizePool: '',
    registrationDeadline: '',
    status: 'upcoming',
    tournamentType: 'league',
    format: 't20',
    registeredTeams: 0
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        console.log('🔄 Fetching tournaments from API...');
        setLoading(true);
        setError(null);
        const tournamentsData = await tournamentAPI.getAllTournaments();
        console.log('✅ Tournaments fetched:', tournamentsData);
        setTournaments(tournamentsData);
      } catch (error) {
        console.error('❌ Error fetching tournaments:', error);
        setError('Failed to fetch tournaments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    }
    
    if (!formData.venue.trim()) {
      errors.venue = 'Venue is required';
    }
    
    if (!formData.maxTeams || formData.maxTeams < 2) {
      errors.maxTeams = 'Max teams must be at least 2';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const tournamentData = {
      ...formData,
      maxTeams: parseInt(formData.maxTeams),
      registrationFee: parseInt(formData.registrationFee) || 0,
      prizePool: parseInt(formData.prizePool),
      registeredTeams: parseInt(formData.registeredTeams) || 0
    };
    
    try {
      if (editingTournament) {
        const updatedTournament = await tournamentAPI.updateTournament(editingTournament._id, tournamentData);
        setTournaments(tournaments.map(t => 
          t._id === editingTournament._id ? updatedTournament : t
        ));
        alert('Tournament updated successfully!');
      } else {
        const newTournament = await tournamentAPI.createTournament(tournamentData);
        setTournaments([...tournaments, newTournament]);
        alert('Tournament created successfully!');
      }
      
      setIsModalOpen(false);
      setEditingTournament(null);
      resetForm();
    } catch (error) {
      console.error('Error saving tournament:', error);
      alert('Failed to save tournament. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      venue: '',
      maxTeams: '',
      registrationFee: '',
      prizePool: '',
      registrationDeadline: '',
      status: 'upcoming',
      tournamentType: 'league',
      format: 't20',
      registeredTeams: 0
    });
    setFormErrors({});
  };

  const handleEdit = (tournament) => {
    setEditingTournament(tournament);
    
    const formatDateForInput = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };
    
    setFormData({
      title: tournament.title,
      description: tournament.description || '',
      startDate: formatDateForInput(tournament.startDate),
      endDate: formatDateForInput(tournament.endDate),
      venue: tournament.venue,
      maxTeams: tournament.maxTeams,
      registrationFee: tournament.registrationFee || 0,
      prizePool: tournament.prizePool || 0,
      registrationDeadline: formatDateForInput(tournament.registrationDeadline),
      status: tournament.status || 'upcoming',
      tournamentType: tournament.tournamentType || 'league',
      format: tournament.format || 't20',
      registeredTeams: tournament.registeredTeams || 0
    });
    setIsModalOpen(true);
  };

  const handleMarkCompleted = async (tournamentId) => {
    if (!window.confirm('Mark this tournament as completed?')) {
      return;
    }
    
    try {
      const updatedTournament = await tournamentAPI.updateTournament(tournamentId, { status: 'completed' });
      setTournaments(tournaments.map(t => 
        t._id === tournamentId ? updatedTournament : t
      ));
      alert('Tournament marked as completed!');
    } catch (error) {
      console.error('Error updating tournament status:', error);
      alert('Failed to update tournament status.');
    }
  };

  const handleDelete = async (tournamentId) => {
    if (!window.confirm('Permanently delete this tournament?')) {
      return;
    }
    
    try {
      await tournamentAPI.deleteTournament(tournamentId);
      setTournaments(tournaments.filter(t => t._id !== tournamentId));
      alert('Tournament deleted successfully!');
    } catch (error) {
      console.error('Error deleting tournament:', error);
      alert('Failed to delete tournament.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading tournaments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tournament Management</h1>
          <p className="text-gray-600 mt-2">Create and manage cricket tournaments</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Tournament
        </button>
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <div key={tournament._id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{tournament.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tournament.status)}`}>
                  {tournament.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{tournament.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {tournament.venue}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {tournament.registeredTeams}/{tournament.maxTeams} teams
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Prize Pool: ₹{tournament.prizePool.toLocaleString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Registration Deadline: {new Date(tournament.registrationDeadline).toLocaleDateString()}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(tournament.registeredTeams / tournament.maxTeams) * 100}%` }}
                  ></div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(tournament)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Edit Tournament"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleMarkCompleted(tournament._id)}
                    className="text-green-600 hover:text-green-900"
                    title="Mark as Completed"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tournament._id)}
                    className="text-red-600 hover:text-red-900"
                    title="Permanently Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tournament Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingTournament ? 'Edit Tournament' : 'Create Tournament'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.title ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {formErrors.startDate && <p className="text-red-500 text-sm mt-1">{formErrors.startDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {formErrors.endDate && <p className="text-red-500 text-sm mt-1">{formErrors.endDate}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.venue ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {formErrors.venue && <p className="text-red-500 text-sm mt-1">{formErrors.venue}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Teams</label>
                  <input
                    type="number"
                    name="maxTeams"
                    value={formData.maxTeams}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.maxTeams ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {formErrors.maxTeams && <p className="text-red-500 text-sm mt-1">{formErrors.maxTeams}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Fee (₹)</label>
                  <input
                    type="number"
                    name="registrationFee"
                    value={formData.registrationFee}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prize Pool (₹)</label>
                <input
                  type="number"
                  name="prizePool"
                  value={formData.prizePool}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Deadline</label>
                <input
                  type="date"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                  <select
                    name="format"
                    value={formData.format}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="t20">T20</option>
                    <option value="odi">ODI</option>
                    <option value="test">Test</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
                >
                  {editingTournament ? 'Update Tournament' : 'Create Tournament'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 font-medium"
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

export default TournamentManagement;
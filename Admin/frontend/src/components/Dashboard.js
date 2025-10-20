import React, { useState, useEffect } from 'react';
import { Users, Trophy, Calendar, DollarSign } from 'lucide-react';
import { userAPI, tournamentAPI, matchAPI, healthCheck } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTournaments: 0,
    totalMatches: 0,
    totalRevenue: 0
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check API health
        try {
          await healthCheck();
        } catch (error) {
          console.error('API health check failed:', error);
        }

        // Fetch users
        const users = await userAPI.getAllUsers();
        setStats(prev => ({
          ...prev,
          totalUsers: users.length
        }));

        // Fetch tournaments
        const tournaments = await tournamentAPI.getAllTournaments();
        const activeTournaments = tournaments.filter(t => t.status === 'active');
        setStats(prev => ({
          ...prev,
          activeTournaments: activeTournaments.length
        }));

        // Fetch matches
        const matches = await matchAPI.getAllMatches();
        setStats(prev => ({
          ...prev,
          totalMatches: matches.length
        }));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users
    },
    {
      title: 'Active Tournaments',
      value: stats.activeTournaments,
      icon: Trophy
    },
    {
      title: 'Total Matches',
      value: stats.totalMatches,
      icon: Calendar
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;

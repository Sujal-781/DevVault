import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, CheckCircle, Star, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const stats = [
    {
      title: 'Claimed Issues',
      value: user.claimedIssues,
      icon: Briefcase,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Completed Issues',
      value: user.completedIssues,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10 border-green-500/20',
    },
    {
      title: 'Total XP',
      value: user.totalXP,
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10 border-yellow-500/20',
    },
    {
      title: 'Success Rate',
      value: user.claimedIssues > 0 ? Math.round((user.completedIssues / user.claimedIssues) * 100) : 0,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
      suffix: '%',
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleIcon = (role: string) => {
    return role === 'Developer' ? '👨‍💻' : '🔧';
  };

  const handleBrowseIssues = () => {
    navigate('/issues');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {getGreeting()}, {user.name}! {getRoleIcon(user.role)}
                </h1>
                <p className="text-gray-300">
                  Welcome back to your DevVault dashboard. Ready to tackle some issues?
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-300">Role</p>
                  <div className="flex items-center mt-1">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      user.role === 'Developer' ? 'bg-blue-400' : 'bg-green-400'
                    }`}></div>
                    <span className="text-lg font-semibold text-white">{user.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className={`${stat.bgColor} backdrop-blur-sm border rounded-xl p-6 hover:scale-105 transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    {stat.value}{stat.suffix || ''}
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-300">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Overview */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center mb-6">
              <Award className="h-6 w-6 text-yellow-400 mr-3" />
              <h2 className="text-xl font-semibold text-white">Performance Overview</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">Issues Completed</span>
                  <span className="text-sm text-gray-400">
                    {user.completedIssues} / {user.claimedIssues}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${user.claimedIssues > 0 ? (user.completedIssues / user.claimedIssues) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">XP Progress</span>
                  <span className="text-sm text-gray-400">{user.totalXP} XP</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((user.totalXP / 1000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
            
            <div className="space-y-4">
              <button 
                onClick={handleBrowseIssues}
                className="w-full p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 text-left group"
              >
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-blue-400 mr-3 group-hover:scale-110 transition-transform duration-200" />
                  <div>
                    <p className="font-medium text-white">Browse Available Issues</p>
                    <p className="text-sm text-gray-400">Find new challenges to work on</p>
                  </div>
                </div>
              </button>

              <button className="w-full p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-200 text-left group">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 group-hover:scale-110 transition-transform duration-200" />
                  <div>
                    <p className="font-medium text-white">View My Claimed Issues</p>
                    <p className="text-sm text-gray-400">Track your current work</p>
                  </div>
                </div>
              </button>

              <button className="w-full p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200 text-left group">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-purple-400 mr-3 group-hover:scale-110 transition-transform duration-200" />
                  <div>
                    <p className="font-medium text-white">Update Profile</p>
                    <p className="text-sm text-gray-400">Manage your account settings</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
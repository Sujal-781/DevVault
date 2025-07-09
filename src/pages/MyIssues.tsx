import React, { useState, useEffect } from 'react';
import { Briefcase, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Issue } from '../types';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { IssueCard } from '../components/IssueCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const MyIssues: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unclaimingIssues, setUnclaimingIssues] = useState<Set<string>>(new Set());
  const [completingIssues, setCompletingIssues] = useState<Set<string>>(new Set());

  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      fetchMyIssues();
    }
  }, [isLoggedIn]);

  const fetchMyIssues = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getMyIssues();
      setIssues(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch your issues');
    } finally {
      setLoading(false);
    }
  };

  const handleUnclaimIssue = async (issueId: string) => {
    try {
      setUnclaimingIssues(prev => new Set(prev).add(issueId));
      
      const updatedIssue = await api.unclaimIssue(issueId);
      
      // Remove the issue from the list since it's no longer claimed by the user
      setIssues(prev => prev.filter(issue => issue.id !== issueId));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unclaim issue');
    } finally {
      setUnclaimingIssues(prev => {
        const newSet = new Set(prev);
        newSet.delete(issueId);
        return newSet;
      });
    }
  };

  const handleCompleteIssue = async (issueId: string) => {
    try {
      setCompletingIssues(prev => new Set(prev).add(issueId));
      
      const updatedIssue = await api.completeIssue(issueId);
      
      // Update the issue in the list to reflect completion
      setIssues(prev => 
        prev.map(issue => 
          issue.id === issueId 
            ? { ...updatedIssue, status: 'COMPLETED' }
            : issue
        )
      );
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete issue');
    } finally {
      setCompletingIssues(prev => {
        const newSet = new Set(prev);
        newSet.delete(issueId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'IN_PROGRESS':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'CLAIMED':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-3 w-3" />;
      case 'IN_PROGRESS':
        return <Clock className="h-3 w-3" />;
      case 'CLAIMED':
        return <Briefcase className="h-3 w-3" />;
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-400">Please log in to view your claimed issues.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-400 mt-4">Loading your issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Claimed Issues</h1>
              <p className="text-gray-400">
                Track your progress on claimed GitHub issues
              </p>
            </div>
            <button
              onClick={fetchMyIssues}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <Briefcase className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Claimed Issues</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {issues.filter(issue => issue.status !== 'COMPLETED').length}
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Completed Issues</p>
                <p className="text-2xl font-bold text-green-400">
                  {issues.filter(issue => issue.status === 'COMPLETED').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total XP Earned</p>
                <p className="text-2xl font-bold text-blue-400">
                  {issues
                    .filter(issue => issue.status === 'COMPLETED')
                    .reduce((total, issue) => total + issue.reward, 0)}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="text-sm">{error}</span>
            <button
              onClick={fetchMyIssues}
              className="ml-auto px-3 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 rounded border border-red-500/30 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* Issues List */}
        {issues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <div key={issue.id} className="relative">
                {/* Status Badge */}
                <div className="absolute top-2 right-2 z-10">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${getStatusColor(issue.status)}`}>
                    {getStatusIcon(issue.status)}
                    <span className="ml-1">
                      {issue.status === 'COMPLETED' ? 'Completed' : 
                       issue.status === 'IN_PROGRESS' ? 'In Progress' : 'Claimed'}
                    </span>
                  </span>
                </div>

                {/* Custom Issue Card for My Issues */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-500/30 hover:bg-gray-800/70 transition-all duration-300 group h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4 pr-20">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-200 break-words line-clamp-2">
                        {issue.title}
                      </h3>
                      <div className="max-h-20 overflow-hidden">
                        <p className="text-sm text-gray-400 break-words line-clamp-3">
                          {issue.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Repository */}
                  <div className="text-sm text-gray-400 mb-4 break-words">
                    <span className="font-medium">{issue.repository}</span>
                  </div>

                  {/* Labels */}
                  {issue.labels && issue.labels.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 max-h-16 overflow-hidden">
                      {issue.labels.slice(0, 3).map((label) => (
                        <span
                          key={label}
                          className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded-md border border-gray-600/50 break-words"
                        >
                          {label}
                        </span>
                      ))}
                      {issue.labels.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{issue.labels.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Spacer */}
                  <div className="flex-1"></div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700 mt-auto">
                    <div className="flex items-center space-x-3">
                      {/* Difficulty Badge */}
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${
                        issue.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        issue.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        <Clock className="h-3 w-3 mr-1" />
                        {issue.difficulty}
                      </span>

                      {/* Reward */}
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-yellow-400 font-medium">{issue.reward} XP</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      {issue.status !== 'COMPLETED' && (
                        <>
                          <button
                            onClick={() => handleCompleteIssue(issue.id)}
                            disabled={completingIssues.has(issue.id)}
                            className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-md border border-green-500/30 hover:bg-green-500/30 transition-all duration-200"
                          >
                            {completingIssues.has(issue.id) ? 'Completing...' : 'Complete'}
                          </button>
                          <button
                            onClick={() => handleUnclaimIssue(issue.id)}
                            disabled={unclaimingIssues.has(issue.id)}
                            className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-md border border-red-500/30 hover:bg-red-500/30 transition-all duration-200"
                          >
                            {unclaimingIssues.has(issue.id) ? 'Unclaiming...' : 'Unclaim'}
                          </button>
                        </>
                      )}
                      <a
                        href={issue.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-md border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No Issues Message */
          <div className="text-center py-12">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Claimed Issues</h3>
              <p className="text-gray-400 mb-4">
                You haven't claimed any issues yet. Start by browsing available issues!
              </p>
              <a
                href="/issues"
                className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                Browse Issues
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
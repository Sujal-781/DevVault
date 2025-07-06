import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertCircle } from 'lucide-react';
import { Issue } from '../types';
import { api } from '../services/api';
import { IssueCard } from '../components/IssueCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Issues: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [claimingIssues, setClaimingIssues] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getIssues();
      setIssues(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimIssue = async (issueId: string) => {
    try {
      setClaimingIssues(prev => new Set(prev).add(issueId));
      const updatedIssue = await api.claimIssue(issueId);
      
      // Update the local state with the updated issue
      setIssues(prev => 
        prev.map(issue => 
          issue.id === issueId ? { ...updatedIssue, claimed: true } : issue
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim issue');
    } finally {
      setClaimingIssues(prev => {
        const newSet = new Set(prev);
        newSet.delete(issueId);
        return newSet;
      });
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.repository.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = difficultyFilter === 'All' || issue.difficulty === difficultyFilter;
    
    return matchesSearch && matchesDifficulty;
  });

  const availableIssues = filteredIssues.filter(issue => !issue.claimed);
  const claimedIssues = filteredIssues.filter(issue => issue.claimed);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Issue Marketplace</h1>
          <p className="text-gray-400">
            Discover and claim GitHub issues to earn XP and build your reputation
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                  placeholder="Search issues, repositories, or descriptions..."
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="md:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white appearance-none transition-all duration-200"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>
                <span className="font-medium text-green-400">{availableIssues.length}</span> Available
              </span>
              <span>
                <span className="font-medium text-gray-300">{claimedIssues.length}</span> Claimed
              </span>
              <span>
                <span className="font-medium text-blue-400">{filteredIssues.length}</span> Total
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="text-sm">{error}</span>
            <button
              onClick={fetchIssues}
              className="ml-auto px-3 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 rounded border border-red-500/30 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* Available Issues */}
        {availableIssues.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Available Issues</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onClaim={handleClaimIssue}
                  claiming={claimingIssues.has(issue.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Claimed Issues */}
        {claimedIssues.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Claimed Issues</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {claimedIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onClaim={handleClaimIssue}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredIssues.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 max-w-md mx-auto">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Issues Found</h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search terms or filters to find more issues.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setDifficultyFilter('All');
                }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertCircle, Github, RefreshCw } from 'lucide-react';
import { Issue } from '../types';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { IssueCard } from '../components/IssueCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Issues: React.FC = () => {
  const [backendIssues, setBackendIssues] = useState<Issue[]>([]);
  const [githubIssues, setGithubIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [githubLoading, setGithubLoading] = useState(false);
  const [error, setError] = useState('');
  const [githubError, setGithubError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All'); // 'All', 'Backend', 'GitHub'
  const [claimingIssues, setClaimingIssues] = useState<Set<string>>(new Set());

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      fetchBackendIssues();
      fetchGitHubIssues('facebook', 'react'); // Default repository
    }
  }, [isLoggedIn]);

  const fetchBackendIssues = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.fetchAvailableIssues();
      setBackendIssues(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch backend issues');
    } finally {
      setLoading(false);
    }
  };

  const fetchGitHubIssues = async (owner: string, repo: string) => {
    try {
      setGithubLoading(true);
      setGithubError('');
      const data = await api.fetchGitHubIssues(owner, repo);
      setGithubIssues(data);
    } catch (err) {
      setGithubError(err instanceof Error ? err.message : 'Failed to fetch GitHub issues');
    } finally {
      setGithubLoading(false);
    }
  };

  const handleRefreshGitHub = () => {
    fetchGitHubIssues('facebook', 'react');
  };

  const handleClaimIssue = async (issueId: string) => {
    try {
      setClaimingIssues(prev => new Set(prev).add(issueId));
      
      // Check if it's a backend issue (can be claimed) or GitHub issue (cannot be claimed yet)
      const isBackendIssue = backendIssues.some(issue => issue.id === issueId);
      
      if (isBackendIssue) {
        const updatedIssue = await api.claimIssue(issueId);
        
        // Update the local state with the updated issue
        setBackendIssues(prev => 
          prev.map(issue => 
            issue.id === issueId ? { ...updatedIssue, claimed: true } : issue
          )
        );
      } else {
        // For GitHub issues, show a message that they need to be imported first
        setGithubError('GitHub issues need to be imported to the platform before they can be claimed.');
      }
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

  // Combine and filter issues based on source filter
  const getAllIssues = () => {
    let allIssues: Issue[] = [];
    
    switch (sourceFilter) {
      case 'Backend':
        allIssues = backendIssues;
        break;
      case 'GitHub':
        allIssues = githubIssues;
        break;
      default: // 'All'
        allIssues = [...backendIssues, ...githubIssues];
        break;
    }
    
    return allIssues;
  };

  // Filter for only unclaimed and open issues
  const availableIssues = getAllIssues().filter(issue => 
    issue.claimedByUserId === null && 
    (issue.status === 'OPEN' || !issue.status) // Handle cases where status might be undefined
  );

  const filteredIssues = availableIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.repository.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = difficultyFilter === 'All' || issue.difficulty === difficultyFilter;
    
    return matchesSearch && matchesDifficulty;
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-400">Please log in to view available issues.</p>
        </div>
      </div>
    );
  }

  if (loading && githubLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-400 mt-4">Loading issues from multiple sources...</p>
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
              <h1 className="text-3xl font-bold text-white mb-2">Issue Marketplace</h1>
              <p className="text-gray-400">
                Discover and claim GitHub issues to earn XP and build your reputation
              </p>
            </div>
            <button
              onClick={handleRefreshGitHub}
              disabled={githubLoading}
              className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${githubLoading ? 'animate-spin' : ''}`} />
              Refresh GitHub
            </button>
          </div>
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

            {/* Source Filter */}
            <div className="md:w-48">
              <div className="relative">
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white appearance-none transition-all duration-200"
                >
                  <option value="All">All Sources</option>
                  <option value="Backend">Platform Issues</option>
                  <option value="GitHub">GitHub Issues</option>
                </select>
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
                <span className="font-medium text-green-400">{filteredIssues.length}</span> Available
              </span>
              <span>
                <span className="font-medium text-blue-400">{backendIssues.length}</span> Platform
              </span>
              <span>
                <span className="font-medium text-purple-400">{githubIssues.length}</span> GitHub
              </span>
            </div>
            {githubLoading && (
              <div className="flex items-center text-sm text-gray-400">
                <LoadingSpinner size="sm" className="mr-2" />
                Loading GitHub issues...
              </div>
            )}
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-6 flex items-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="text-sm">{error}</span>
            <button
              onClick={fetchBackendIssues}
              className="ml-auto px-3 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 rounded border border-red-500/30 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        )}

        {githubError && (
          <div className="mb-6 flex items-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400">
            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="text-sm">{githubError}</span>
            <button
              onClick={() => setGithubError('')}
              className="ml-auto px-3 py-1 text-xs bg-yellow-500/20 hover:bg-yellow-500/30 rounded border border-yellow-500/30 transition-colors duration-200"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Available Issues */}
        {filteredIssues.length > 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Available Issues</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIssues.map((issue) => (
                <div key={issue.id} className="relative">
                  <IssueCard
                    issue={issue}
                    onClaim={handleClaimIssue}
                    claiming={claimingIssues.has(issue.id)}
                  />
                  {/* GitHub Issue Badge */}
                  {githubIssues.some(gi => gi.id === issue.id) && (
                    <div className="absolute top-2 right-2 bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-md border border-purple-500/30">
                      <Github className="h-3 w-3 inline mr-1" />
                      GitHub
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* No Issues Available Message */
          <div className="text-center py-12">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 max-w-md mx-auto">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  {githubIssues.length === 0 && backendIssues.length === 0 ? (
                    <Github className="h-8 w-8 text-gray-400" />
                  ) : (
                    <Search className="h-8 w-8 text-gray-400" />
                  )}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {githubIssues.length === 0 && backendIssues.length === 0
                  ? 'No issues found on GitHub.'
                  : searchTerm || difficultyFilter !== 'All' || sourceFilter !== 'All'
                  ? 'No Issues Found' 
                  : 'No Available Issues'
                }
              </h3>
              <p className="text-gray-400 mb-4">
                {githubIssues.length === 0 && backendIssues.length === 0
                  ? 'Failed to load issues from GitHub. Please try again later.'
                  : searchTerm || difficultyFilter !== 'All' || sourceFilter !== 'All'
                  ? 'Try adjusting your search terms or filters to find more issues.'
                  : 'No available issues right now. Check back soon!'
                }
              </p>
              {(searchTerm || difficultyFilter !== 'All' || sourceFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setDifficultyFilter('All');
                    setSourceFilter('All');
                  }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
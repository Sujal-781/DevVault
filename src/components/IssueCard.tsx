import React from 'react';
import { Issue } from '../types';
import { ExternalLink, Clock, Star, AlertCircle } from 'lucide-react';

interface IssueCardProps {
  issue: Issue;
  onClaim?: (issueId: string) => void;
  onUnclaim?: (issueId: string) => void;
  claiming?: boolean;
  showActions?: boolean;
}

export const IssueCard: React.FC<IssueCardProps> = ({ 
  issue, 
  onClaim, 
  onUnclaim, 
  claiming = false,
  showActions = true 
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return <Clock className="h-3 w-3" />;
      case 'Medium':
        return <Star className="h-3 w-3" />;
      case 'Hard':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-500/30 hover:bg-gray-800/70 transition-all duration-300 group flex flex-col h-full min-h-[400px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors duration-200 break-words leading-tight">
            <span className="line-clamp-2">{issue.title}</span>
          </h3>
          
          {/* Fixed height description container with fade effect */}
          <div className="relative h-20 overflow-hidden">
            <p className="text-sm text-gray-400 break-words leading-relaxed">
              {issue.description}
            </p>
            {/* Fade gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-800/50 to-transparent pointer-events-none"></div>
          </div>
        </div>
        
        <a
          href={issue.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Repository */}
      <div className="mb-4">
        <span className="text-sm text-gray-400 font-medium truncate block">
          {issue.repository}
        </span>
      </div>

      {/* Labels - Fixed height container */}
      <div className="mb-4 h-16 overflow-hidden">
        {issue.labels && issue.labels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {issue.labels.slice(0, 4).map((label) => (
              <span
                key={label}
                className="inline-block px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded-md border border-gray-600/50 truncate max-w-[120px]"
                title={label}
              >
                {label}
              </span>
            ))}
            {issue.labels.length > 4 && (
              <span className="inline-block px-2 py-1 text-xs text-gray-400 bg-gray-700/30 rounded-md border border-gray-600/30">
                +{issue.labels.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Spacer to push footer to bottom */}
      <div className="flex-grow"></div>

      {/* Footer - Always at bottom */}
      <div className="mt-auto pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Difficulty Badge */}
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${getDifficultyColor(issue.difficulty)}`}>
              {getDifficultyIcon(issue.difficulty)}
              <span className="ml-1">{issue.difficulty}</span>
            </span>

            {/* Reward */}
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-yellow-400 font-medium">{issue.reward} XP</span>
            </div>
          </div>

          {/* Action Button */}
          {showActions && (
            <div className="flex-shrink-0">
              {!issue.claimed ? (
                onClaim && (
                  <button
                    onClick={() => onClaim(issue.id)}
                    disabled={claiming}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 whitespace-nowrap"
                  >
                    {claiming ? 'Claiming...' : 'Claim Issue'}
                  </button>
                )
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-md border border-green-500/30 whitespace-nowrap">
                    Claimed
                  </span>
                  {onUnclaim && (
                    <button
                      onClick={() => onUnclaim(issue.id)}
                      disabled={claiming}
                      className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-md border border-red-500/30 hover:bg-red-500/30 transition-all duration-200 whitespace-nowrap"
                    >
                      Unclaim
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
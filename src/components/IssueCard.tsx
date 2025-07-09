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
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-500/30 hover:bg-gray-800/70 transition-all duration-300 group h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
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
        
        <a
          href={issue.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200 flex-shrink-0"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
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

      {/* Spacer to push footer to bottom */}
      <div className="flex-1"></div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700 mt-auto">
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
          <>
            {!issue.claimed ? (
              onClaim && (
                <button
                  onClick={() => onClaim(issue.id)}
                  disabled={claiming}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {claiming ? 'Claiming...' : 'Claim Issue'}
                </button>
              )
            ) : (
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-md border border-green-500/30">
                  Claimed
                </span>
                {onUnclaim && (
                  <button
                    onClick={() => onUnclaim(issue.id)}
                    disabled={claiming}
                    className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-md border border-red-500/30 hover:bg-red-500/30 transition-all duration-200"
                  >
                    Unclaim
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
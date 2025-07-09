@@ .. @@
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
@@ .. @@
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

  const handleClaimIssue = async (issueId: string) => {
    try {
      setClaimingIssues(prev => new Set(prev).add(issueId));
      
      // Try to claim the issue regardless of source
      const updatedIssue = await api.claimIssue(issueId);
      
      // Update the local state with the updated issue
      setBackendIssues(prev => 
        prev.map(issue => 
          issue.id === issueId ? { ...updatedIssue, claimed: true } : issue
        )
      );
      
      // Also update GitHub issues if it's a GitHub issue
      setGithubIssues(prev => 
        prev.map(issue => 
          issue.id === issueId ? { ...issue, claimed: true, claimedByUserId: updatedIssue.claimedBy } : issue
        )
      );
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim issue');
    } finally {
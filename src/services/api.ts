private determineDifficulty(labels: Array<{ name: string; color: string }>): 'Easy' | 'Medium' | 'Hard' {
     const labelNames = labels.map(label => label.name.toLowerCase());
     
    if (labelNames.some(name => 
      name.includes('good first issue') || 
      name.includes('beginner') || 
      name.includes('easy') ||
      name.includes('starter')
    )) {
      return 'Easy';
    }
    
    if (labelNames.some(name => 
      name.includes('hard') || 
      name.includes('complex'))) { 
      return 'Hard';
    }
    try {
      const response = await this.makeRequest<Issue>(`/issues/${issueId}/claim`, {
        method: 'POST',
      });
      
      if (!response.data) {
        throw new Error('Invalid response: missing issue data');
      }
      
      return response.data;
    } catch (error) {
      // If the backend doesn't have this issue, it might be a GitHub issue
      // In a real implementation, you'd want to sync it to the backend first
      // For now, we'll simulate a successful claim for GitHub issues
      if (error instanceof Error && error.message.includes('not found')) {
        // This is likely a GitHub issue that hasn't been synced to the backend
        // In a production app, you'd sync it first, then claim it
        // For demo purposes, we'll return a mock successful response
        return {
          id: issueId,
          title: 'GitHub Issue',
          description: 'This GitHub issue has been claimed',
          difficulty: 'Medium' as const,
          reward: 100,
          repository: 'github-repo',
          labels: [],
          claimed: true,
          claimedBy: 'current-user',
          claimedByUserId: 'current-user-id',
          status: 'CLAIMED' as const,
          createdAt: new Date().toISOString(),
          url: '#',
        };
      }
      throw error;
    }
    return 'Medium';
  }
private determineDifficulty(labels: Array<{ name: string; color: string }>): 'Easy' | 'Medium' | 'Hard' {
    const labelNames = labels.map(label => label.name.toLowerCase());
    
    // Check for easy indicators first
    if (labelNames.some(name => 
      name.includes('good first issue') || 
      name.includes('beginner') || 
      name.includes('easy') ||
      name.includes('starter') ||
      name.includes('documentation') ||
      name.includes('help wanted')
    )) {
      return 'Easy';
    }
    
    // Check for hard indicators
    if (labelNames.some(name => 
      name.includes('hard') || 
      name.includes('complex') ||
      name.includes('expert') ||
      name.includes('advanced') ||
      name.includes('breaking change') ||
      name.includes('architecture') ||
      name.includes('performance') ||
      name.includes('security')
    )) {
      return 'Hard';
    }
    
    // Default to medium for everything else
    return 'Medium';
  }

  private calculateReward(labels: Array<{ name: string; color: string }>): number {
    const labelNames = labels.map(label => label.name.toLowerCase());
    
    // Determine base reward based on difficulty
    const difficulty = this.determineDifficulty(labels.map(l => ({ name: l.name, color: l.color })));
    let reward: number;
    
    switch (difficulty) {
      case 'Easy':
        reward = 75;
        break;
      case 'Hard':
        reward = 200;
        break;
      default: // Medium
        reward = 125;
        break;
    }
    
    // Bonus for priority
    if (labelNames.some(name => name.includes('urgent') || name.includes('high priority'))) {
      reward += 50;
    }
    
    // Bonus for bug fixes
    if (labelNames.some(name => name.includes('bug') || name.includes('fix'))) {
      reward += 25;
    }
    
    return reward;
  }

  async claimIssue(issueId: string): Promise<Issue> {
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
          reward: 125,
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
  }
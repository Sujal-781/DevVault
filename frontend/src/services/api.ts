import { LoginRequest, RegisterRequest, AuthResponse, User, Issue, ApiResponse } from '../types';
import { getToken } from './auth';

const API_BASE_URL = 'http://localhost:8080/api';

// GitHub API configuration
const GITHUB_API_BASE_URL = 'https://api.github.com';
// TODO: Add your GitHub token here for higher rate limits (5000 requests/hour vs 60)
// const GITHUB_TOKEN = 'your_github_token_here';

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  labels: Array<{
    name: string;
    color: string;
  }>;
  user: {
    login: string;
    avatar_url: string;
  };
  pull_request?: any; // If this exists, it's a PR, not an issue
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = getToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      // Parse response as JSON
      const data: ApiResponse<T> = await response.json();
      
      // Check if the HTTP response was successful
      if (!response.ok) {
        // Use the message from the API response if available
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      // Check if the backend response indicates failure
      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      // Handle network errors or JSON parsing errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  }

  // GitHub API Methods
  async fetchGitHubIssues(owner: string, repo: string): Promise<Issue[]> {
    try {
      const headers: HeadersInit = {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'DevVault-App',
      };

      // Uncomment and add your GitHub token for higher rate limits
      // if (GITHUB_TOKEN) {
      //   headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
      // }

      const response = await fetch(
        `${GITHUB_API_BASE_URL}/repos/${owner}/${repo}/issues?state=open&per_page=50`,
        { headers }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Repository ${owner}/${repo} not found`);
        }
        if (response.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please try again later.');
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const githubIssues: GitHubIssue[] = await response.json();

      // Filter out pull requests and convert to our Issue format
      const issues: Issue[] = githubIssues
        .filter(issue => !issue.pull_request) // Remove pull requests
        .map(issue => ({
          id: issue.id.toString(),
          title: issue.title,
          description: issue.body || 'No description provided',
          difficulty: this.determineDifficulty(issue.labels),
          reward: this.calculateReward(issue.labels),
          repository: repo,
          labels: issue.labels.map(label => label.name),
          claimed: false,
          claimedBy: undefined,
          claimedByUserId: null,
          status: 'OPEN',
          createdAt: issue.created_at,
          url: issue.html_url,
        }));

      return issues;
    } catch (error) {
      console.error('Error fetching GitHub issues:', error);
      throw error;
    }
  }

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
      name.includes('complex') || 
      name.includes('expert') ||
      name.includes('advanced')
    )) {
      return 'Hard';
    }
    
    return 'Medium';
  }

  private calculateReward(labels: Array<{ name: string; color: string }>): number {
    const labelNames = labels.map(label => label.name.toLowerCase());
    
    // Base reward
    let reward = 100;
    
    // Bonus for difficulty
    if (labelNames.some(name => name.includes('good first issue') || name.includes('easy'))) {
      reward = 75;
    } else if (labelNames.some(name => name.includes('hard') || name.includes('complex'))) {
      reward = 200;
    }
    
    // Bonus for priority
    if (labelNames.some(name => name.includes('high priority') || name.includes('urgent'))) {
      reward += 50;
    }
    
    // Bonus for bug fixes
    if (labelNames.some(name => name.includes('bug'))) {
      reward += 25;
    }
    
    return reward;
  }

  // Existing backend API methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Ensure we have the data and it contains token
    if (!response.data || !response.data.token) {
      throw new Error('Invalid response: missing authentication data');
    }
    
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Ensure we have the data and it contains token
    if (!response.data || !response.data.token) {
      throw new Error('Invalid response: missing authentication data');
    }
    
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.makeRequest<User>('/auth/me');
    
    if (!response.data) {
      throw new Error('Invalid response: missing user data');
    }
    
    return response.data;
  }

  async getIssues(): Promise<Issue[]> {
    const response = await this.makeRequest<Issue[]>('/issues');
    
    if (!response.data) {
      throw new Error('Invalid response: missing issues data');
    }
    
    return response.data;
  }

  async fetchAvailableIssues(): Promise<Issue[]> {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await this.makeRequest<Issue[]>('/issues', {
      method: 'GET',
    });
    
    if (!response.data) {
      throw new Error('Invalid response: missing issues data');
    }
    
    return response.data;
  }

  async getAvailableIssues(): Promise<Issue[]> {
    const response = await this.makeRequest<Issue[]>('/issues/available');
    
    if (!response.data) {
      throw new Error('Invalid response: missing issues data');
    }
    
    return response.data;
  }

  async getMyIssues(): Promise<Issue[]> {
    const response = await this.makeRequest<Issue[]>('/issues/my-issues');
    
    if (!response.data) {
      throw new Error('Invalid response: missing issues data');
    }
    
    return response.data;
  }

  async claimIssue(issueId: string): Promise<Issue> {
    const response = await this.makeRequest<Issue>(`/issues/${issueId}/claim`, {
      method: 'POST',
    });
    
    if (!response.data) {
      throw new Error('Invalid response: missing issue data');
    }
    
    return response.data;
  }

  async unclaimIssue(issueId: string): Promise<Issue> {
    const response = await this.makeRequest<Issue>(`/issues/${issueId}/unclaim`, {
      method: 'POST',
    });
    
    if (!response.data) {
      throw new Error('Invalid response: missing issue data');
    }
    
    return response.data;
  }

  async completeIssue(issueId: string): Promise<Issue> {
    const response = await this.makeRequest<Issue>(`/issues/${issueId}/complete`, {
      method: 'POST',
    });
    
    if (!response.data) {
      throw new Error('Invalid response: missing issue data');
    }
    
    return response.data;
  }
}

export const api = new ApiService();
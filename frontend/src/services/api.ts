import { LoginRequest, LoginResponse, User, Issue, ApiResponse } from '../types';
import { getToken, setToken } from './auth';

// Mock users for demo
const MOCK_USERS = [
  {
    id: '1',
    email: 'dev@example.com',
    name: 'John Developer',
    role: 'developer' as const,
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    githubUsername: 'johndev',
    skills: ['React', 'TypeScript', 'Node.js'],
    reputation: 850
  },
  {
    id: '2',
    email: 'maintainer@example.com',
    name: 'Sarah Maintainer',
    role: 'maintainer' as const,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    githubUsername: 'sarahmaint',
    skills: ['JavaScript', 'Python', 'Docker'],
    reputation: 1200
  }
];

// Mock issues for demo
const MOCK_ISSUES: Issue[] = [
  {
    id: '1',
    title: 'Add dark mode toggle to navigation',
    description: 'Implement a dark mode toggle in the main navigation bar with smooth transitions and persistent user preference storage.',
    repository: 'awesome-ui-lib',
    owner: 'techcorp',
    labels: ['enhancement', 'good first issue'],
    difficulty: 'beginner',
    bounty: 150,
    status: 'open',
    createdAt: '2024-01-15T10:30:00Z',
    claimedBy: null,
    estimatedHours: 8
  },
  {
    id: '2',
    title: 'Fix memory leak in WebSocket connection',
    description: 'There\'s a memory leak occurring when WebSocket connections are not properly cleaned up on component unmount.',
    repository: 'realtime-chat',
    owner: 'startupxyz',
    labels: ['bug', 'high priority'],
    difficulty: 'intermediate',
    bounty: 300,
    status: 'open',
    createdAt: '2024-01-14T14:20:00Z',
    claimedBy: null,
    estimatedHours: 12
  },
  {
    id: '3',
    title: 'Implement OAuth2 authentication flow',
    description: 'Add support for OAuth2 authentication with Google, GitHub, and Microsoft providers including proper error handling and token refresh.',
    repository: 'auth-service',
    owner: 'enterprise-solutions',
    labels: ['feature', 'security'],
    difficulty: 'advanced',
    bounty: 500,
    status: 'open',
    createdAt: '2024-01-13T09:15:00Z',
    claimedBy: null,
    estimatedHours: 20
  }
];

class ApiService {
  private async mockDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private createResponse<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data,
      message: 'Success'
    };
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    await this.mockDelay();
    
    const user = MOCK_USERS.find(u => u.email === credentials.email);
    
    if (!user || credentials.password !== 'password123') {
      throw new Error('Invalid email or password');
    }

    const token = `mock-token-${user.id}-${Date.now()}`;
    const response: LoginResponse = {
      token,
      user
    };

    return response;
  }

  async getCurrentUser(): Promise<User> {
    await this.mockDelay(200);
    
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Extract user ID from mock token
    const userId = token.split('-')[2];
    const user = MOCK_USERS.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getIssues(): Promise<Issue[]> {
    await this.mockDelay(300);
    
    // Return a copy of mock issues to prevent mutations
    return JSON.parse(JSON.stringify(MOCK_ISSUES));
  }

  async claimIssue(issueId: string): Promise<void> {
    await this.mockDelay(400);
    
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    // Extract user ID from mock token
    const userId = token.split('-')[2];
    const user = MOCK_USERS.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const issue = MOCK_ISSUES.find(i => i.id === issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }

    if (issue.claimedBy) {
      throw new Error('Issue already claimed');
    }

    // Update the mock issue
    issue.claimedBy = user.id;
    issue.status = 'in_progress';
  }
}

export const api = new ApiService();
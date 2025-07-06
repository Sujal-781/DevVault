import { LoginRequest, RegisterRequest, AuthResponse, User, Issue, ApiResponse } from '../types';
import { getToken } from './auth';

const API_BASE_URL = 'http://localhost:8080/api';

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

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      // Try to get error message from response
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      } catch {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data: ApiResponse<T> = await response.json();
    
    // Check if the backend response indicates failure
    if (!data.success) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  }

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
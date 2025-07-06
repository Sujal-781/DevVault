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
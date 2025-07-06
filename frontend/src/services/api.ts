import { LoginRequest, RegisterRequest, AuthResponse, User, Issue, ApiResponse } from '../types';
import { getToken } from './auth';

const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle backend API response format
    if (data.success === false) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data.data || data;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<ApiResponse<AuthResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    return response.data!;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<ApiResponse<AuthResponse>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    return response.data!;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.makeRequest<ApiResponse<User>>('/auth/me');
    return response.data!;
  }

  async getIssues(): Promise<Issue[]> {
    const response = await this.makeRequest<ApiResponse<Issue[]>>('/issues');
    return response.data!;
  }

  async getAvailableIssues(): Promise<Issue[]> {
    const response = await this.makeRequest<ApiResponse<Issue[]>>('/issues/available');
    return response.data!;
  }

  async getMyIssues(): Promise<Issue[]> {
    const response = await this.makeRequest<ApiResponse<Issue[]>>('/issues/my-issues');
    return response.data!;
  }

  async claimIssue(issueId: string): Promise<Issue> {
    const response = await this.makeRequest<ApiResponse<Issue>>(`/issues/${issueId}/claim`, {
      method: 'POST',
    });
    
    return response.data!;
  }

  async unclaimIssue(issueId: string): Promise<Issue> {
    const response = await this.makeRequest<ApiResponse<Issue>>(`/issues/${issueId}/unclaim`, {
      method: 'POST',
    });
    
    return response.data!;
  }

  async completeIssue(issueId: string): Promise<Issue> {
    const response = await this.makeRequest<ApiResponse<Issue>>(`/issues/${issueId}/complete`, {
      method: 'POST',
    });
    
    return response.data!;
  }
}

export const api = new ApiService();
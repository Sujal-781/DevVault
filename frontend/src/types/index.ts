export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Developer' | 'Maintainer';
  claimedIssues: number;
  completedIssues: number;
  totalXP: number;
  reputation: number;
  githubUsername?: string;
  avatar?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  reward: number;
  repository: string;
  labels: string[];
  claimed: boolean;
  claimedBy?: string;
  claimedByUserId?: string | null;
  status?: 'OPEN' | 'CLAIMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
  createdAt: string;
  url: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'DEVELOPER' | 'MAINTAINER';
  githubUsername?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
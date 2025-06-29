export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Developer' | 'Maintainer';
  claimedIssues: number;
  completedIssues: number;
  totalXP: number;
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
  createdAt: string;
  url: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
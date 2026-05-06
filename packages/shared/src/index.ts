export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  traceId?: string;
  timestamp: string;
}

export interface PageQuery {
  page: number;
  pageSize: number;
  keyword?: string;
}

export interface PageResult<T> {
  list: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: {
    id: number;
    username: string;
    roles: string[];
  };
}

export interface BasicEchoResult {
  method: string;
  query?: Record<string, unknown>;
  params?: Record<string, unknown>;
  body?: unknown;
  headers?: Record<string, unknown>;
}

export const API_SUCCESS_CODE = 0;

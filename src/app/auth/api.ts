/**
 * Auth API Service
 * Authentication-related API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: number;
      username: string;
      role_id: number;
      is_active: boolean;
    };
  };
  message: string;
}

export const authAPI = {
  /**
   * Login user with username and password
   * Note: No X-App-Token header for login (user not authenticated yet)
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // No X-App-Token here - user is not authenticated yet
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Login failed: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      return {
        success: false,
        data: {
          token: '',
          user: {
            id: 0,
            username: '',
            role_id: 0,
            is_active: false,
          },
        },
        message: error instanceof Error ? error.message : 'Login failed',
      };
    }
  },
};

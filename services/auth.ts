interface LoginResponse {
  user_id: string;
  token: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SocialLoginInput {
  provider: 'google' | 'facebook' | 'phone';
  id_token: string;
}

interface SignUpCredentials {
  email: string;
  password: string;
}

interface ForgotPasswordInput {
  email: string;
}

const API_URL = 'http://localhost:8080'; // Change this to your server URL

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async signUp(credentials: SignUpCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async socialLogin(input: SocialLoginInput): Promise<LoginResponse> {
    try {
      const endpoint = input.provider === 'google' ? '/auth/google' : '/auth/facebook';
      console.log('Making request to:', `${API_URL}${endpoint}`);
      console.log('Request body:', JSON.stringify({
        id_token: input.id_token
      }, null, 2));
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_token: input.id_token
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.log('Server error response:', error);
        throw new Error(error.error || `${input.provider} login failed`);
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send reset password email');
      }
    } catch (error) {
      throw error;
    }
  },
}; 
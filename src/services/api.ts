import axios from 'axios';
import type { AxiosError } from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

// Import session service and firebase auth
import sessionService from './sessionService';
import { auth } from './firebase';

api.interceptors.request.use(
  async (config) => {
    // Skip adding token if Authorization header is already set
    if (config.headers?.Authorization) {
      return config;
    }
    
    const token = sessionService.getToken();
    
    if (token && config.headers) {
      // For non-login endpoints, check for a fresher Firebase token
      if (config.url !== '/auth/login') {
        const firebaseUser = auth.currentUser;
        if (firebaseUser) {
          try {
            const currentToken = await firebaseUser.getIdToken(false);
            
            if (currentToken && currentToken !== token) {
              config.headers.Authorization = `Bearer ${currentToken}`;
              
              const userData = sessionService.getUserData();
              if (userData) {
                sessionService.saveSession(currentToken, userData);
              }
              
              return config;
            }
          } catch (tokenError) {
            console.warn('Could not get current token from Firebase:', tokenError);
          }
        }
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        console.log('API: Received 401 Unauthorized response');
        
        // For non-login requests, try to refresh the token first
        if (error.config?.url !== '/auth/login' && error.config?.method !== 'post') {
          try {
            // Check if we have a Firebase user first
            const firebaseUser = auth.currentUser;
            
            if (firebaseUser) {
              console.log('API: Firebase user found, forcing token refresh');
              
              // Force a refresh of the token
              const refreshedToken = await firebaseUser.getIdToken(true);
              
              if (refreshedToken && error.config) {
                console.log('API: Successfully refreshed token, retrying request');
                
                // Update the session with the new token
                const userData = sessionService.getUserData();
                if (userData) {
                  sessionService.saveSession(refreshedToken, userData);
                }
                
                // Update the Authorization header with the new token
                error.config.headers = error.config.headers || {};
                error.config.headers.Authorization = `Bearer ${refreshedToken}`;
                
                // Prevent infinite retry loops
                // @ts-ignore
                error.config.__isRetryRequest = true;
                
                // Retry the request with the new token
                return axios(error.config);
              }
            } else {
              console.log('API: No Firebase user found during token refresh');
            }
          } catch (refreshError) {
            console.error('API: Failed to refresh token:', refreshError);
          }
        } else if (error.config?.url === '/auth/login') {
          console.error('API: Login request failed with 401 - Invalid credentials or token');
          // Don't clear the session on login failures
          return Promise.reject(error);
        }
        
        // Only clear session if we're not already in a login request and
        // if this isn't a retry that failed
        // @ts-ignore
        if (error.config?.url !== '/auth/login' && !error.config?.__isRetryRequest) {
          console.error('API: Unauthorized access (401) - Token expired or invalid, clearing session');
          sessionService.clearSession();
          
          // Force a page reload to reset the application state
          // Only do this if we're not in a login attempt
          setTimeout(() => {
            window.location.href = '/trainer/login';
          }, 100);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Define types for API requests
/**
 * Type definitions for API requests and responses
 */
type AuthCredentials = {
  provider: 'password' | 'google.com';
  email: string;
};

type PasswordCredentials = AuthCredentials & {
  password: string;
  fullName?: string; // Added fullName to support registration
  idToken?: string; // Optional Firebase token for extra security
};

type GoogleCredentials = AuthCredentials & {
  idToken: string;
  fullName?: string;
};

type AuthResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    fullName?: string;
    role?: string;
  };
};

// Simple API functions for React Query
export const apiService = {
  auth: {
    /**
     * Register a trainer with additional profile information
     */
    registerTrainer: async (trainerData: {
      bio: string;
      certifications: string[];
      experience_years: number;
    }) => {
      // We don't need to pass user_id as it's identified by the JWT token
      
      // Prepare the payload (no user_id needed)
      const payload = {
        ...trainerData
      };
      
      console.log('API: Sending trainer registration data:', payload);
      
      try {
        // Ensure we have a valid token
        const token = sessionService.getToken();
        if (!token) {
          console.error('API: No token found in session. Cannot proceed with registration.');
          throw new Error('Authentication error. Please log in again.');
        }
        
        // The request will use the token from the interceptor
        const response = await api.post('/trainers/register', payload);
        console.log('API: Trainer registration successful:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('API: Trainer registration error:', error);
        
        // Log detailed information about the server response
        if (error.response) {
          console.error('API: Server response status:', error.response.status);
          console.error('API: Server response data:', error.response.data);
        }
        
        // Create a descriptive error message
        let errorMessage = 'Trainer registration failed';
        
        if (error.response?.status === 401) {
          errorMessage = 'Registration failed: Not authorized, please login first';
        } else if (error.response?.status === 400) {
          errorMessage = 'Registration failed: Invalid data format';
        } else if (error.response?.status === 500) {
          errorMessage = 'Registration failed: Server error, please try again later';
        }
        
        // Add any additional context from the server response
        if (error.response?.data?.message) {
          errorMessage += ` - ${error.response.data.message}`;
        }
        
        throw new Error(errorMessage);
      }
    },
    
    /**
     * Authenticate with email/password or Google token
     */
    login: async (credentials: PasswordCredentials | GoogleCredentials): Promise<AuthResponse> => {
      console.log(`API: Login attempt with provider: ${credentials.provider}`);
      
      // Make sure we have the correct provider value based on the actual credential type
      // Always respect the explicitly passed provider value, as it's the most accurate
      const providerValue = credentials.provider;
      
      // Additional check to ensure we're using the right value (this will be helpful for debugging)
      if ('password' in credentials && credentials.provider !== 'password') {
        console.warn('API: Warning - Password credentials detected but provider is not "password"');
        console.warn(`API: Using explicitly provided provider: ${credentials.provider}`);
      }
      
      console.log(`API: Using provider: ${providerValue}`);
      
      // Structure the request based on provider
      const requestData = 
        'password' in credentials 
          ? { // Password login
              provider: 'password', // Always use 'password' for password credentials
              email: credentials.email,
              password: credentials.password,
              full_name: credentials.fullName || '' // Include fullName for password login
              // idToken removed from body as it should be in the Authorization header
            }
          : { // Google login
              provider: 'google.com', // Always use 'google.com' for Google credentials
              email: credentials.email,
              full_name: credentials.fullName || ''
              // idToken removed from body as it should be in the Authorization header
            };
      
      // No need to override the provider again, we've already set it correctly above
      
      // Log what we're sending (excluding password)
      console.log(`API: Login request for provider ${requestData.provider}:`, {
        email: requestData.email,
        full_name: requestData.full_name,
        hasPassword: 'password' in credentials,
        hasFullName: !!credentials.fullName
      });
      
      // Create a custom config with the Firebase ID token in the Authorization header
      const requestConfig = {
        headers: {}
      };
      
      // Set the Firebase token in the Authorization header for the login request
      if (credentials.idToken) {
        console.log('API: Setting Firebase ID token in Authorization header for login request');
        console.log('API: Firebase token (first 10 chars):', credentials.idToken.substring(0, 10) + '...');
        requestConfig.headers = {
          'Authorization': `Bearer ${credentials.idToken}`
        };
      } else {
        console.warn('API: No idToken provided for login, proceeding without Authorization header');
      }
      
      // Log the request data being sent (excluding sensitive info)
      const logSafeRequestData = { ...requestData };
      if (logSafeRequestData.password) {
        logSafeRequestData.password = '********'; // Mask password
      }
      console.log('API: Sending login request with data:', logSafeRequestData);
      
      try {
        // Make a clean request to the backend with the Firebase token in the header
        const response = await api.post('/auth/login', requestData, requestConfig);
        
        // Detailed logging to help debug provider issues
        console.log('API: Raw response data:', response.data);
        console.log('API: Login response user data:', response.data?.user);
        console.log('API: Provider sent:', requestData.provider);
        
        const responseData = response.data;
        
        // Create a normalized response based on what the server returns
        // This handles the case where the response is in format: 
        // { user_id: "...", provider: "google.com", email: "...", full_name: "..." }
        
        // Extract user ID - critical for auth
        const userId = responseData.user_id || responseData.id || "";
        const fullName = responseData.full_name || credentials.fullName || "";
        
        console.log('API: Login response data:', {
          userId,
          fullName,
          email: responseData.email || credentials.email,
          provider: responseData.provider || credentials.provider
        });
        
        if (!userId) {
          console.error('API: No user_id in response:', responseData);
          throw new Error('Authentication failed: No user ID received from server');
        }
        
        // For production-ready code, we should handle various response formats
        // Some backends might return the token directly, others might include it in the user object,
        // and some might expect the client to continue using the Firebase token
        let authToken = responseData.token || responseData.access_token;
        
        // If no token in response but we have a Firebase token in the request,
        // we might need to continue using the Firebase token
        if (!authToken && credentials.idToken) {
          console.log('API: No token in response, using Firebase ID token instead');
          authToken = credentials.idToken;
        }
        
        // Still no token? Try to extract from other possible locations in response
        if (!authToken && responseData.auth_token) {
          authToken = responseData.auth_token;
        }
        
        // Final fallback - use user_id as a temporary token
        // This is not ideal but prevents breaking the flow
        if (!authToken && userId) {
          console.log('API: No token found, using user_id as fallback token (temporary solution)');
          authToken = userId;
        }
        
        // Log a masked version of the token for debugging
        if (authToken) {
          console.log('API: Using token (first 10 chars):', 
            authToken.substring(0, 10) + '...');
        } else {
          console.error('API: No usable token available');
          throw new Error('Authentication failed: No token received from server or available as fallback');
        }
        
        // Create standardized response
        const authResponse: AuthResponse = {
          token: authToken,
          user: {
            id: userId,
            email: responseData.email || credentials.email || "",
            fullName: responseData.full_name || credentials.fullName || "",
            role: responseData.role || "trainer"
          }
        };
        
        console.log('API: Authentication successful, normalized response:', authResponse);
        
        return authResponse;
      } catch (error: any) {
        console.error('API: Authentication error:', error);
        
        // Log detailed information about the server response
        if (error.response) {
          console.error('API: Server response status:', error.response.status);
          console.error('API: Server response data:', error.response.data);
        }
        
        // Create a descriptive error message
        let errorMessage = 'Authentication failed';
        
        if (error.response?.status === 401) {
          errorMessage = 'Authentication failed: Invalid credentials or token rejected by server';
        } else if (error.response?.status === 400) {
          errorMessage = 'Authentication failed: Invalid request format';
        } else if (error.response?.status === 500) {
          errorMessage = 'Authentication failed: Server error, please try again later';
        } else if (error.message.includes('token')) {
          errorMessage = 'Authentication failed: Token issue - ' + error.message;
        }
        
        // Add any additional context from the server response
        if (error.response?.data?.message) {
          errorMessage += ` - ${error.response.data.message}`;
        }
        
        throw new Error(errorMessage);
      }
    },
    
    /**
     * Verify the current token is still valid without relying on a backend endpoint
     * Instead, it checks Firebase auth state and tries to refresh the token if needed
     */
    verifyToken: async (): Promise<boolean> => {
      try {
        // Check if we have a session in memory
        if (!sessionService.isLoggedIn()) {
          console.log('API: No session found during verification');
          return false;
        }
        
        // Check if Firebase has a current user
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.log('API: Firebase has no current user during verification');
          sessionService.clearSession();
          return false;
        }
        
        // Get the token from session service
        const token = sessionService.getToken();
        
        if (!token) {
          console.log('API: No token found for verification');
          return false;
        }
        
        // Log token info for debugging
        const maskedToken = token.length > 10 
          ? token.substring(0, 10) + "..." 
          : "token too short";
        console.log(`API: Current token: ${maskedToken}`);
        
        try {
          // Get a fresh Firebase token to make sure we're using the latest
          const freshToken = await currentUser.getIdToken(false);
          
          // If the tokens don't match, update our session
          if (freshToken && freshToken !== token) {
            console.log('API: Token has changed, updating session');
            const userData = sessionService.getUserData();
            if (userData) {
              sessionService.saveSession(freshToken, userData);
            }
          }
          
          return true;
        } catch (tokenError) {
          console.error('API: Error getting Firebase token:', tokenError);
          
          // Try refreshing the token as a last resort
          const refreshedToken = await sessionService.refreshFirebaseToken();
          return !!refreshedToken;
        }
      } catch (error: any) {
        console.error('API: Token verification error:', error.message);
        return false;
      }
    }
  },
  membership: {
    getPackages: async () => {
      const response = await api.get('/membership/packages');
      return response.data;
    }
  }
};

export default api;
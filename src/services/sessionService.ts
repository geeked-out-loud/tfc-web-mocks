import { auth } from './firebase';

export const AUTH_TOKEN_KEY = 'tfc_trainer_auth_token';
export const USER_DATA_KEY = 'tfc_trainer_user_data';
export const SESSION_REFRESH_KEY = 'tfc_trainer_last_refresh';

// Session timeout: 8 hours
const SESSION_TIMEOUT_MS = 8 * 60 * 60 * 1000;

// Token refresh interval: 55 minutes (Firebase tokens expire after 1hr)
const TOKEN_REFRESH_INTERVAL_MS = 55 * 60 * 1000;

/** User data type */
export type UserData = {
  id: string;
  email: string;
  fullName?: string;
  role?: string;
};

/** Session Service for auth data management */
const sessionService = {
  /** Store auth data in localStorage */
  saveSession: (token: string, userData: UserData): void => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    
    // Update timestamp
    localStorage.setItem(SESSION_REFRESH_KEY, Date.now().toString());
    
    console.log('Session: Saved new session data');
  },

  /** Clear session data */
  clearSession: (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(SESSION_REFRESH_KEY);
    
    console.log('Session: Cleared all session data');
  },

  /** Get auth token */
  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  /** Get user data */
  getUserData: (): UserData | null => {
    const userData = localStorage.getItem(USER_DATA_KEY);
    if (!userData) {
      return null;
    }
    
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Session: Error parsing user data', error);
      return null;
    }
  },

  /** Check login status */
  isLoggedIn: (): boolean => {
    const token = sessionService.getToken();
    const userData = sessionService.getUserData();
    
    return !!(token && userData);
  },

  /** Update session timestamp */
  refreshSession: (): void => {
    if (sessionService.isLoggedIn()) {
      localStorage.setItem(SESSION_REFRESH_KEY, Date.now().toString());
    }
  },

  /** Check session validity and refresh token if needed */
  isSessionValid: async (): Promise<boolean> => {
    const token = sessionService.getToken();
    const userData = sessionService.getUserData();
    
    if (!token || !userData) {
      console.log('Session: No valid session data found');
      return false;
    }
    
    const lastRefreshStr = localStorage.getItem(SESSION_REFRESH_KEY);
    
    if (lastRefreshStr) {
      const lastRefresh = parseInt(lastRefreshStr, 10);
      const now = Date.now();
      
      if (now - lastRefresh > SESSION_TIMEOUT_MS) {
        console.log('Session: Session has expired due to timeout');
        sessionService.clearSession();
        return false;
      }
      
      // Check if token needs refresh
      if (now - lastRefresh > TOKEN_REFRESH_INTERVAL_MS) {
        console.log('Session: Token might be expiring soon, attempting refresh');
        try {
          const newToken = await sessionService.refreshFirebaseToken();
          if (newToken) {
            console.log('Session: Successfully refreshed token');
          } else {
            console.log('Session: Could not refresh token, continuing with existing token');
          }
        } catch (error) {
          console.error('Session: Error during token refresh:', error);

        }
      }
    }
    
    if (!auth.currentUser) {
      console.log('Session: Firebase has no current user, session invalid');
      return false;
    }
    
    // Refresh timestamp for valid session
    sessionService.refreshSession();
    return true;
  },
  
  /** Refresh Firebase ID token */
  refreshFirebaseToken: async (): Promise<string | null> => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        console.log('Session: No Firebase user found for token refresh');
        return null;
      }
      
      const newToken = await user.getIdToken(true);
      
      if (newToken) {
        const userData = sessionService.getUserData();
        if (userData) {
          sessionService.saveSession(newToken, userData);
          return newToken;
        }
      }
      
      return newToken;
    } catch (error) {
      console.error('Session: Error refreshing Firebase token', error);
      return null;
    }
  },
  
  /** Restore existing session from localStorage and Firebase */
  tryRestoreSession: async (): Promise<boolean> => {
    try {
      if (!sessionService.isLoggedIn()) {
        return false;
      }
      
      const user = auth.currentUser;
      
      if (user) {
        const newToken = await user.getIdToken(true);
        
        if (newToken) {
          const userData = sessionService.getUserData();
          if (userData) {
            sessionService.saveSession(newToken, userData);
            console.log('Session: Successfully restored session with refreshed token');
            return true;
          }
        }
      } else {
        console.log('Session: Found local session but no Firebase user, clearing session');
        sessionService.clearSession();
        return false;
      }
      
      return false;
    } catch (error) {
      console.error('Session: Error restoring session', error);
      return false;
    }
  }
};

export default sessionService;

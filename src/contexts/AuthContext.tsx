import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { apiService } from '../services/api';
import { Navigate, useLocation } from 'react-router-dom';
import sessionService, { type UserData } from '../services/sessionService';

// Define context types
type AuthContextType = {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  loginWithCredentials: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  registerWithCredentials: (email: string, password: string, fullName: string) => Promise<boolean>;
  registerTrainerProfile: (fullName: string, bio: string, certifications: string[], experienceYears: number) => Promise<boolean>;
  logout: () => Promise<void>;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
  loginWithCredentials: async () => false,
  loginWithGoogle: async () => false,
  registerWithCredentials: async () => false,
  registerTrainerProfile: async () => false,
  logout: async () => {}
});

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading state
  const [error, setError] = useState<string | null>(null);
  
  // Check for existing session and restore it on mount
  useEffect(() => {
    let mounted = true;
    
    const initAuth = async () => {
      setIsLoading(true);
      try {
        console.log('Auth: Checking for stored session...');
        
        // Before anything else, check for an active Firebase user
        const currentUser = auth.currentUser;
        console.log('Auth: Firebase currentUser:', currentUser ? 'exists' : 'null');
        
        // Try to restore session from localStorage and Firebase
        const sessionRestored = await sessionService.tryRestoreSession();
        
        if (!mounted) return; // Don't update state if unmounted
        
        if (sessionRestored) {
          // Get the current token and user data from session service
          const currentToken = sessionService.getToken();
          const userData = sessionService.getUserData();
          
          if (currentToken && userData) {
            // Set the authentication state with the current data
            setToken(currentToken);
            setUser(userData);
            setIsAuthenticated(true);
            console.log('Auth: Successfully restored session for user:', userData.email);
          }
        } else {
          console.log('Auth: No valid session found or unable to restore');
          
          // Check if we have a Firebase user but no session
          // This can happen if Firebase auth persisted but our session didn't
          const fbUser = auth.currentUser;
          if (fbUser) {
            console.log('Auth: Found Firebase user without session, attempting recovery');
            try {
              // Get the token
              const idToken = await fbUser.getIdToken();
              
              // Try to authenticate with backend using the token
              const loginResponse = await apiService.auth.login({
                provider: "google.com", // Assume Google, adjust as needed
                email: fbUser.email || "",
                fullName: fbUser.displayName || "",
                idToken
              });
              
              if (!mounted) return; // Don't update state if unmounted
              
              // Set the auth state with the new token
              saveAuthState(loginResponse.token, loginResponse.user);
              console.log('Auth: Successfully recovered session');
            } catch (loginError) {
              console.error('Auth: Failed to recover session:', loginError);
            }
          }
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Set up Firebase auth state listener - CRITICAL for session persistence
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        // If Firebase reports no user but we think we're authenticated, clear our state
        if (isAuthenticated) {
          console.log('Auth: Firebase reports no user, but we have local session. Clearing...');
          sessionService.clearSession();
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else if (!isAuthenticated) {
        // If Firebase has a user but we're not authenticated, try to restore session
        console.log('Auth: Firebase has user but we\'re not authenticated, trying to restore');
        initAuth();
      }
    });
    
    initAuth();
    
    // Clean up the auth state listener
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Save authentication state
  const saveAuthState = (newToken: string, userData: UserData) => {
    sessionService.saveSession(newToken, userData);
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
    setError(null);
    console.log('Auth: Session saved successfully');
  };

  // Login with email/password
  const loginWithCredentials = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First, authenticate with Firebase
      console.log('Auth: Authenticating with Firebase...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseToken = await userCredential.user.getIdToken();
      
      console.log('Auth: Firebase authentication successful, token obtained (first 10 chars):', 
        firebaseToken ? firebaseToken.substring(0, 10) + '...' : 'No token');
      console.log('Auth: Sending to backend...');
      
      // Then, authenticate with your backend
      console.log('Auth: Logging in with provider "password"');
      const response = await apiService.auth.login({
        provider: "password",
        email,
        password,
        idToken: firebaseToken // Include the Firebase token for extra verification if needed
      });
      
      console.log('Auth: Backend authentication successful');
      console.log('Auth: Used provider:', 'password');
      
      // Save the auth state with the backend token
      saveAuthState(response.token, response.user);
      return true;
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(error.message || "Login failed. Please check your credentials.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Configure Google provider
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'  // Force account selection
      });
      
      // Sign in with popup
      console.log('Auth: Starting Google sign-in flow...');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log('Auth: Google authentication successful');
      
      if (user) {
        try {
          // Get Firebase ID token
          const idToken = await user.getIdToken();
          
          // Validate that we actually got a token
          if (!idToken) {
            console.error('Auth: Google login - Failed to obtain Firebase ID token');
            throw new Error('Failed to obtain authentication token from Google');
          }
          
          console.log('Auth: Google login - Firebase ID token obtained (first 10 chars):', 
            idToken.substring(0, 10) + '...');
          console.log('Auth: Token length:', idToken.length);
          
          // Authenticate with backend using Firebase token
          const response = await apiService.auth.login({
            provider: "google.com",
            email: user.email || "",
            fullName: user.displayName || "",
            idToken
          });
          
          console.log('Auth: Backend authentication successful');
          
          // Save the auth state with the backend token
          saveAuthState(response.token, response.user);
          return true;
        } catch (apiError) {
          console.error("API authentication failed:", apiError);
          setError("Authentication failed with the server. Please try again.");
          return false;
        }
      }
      return false;
    } catch (error: any) {
      console.error("Google login failed:", error);
      setError(error.message || "Google sign-in failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear session data
      sessionService.clearSession();
      
      // Update local state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      console.log('Auth: Logged out successfully');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Register with email/password
  const registerWithCredentials = async (email: string, password: string, fullName: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First, register with Firebase
      console.log('Auth: Registering with Firebase...', { email, fullName });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Set the display name
      await updateProfile(user, { displayName: fullName });
      console.log('Auth: Firebase display name set to:', fullName);
      
      // Force a refresh to make sure the display name is updated
      await user.reload();
      
      // Get the Firebase token
      const firebaseToken = await user.getIdToken(true); // Force refresh token
      
      console.log('Auth: Firebase registration successful, token obtained');
      console.log('Auth: Firebase user:', { 
        uid: user.uid, 
        email: user.email, 
        displayName: user.displayName 
      });
      
      // Now register with your backend by using the login endpoint
      console.log('Auth: Registering with backend using provider "password"');
      const response = await apiService.auth.login({
        provider: "password",
        email,
        password,
        fullName: fullName, // Explicitly pass the full name
        idToken: firebaseToken
      });
      
      // Log provider to help debug the issue
      console.log('Auth: Backend login successful for new user', response);
      console.log('Auth: Provider used for login:', 'password');
      
      // Make sure the user data has the correct full name
      const userData = {...response.user};
      if (!userData.fullName && fullName) {
        userData.fullName = fullName;
      }
      
      // Save the auth state with the backend token and ensure fullName is included
      saveAuthState(response.token, userData);
      return true;
    } catch (error: any) {
      console.error("Registration failed:", error);
      let errorMessage = "Registration failed. ";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage += "This email address is already in use.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage += "The email address is not valid.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage += "The password is too weak.";
      } else {
        errorMessage += error.message || "Please try again.";
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register trainer profile information after basic registration
  const registerTrainerProfile = async (
    _fullName: string, // Not used in API call
    bio: string,
    certifications: string[],
    experienceYears: number
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get user data and check if we have a valid token
      const userData = sessionService.getUserData();
      const token = sessionService.getToken();
      console.log('Auth: Registering trainer profile information...');
      
      if (!token) {
        console.error('Auth: No valid token found in session for trainer registration');
        throw new Error('Authentication issue: Please log in again to complete your profile.');
      }
      
      // Call the trainer registration API - note we're not sending fullName or user_id
      const response = await apiService.auth.registerTrainer({
        bio,
        certifications,
        experience_years: experienceYears
      });
      
      console.log('Auth: Trainer profile registration successful', response);
      
      // Update local user data with additional profile info if available
      if (response && response.profile && userData) {
        // Merge the profile data with existing user data
        const updatedUserData = {
          ...userData,
          profile: response.profile
        };
        
        // Update the session with the complete user data
        sessionService.saveSession(sessionService.getToken() || '', updatedUserData);
        setUser(updatedUserData);
      }
      
      return true;
    } catch (error: any) {
      console.error("Trainer profile registration failed:", error);
      
      let errorMessage = "Failed to complete trainer profile setup. ";
      
      if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Please try again.";
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      token,
      isLoading,
      error, 
      loginWithCredentials,
      loginWithGoogle,
      registerWithCredentials,
      registerTrainerProfile,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Protected route component
export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  redirectPath?: string;
}> = ({ children, redirectPath = '/trainer/login' }) => {
  const { isAuthenticated, isLoading, user, token } = useAuth();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;
  
  // On component mount or when authentication state changes,
  // verify the session validity
  useEffect(() => {
    const validateSession = async () => {
      setIsValidating(true);
      
      try {
        // Double-check that we have both firebase auth and a session
        const hasFirebaseUser = !!auth.currentUser;
        const hasSession = sessionService.isLoggedIn();
        
        console.log('ProtectedRoute: Firebase user exists:', hasFirebaseUser);
        console.log('ProtectedRoute: Session exists:', hasSession);
        
        if (!hasFirebaseUser && hasSession) {
          console.log('ProtectedRoute: Session exists but no Firebase user, clearing session');
          sessionService.clearSession();
          setIsValidating(false);
          return;
        }
        
        // If we appear to be authenticated, verify with session service
        if (isAuthenticated && token && user) {
          const isValid = await sessionService.isSessionValid();
          
          if (!isValid) {
            console.log('ProtectedRoute: Session validation failed');
            
            // If we haven't exceeded retry attempts, try to recover
            if (retryCount < maxRetries) {
              console.log(`ProtectedRoute: Attempting recovery (attempt ${retryCount + 1})`);
              setRetryCount(prev => prev + 1);
              
              // Try to refresh the Firebase token
              const refreshedToken = await sessionService.refreshFirebaseToken();
              if (refreshedToken) {
                console.log('ProtectedRoute: Token refreshed successfully');
                // Don't reload, just update retry count and let validation complete
              } else if (retryCount >= maxRetries - 1) {
                // Last attempt failed, force reload
                console.log('ProtectedRoute: Recovery failed, forcing page reload');
                window.location.reload();
                return;
              }
            } else {
              // We've tried too many times, clear session and let auth flow handle it
              console.log('ProtectedRoute: Max retries exceeded, clearing session');
              sessionService.clearSession();
            }
          } else {
            // Session is valid, refresh it
            sessionService.refreshSession();
            // Reset retry count on success
            if (retryCount > 0) {
              setRetryCount(0);
            }
          }
        }
      } catch (error) {
        console.error('Error validating session in protected route:', error);
      } finally {
        setIsValidating(false);
      }
    };
    
    validateSession();
  }, [isAuthenticated, user, token, retryCount]);
  
  // Show loading state while checking auth or validating session
  if (isLoading || isValidating) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
    </div>;
  }
  
  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

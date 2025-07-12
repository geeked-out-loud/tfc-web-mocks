import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import sessionService from '../services/sessionService';
import { auth } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

/**
 * SessionManager - A component that monitors route changes and refreshes 
 * the session automatically. This helps prevent session timeouts when
 * users are actively using the app.
 */
const SessionManager: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const refreshInterval = useRef<number | null>(null);
  
  // Handle route changes
  useEffect(() => {
    // This will run on every route change
    const refreshSessionOnNavigate = async () => {
      if (sessionService.isLoggedIn()) {
        console.log('SessionManager: Refreshing session on page navigation');
        sessionService.refreshSession();
        
        // Also check if we need a fresh Firebase token
        const token = sessionService.getToken();
        const user = auth.currentUser;
        
        if (user && token) {
          // Check if the token might be getting old
          try {
            // Force token refresh if it's older than 30 minutes
            // This is a preemptive refresh to avoid token expiration
            const refreshedToken = await user.getIdToken(true);
            if (refreshedToken && refreshedToken !== token) {
              console.log('SessionManager: Preemptively refreshed Firebase token');
              
              // If the token changed, update our session
              const userData = sessionService.getUserData();
              if (userData) {
                sessionService.saveSession(refreshedToken, userData);
              }
            }
          } catch (error) {
            console.error('SessionManager: Error refreshing token:', error);
          }
        }
      }
    };
    
    refreshSessionOnNavigate();
  }, [location.pathname]); // Run on route change
  
  // Set up periodic session refresh
  useEffect(() => {
    // Only set up interval if logged in
    if (isAuthenticated) {
      console.log('SessionManager: Setting up periodic session refresh');
      
      // Check for Firebase auth persistence
      const checkFirebasePersistence = async () => {
        const user = auth.currentUser;
        if (!user && sessionService.isLoggedIn()) {
          console.warn('SessionManager: Firebase user is null but we have a session');
          
          // Re-initialize Firebase auth if needed - this helps prevent session loss
          try {
            // Try to refresh the session
            await sessionService.tryRestoreSession();
          } catch (error) {
            console.error('SessionManager: Error restoring session:', error);
            
            // If restoration fails, clear the session to be safe
            sessionService.clearSession();
            window.location.reload();
          }
        }
      };
      
      // Immediate check on mount
      checkFirebasePersistence();
      
      // Check and refresh token every 10 minutes
      refreshInterval.current = window.setInterval(async () => {
        console.log('SessionManager: Running periodic session check');
        
        // Check that Firebase auth is still valid
        await checkFirebasePersistence();
        
        // If still logged in, refresh the session
        if (sessionService.isLoggedIn()) {
          try {
            // Update the session timestamp
            sessionService.refreshSession();
            
            // Force refresh the Firebase token to keep it fresh
            const user = auth.currentUser;
            if (user) {
              const newToken = await user.getIdToken(true);
              if (newToken) {
                const userData = sessionService.getUserData();
                if (userData) {
                  sessionService.saveSession(newToken, userData);
                  console.log('SessionManager: Successfully refreshed token in background');
                }
              }
            }
          } catch (error) {
            console.error('SessionManager: Error in periodic refresh:', error);
          }
        }
      }, 10 * 60 * 1000); // Every 10 minutes
    }
    
    // Clean up the interval on unmount
    return () => {
      if (refreshInterval.current !== null) {
        clearInterval(refreshInterval.current);
        refreshInterval.current = null;
      }
    };
  }, [isAuthenticated]);
  
  return null; // This is a utility component with no UI
};

export default SessionManager;

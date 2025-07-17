import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from '../../components/auth/LoginForm';
import SignUpForm from '../../components/auth/SignUpForm';
import sessionService from '../../services/sessionService';

const TrainerAuth: React.FC = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname !== '/trainer/signup');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { isAuthenticated, loginWithCredentials, loginWithGoogle, registerWithCredentials, registerTrainerProfile } = useAuth();
  
  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/trainer/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const success = await loginWithGoogle();
      if (!success) {
        setError('Google sign in failed. Please try again.');
      }
      // Google auth for signup will be handled separately later
      // For now, redirect happens automatically in the useEffect for both login and signup
    } catch (err) {
      setError('Failed to connect to Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const success = await loginWithCredentials(email, password);
      
      if (!success) {
        setError('Login failed. Please check your credentials.');
      }
      // Redirect will happen automatically due to the useEffect hook
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  // Combined signup: Handle both account creation and trainer profile in one flow
  const handleSignUp = async (
    fullName: string, 
    email: string, 
    password: string,
    bio: string,
    certifications: string[],
    experienceYears: number
  ) => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('TrainerAuth: Starting combined signup flow...');
      
      // Input validation
      if (!fullName || !email || !password || !bio) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return false;
      }
      
      // Clear any existing session data to prevent conflicts
      sessionService.clearSession();
      
      console.log('TrainerAuth: Creating account with Firebase and authenticating with backend...');
      console.log('TrainerAuth: Registration data:', { 
        fullName, 
        email,
        bio: bio.substring(0, 20) + '...', // Log partial bio for privacy
        certifications, 
        experienceYears 
      });
      
      // Step 1: Create account with Firebase and authenticate with backend
      console.log('TrainerAuth: Registering user account with Firebase...');
      const accountSuccess = await registerWithCredentials(email, password, fullName);
      
      if (!accountSuccess) {
        setError('Registration failed. This email may already be in use.');
        setIsLoading(false);
        return false;
      }
      
      console.log('TrainerAuth: Account created successfully. Waiting to ensure session is properly set up...');
      
      // Brief delay to ensure session data is fully set up
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Double-check we have a valid token
      const token = sessionService.getToken();
      
      console.log('TrainerAuth: Session data check:', { 
        hasToken: !!token
      });
      
      if (!token) {
        console.error('TrainerAuth: Invalid session after account creation - no token');
        setError('Account created, but session setup failed. Please try logging in.');
        setIsLoading(false);
        return false;
      }
      
      // Step 2: Register trainer profile
      console.log('TrainerAuth: Now registering trainer profile');
      const profileSuccess = await registerTrainerProfile(fullName, bio, certifications, experienceYears);
      
      if (!profileSuccess) {
        setError('Account created, but failed to save trainer profile. Please try again.');
        setIsLoading(false);
        return false;
      }
      
      // Both steps successful - redirect will happen via useEffect since isAuthenticated is now true
      console.log('TrainerAuth: Trainer signup completed successfully!');
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error('TrainerAuth: Signup error:', err);
      setError(err.message || 'Registration failed. Please try again later.');
      setIsLoading(false);
      return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Banner Image Section */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <img 
          src="/trainerLoginBanner.png" 
          alt="TFC Trainer Portal" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-6">
          <div className="text-white">
            <h1 className="text-3xl font-bold ddc-hardware">WELCOME TO <span className="text-yellow-400">TFC</span></h1>
            <h2 className="text-3xl font-bold ddc-hardware">
              {isLogin ? "TRAINER LOGIN" : "TRAINER SIGNUP"}
            </h2>
          </div>
        </div>
      </div>
      
      {/* Auth Form Section */}
      <div className="flex-1 p-6 max-w-md mx-auto w-full flex items-center">
        <div className="space-y-6 py-12 w-full">
          {/* Modern toggle switch with sliding animation */}
          <div className="mb-8">
            <div className="bg-gray-100 rounded-full p-1 flex w-full relative">
              {/* Animated sliding background */}
              <div 
                className={`absolute top-1 bottom-1 w-1/2 bg-[#262012] rounded-full transition-all duration-300 ease-in-out shadow-xl ${
                  isLogin ? 'left-1' : 'left-[calc(50%-4px)]'
                }`}
              />
              <button
                onClick={() => { 
                  setIsLogin(true); 
                  setError(''); 
                  navigate('/trainer/login', { replace: true });
                }}
                className="flex-1 py-2 px-6 rounded-full transition-colors z-10 relative text-center"
              >
                <span className={`font-medium transition-colors duration-300 ${isLogin ? 'text-white' : 'text-gray-600'}`}>
                  Sign In
                </span>
              </button>
              <button
                onClick={() => { 
                  setIsLogin(false); 
                  setError(''); 
                  navigate('/trainer/signup', { replace: true });
                }}
                className="flex-1 py-2 px-6 rounded-full transition-colors z-10 relative text-center"
              >
                <span className={`font-medium transition-colors duration-300 ${!isLogin ? 'text-white' : 'text-gray-600'}`}>
                  Sign Up
                </span>
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            {isLogin ? (
              <LoginForm 
                onSubmit={handleLogin}
                isLoading={isLoading}
                error={error}
              />
            ) : (
              <SignUpForm
                onSubmit={handleSignUp}
                isLoading={isLoading}
                error={error}
              />
            )}
          </div>
          
          {/* Show the "or continue with" section */}
          <>
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-gray-300 absolute w-full"></div>
              <div className="bg-white px-4 relative text-sm text-gray-500">or continue with</div>
            </div>
            
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google</span>
            </button>
          </>
          
          <div className="text-center mt-6">
            {isLogin ? (
              <button 
                type="button"
                onClick={() => alert('Password reset functionality will be implemented')}
                className="text-[#262012] text-sm font-bold hover:underline"
              >
                Forgot password
              </button>
            ) : (
              <p className="text-gray-500 text-sm">
                By signing up, you agree to our <br /> <a href="#" className="text-[#262012] font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-[#262012] font-bold hover:underline">Privacy Policy</a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerAuth;

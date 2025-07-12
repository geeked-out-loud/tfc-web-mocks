import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface SignUpFormProps {
  onSubmit: (
    fullName: string, 
    email: string, 
    password: string,
    bio: string, 
    certifications: string[], 
    experienceYears: number
  ) => Promise<boolean>;
  isLoading: boolean;
  error?: string;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ 
  onSubmit, 
  isLoading, 
  error
}) => {
  // Form data state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [certificationInput, setCertificationInput] = useState('');
  const [certificationTags, setCertificationTags] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState('');
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Validate and submit the complete form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required information
    if (!fullName || !email || !password || !bio) {
      setValidationError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    // Convert experienceYears to number
    const expYears = parseInt(experienceYears || '0', 10);
    
    console.log('Form complete with trainer details:', {
      fullName,
      email,
      bio,
      certifications: certificationTags,
      experienceYears: expYears
    });
    
    // Submit all form data at once
    try {
      await onSubmit(
        fullName, 
        email, 
        password, 
        bio, 
        certificationTags, 
        expYears
      );
      // Error handling will be done by the parent component
    } catch (err) {
      setValidationError('Failed to create account. Please try again.');
    }
  };

  const displayError = error || validationError;

  return (
    <div className="w-full">
      {/* Error message */}
      {displayError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {displayError}
        </div>
      )}

      {/* Combined single-step form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Information */}
        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-yellow-500"
            required
          />
        </div>
        
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-yellow-500"
            required
          />
        </div>
        
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-yellow-500 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-yellow-500"
            required
          />
        </div>

        {/* Trainer Information */}
        <div className="mt-6">
          <textarea
            placeholder="Bio (e.g., Certified fitness coach with 10 years experience)"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-yellow-500"
            required
          />
        </div>
        
        <div>
          <input
            type="text"
            placeholder="Certifications (Press Enter to add)"
            value={certificationInput}
            onChange={(e) => setCertificationInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && certificationInput.trim()) {
                e.preventDefault();
                const newCert = certificationInput.trim();
                if (!certificationTags.includes(newCert)) {
                  setCertificationTags([...certificationTags, newCert]);
                  setCertificationInput('');
                }
              }
            }}
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-yellow-500"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {certificationTags.map((cert, index) => (
              <div 
                key={index} 
                className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm flex items-center"
              >
                {cert}
                <button 
                  onClick={() => {
                    setCertificationTags(certificationTags.filter(c => c !== cert));
                  }}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                  type="button"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <input
            type="number"
            placeholder="Years of Experience"
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            min="0"
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-yellow-500"
          />
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded transition-colors ${
            isLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#262012] text-white hover:bg-[#352c18]'
          }`}
        >
          {isLoading ? 'SIGNING UP...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;

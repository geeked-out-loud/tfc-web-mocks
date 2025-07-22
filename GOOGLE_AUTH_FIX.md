# Google Authentication Fix

## Problem
Google login was failing with "Illegal url for new iframe" error because the Vercel deployment domain wasn't authorized in Firebase.

## Changes Made

### 1. Updated Vercel Configuration (`vercel.json`)
- Added CORS headers to allow Firebase authentication
- Added `X-Frame-Options: ALLOWALL` to allow iframes from Google/Firebase
- Added proper access control headers

### 2. Updated Authentication Context (`src/contexts/AuthContext.tsx`)
- Added fallback from `signInWithPopup` to `signInWithRedirect` when popup is blocked
- Added redirect result handling on app initialization
- Improved error handling for popup-related issues

## Required Manual Steps

### 1. Firebase Console Configuration
You need to add your Vercel domain to Firebase authorized domains:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (appears to be `namma-combat` based on the error)
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain** and add: `tfc-web-mocks.vercel.app`
5. Also add `localhost` for local development if not already present

### 2. Google Cloud Console (if needed)
If you're still having issues, also verify in Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 client ID for web application
5. Add `https://tfc-web-mocks.vercel.app` to **Authorized JavaScript origins**
6. Add `https://tfc-web-mocks.vercel.app/__/auth/handler` to **Authorized redirect URIs**

## How the Fix Works

### Popup Fallback
```typescript
try {
  // Try popup first (faster UX)
  result = await signInWithPopup(auth, provider);
} catch (popupError) {
  // If popup fails, use redirect (more reliable)
  if (popup-related error) {
    await signInWithRedirect(auth, provider);
    return true; // Redirect handles the rest
  }
}
```

### Redirect Result Handling
```typescript
// On app initialization, check for redirect results
const redirectResult = await getRedirectResult(auth);
if (redirectResult && redirectResult.user) {
  // Complete the authentication flow
}
```

## Testing

1. Deploy the changes to Vercel
2. Complete the Firebase domain configuration
3. Test Google login - it should now work with either popup or redirect

## Alternative Domains
If you plan to use custom domains or multiple environments:
- Production: Add your production domain
- Staging: Add your staging domain  
- Development: Ensure `localhost` is included

The authentication will now be more robust and handle various scenarios where popups might be blocked.

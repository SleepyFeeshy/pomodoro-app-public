import { signIn, signOut, refreshToken } from '@choochmeque/tauri-plugin-google-auth-api';

// Sign in with Google
export async function authenticateUser() {
  // try {
  //   const response = await signIn({
  //     clientId: '',
  //     clientSecret: '', // Required for desktop platforms
  //     scopes: ['openid', 'email', 'profile'],
  //     hostedDomain: 'example.com', // Optional: restrict to specific domain
  //     loginHint: 'user@example.com', // Optional: pre-fill email
  //     redirectUri: 'http://localhost:8085', // Optional: specify custom redirect URI
  //     successHtmlResponse: '<h1>Success!</h1>' // Optional: custom success message (desktop)
  //   })
    
  //   console.log('ID Token:', response.idToken);
  //   console.log('Access Token:', response.accessToken);
  //   console.log('Refresh Token:', response.refreshToken);
  //   console.log('Expires at:', new Date(response.expiresAt * 1000));
  // } catch (error) {
  //   console.error('Authentication failed:', error);
  // }
  return
}

// Sign out
export async function logout(accessToken?: string) {
  // try {
  //   // With token revocation (recommended)
  //   await signOut({ accessToken });
  //   // Or local sign-out only
  //   // await signOut();
  //   console.log('Successfully signed out');
  // } catch (error) {
  //   console.error('Sign out failed:', error);
  // }
  return
}

// Refresh tokens
export async function refreshUserToken(storedRefreshToken: string) {
  // try {
  //   const response = await refreshToken({
  //     refreshToken: storedRefreshToken,
  //     clientId: '',
  //     clientSecret: '' // Required for desktop
  //   });
  //   console.log('New Access Token:', response.accessToken);
  // } catch (error) {
  //   console.error('Token refresh failed:', error);
  // }
  return
}
import { signIn, signOut, refreshToken  } from '@choochmeque/tauri-plugin-google-auth-api';
import { createContext, useContext, useEffect, useState } from "react";
import { load } from '@tauri-apps/plugin-store';

import { decode_jwt_token, sign_in_or_create_user } from "../api/auth";

type AuthSession = {
    idToken: string | undefined,
    accessToken: string,
    refreshToken: string | undefined,
}

type AuthState = {
    session: AuthSession
}

type LocalUser = {
  id: string | null,
  email: string | null,
  picture: string | null
}

export type UserProfile = {
    email: string | null,
    name: string,
    picture: string | null
}

export const AuthContext = createContext<any>({
  session: {idToken: "", accessToken: "", refreshToken: ""},
})

export default function AuthProvider({children}: any) {
  const [session, setSession] = useState<AuthSession>()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [localUserData, setLocalUserData] = useState<LocalUser>({id: null, email: null, picture: null})

  // Check if session exists
  useEffect(() => {
    const token = async () => { 
      if (session) {
        // store data
        const store = await load('user.json', { autoSave: false });
        await sign_in_or_create_user(session!.idToken).then(val => {
          store.set('user', { ...localUserData, email: val.email, picture: val.picture });
          setUserProfile(val)
        })
      }
    }
    token()
  }, [session])

  // Load local user on startup
  useEffect(() => {
    const loadLocalUserData = async() => {
      const store = await load('user.json', { autoSave: false });
      const val = await store.get<LocalUser>('user');
      console.log(val); // { value: 5 }
      if (val.email !== null) {
        setUserProfile(val)
      }
    }
    loadLocalUserData()
  }, [])

  const authenticateUser = async () => {
    try {
      const response = await signIn({
        clientId: '',
        clientSecret: '', // Required for desktop platforms
        scopes: ['openid', 'email', 'profile'],
        flowType: "web",
        hostedDomain: 'example.com', // Optional: restrict to specific domain
        loginHint: 'user@example.com', // Optional: pre-fill email
        redirectUri: 'http://localhost:8085', // Optional: specify custom redirect URI
        successHtmlResponse: '<h1>Success!</h1>', // Optional: custom success message (desktop)
      })
            
      setSession({
        idToken: response.idToken,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken
      })

      console.log(response)

      // Store token UNSECURE
      const store = await load('user_token.json', { autoSave: false });
      await store.set('user_token', { id_token: response.idToken, access_token: response.accessToken, refresh_token: response.refreshToken });

      // store data
      // const store = await load('user.json', { autoSave: false });
      // await store.set('user', { email: 5 });

      console.log('Expires at:', new Date(response!.expiresAt! * 1000));
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  }

  const logOut = async() => {
    try {
      // With token revocation (recommended)
      if (session) {
        await signOut({ accessToken: session!.accessToken });
      }
      setSession(undefined)
      setUserProfile(null)
      const store = await load('user.json', { autoSave: false });
      store.set('user', { email: null, picture: null });
      // Or local sign-out only
      // await signOut();
      console.log('Successfully signed out');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }

  const refreshUserToken = async (storedRefreshToken: string) => {
    try {
      const response = await refreshToken({
        refreshToken: storedRefreshToken,
        clientId:  '',
        clientSecret: '' // Required for desktop
      });
      console.log('New Access Token:', response.accessToken);
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
  }

  const data = {
    session, userProfile, authenticateUser, logOut
  }

  return <AuthContext.Provider value={data}>{children} </AuthContext.Provider>
}

export const useAuth = () => {
  const auth = useContext(AuthContext)
  return auth
}
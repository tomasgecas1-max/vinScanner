import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { auth, isFirebaseEnabled } from '../services/firebase';
import { 
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  deleteUser, 
  reauthenticateWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { deleteAllUserReports } from '../services/reportsFirestore';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  isFirebaseEnabled: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseEnabled || !auth) {
      setLoading(false);
      return;
    }
    getRedirectResult(auth).catch(() => {});
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth || !isFirebaseEnabled) return;
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithFacebook = async () => {
    if (!auth || !isFirebaseEnabled) return;
    const provider = new FacebookAuthProvider();
    provider.addScope('public_profile');
    provider.setCustomParameters({ scope: 'public_profile' });
    await signInWithRedirect(auth, provider);
  };

  const signInWithEmail = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!auth || !isFirebaseEnabled) return { success: false, error: 'Firebase not configured' };
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      let errorMsg = err?.message || 'Login failed';
      if (err?.code === 'auth/user-not-found') errorMsg = 'User not found';
      if (err?.code === 'auth/wrong-password') errorMsg = 'Wrong password';
      if (err?.code === 'auth/invalid-email') errorMsg = 'Invalid email';
      if (err?.code === 'auth/invalid-credential') errorMsg = 'Invalid credentials';
      return { success: false, error: errorMsg };
    }
  };

  const signUpWithEmail = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!auth || !isFirebaseEnabled) return { success: false, error: 'Firebase not configured' };
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      let errorMsg = err?.message || 'Registration failed';
      if (err?.code === 'auth/email-already-in-use') errorMsg = 'Email already in use';
      if (err?.code === 'auth/weak-password') errorMsg = 'Password too weak (min 6 characters)';
      if (err?.code === 'auth/invalid-email') errorMsg = 'Invalid email';
      return { success: false, error: errorMsg };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!auth || !isFirebaseEnabled) return { success: false, error: 'Firebase not configured' };
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      let errorMsg = err?.message || 'Failed to send reset email';
      if (err?.code === 'auth/user-not-found') errorMsg = 'User not found';
      if (err?.code === 'auth/invalid-email') errorMsg = 'Invalid email';
      return { success: false, error: errorMsg };
    }
  };

  const signOut = async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
  };

  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    const u = auth?.currentUser;
    if (!auth || !u) return { success: false, error: 'Not signed in' };
    try {
      await deleteAllUserReports(u.uid);
      await deleteUser(u);
      return { success: true };
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err?.code === 'auth/requires-recent-login') {
        try {
          const isFacebook = u.providerData?.some((p) => p.providerId === 'facebook.com');
          const provider = isFacebook ? new FacebookAuthProvider() : new GoogleAuthProvider();
          await reauthenticateWithPopup(u, provider);
          await deleteAllUserReports(u.uid);
          await deleteUser(u);
          return { success: true };
        } catch (e2) {
          const msg = e2 instanceof Error ? e2.message : String(e2);
          return { success: false, error: msg };
        }
      }
      const msg = e instanceof Error ? (e as Error).message : String(e);
      return { success: false, error: msg };
    }
  };

  const value: AuthContextValue = {
    user,
    loading,
    signInWithGoogle,
    signInWithFacebook,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signOut,
    deleteAccount,
    isFirebaseEnabled,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      loading: false,
      signInWithGoogle: async () => {},
      signInWithFacebook: async () => {},
      signInWithEmail: async () => ({ success: false }),
      signUpWithEmail: async () => ({ success: false }),
      resetPassword: async () => ({ success: false }),
      signOut: async () => {},
      deleteAccount: async () => ({ success: false }),
      isFirebaseEnabled: false,
    };
  }
  return ctx;
}

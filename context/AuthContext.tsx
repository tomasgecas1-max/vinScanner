import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { auth, isFirebaseEnabled } from '../services/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, deleteUser, reauthenticateWithPopup } from 'firebase/auth';
import { deleteAllUserReports } from '../services/reportsFirestore';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
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
          const provider = new GoogleAuthProvider();
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
      signOut: async () => {},
      deleteAccount: async () => ({ success: false }),
      isFirebaseEnabled: false,
    };
  }
  return ctx;
}

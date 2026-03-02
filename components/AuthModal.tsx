import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Translations } from '../constants/translations';

type AuthView = 'options' | 'login' | 'register' | 'reset';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  t: Translations;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, t }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const [view, setView] = useState<AuthView>('options');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!open) return null;

  const handleClose = () => {
    setView('options');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccessMsg(null);
    onClose();
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      handleClose();
    } catch {
      setError(t.auth?.googleError || 'Google login failed');
    }
    setLoading(false);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    const result = await signInWithEmail(email, password);
    setLoading(false);
    if (result.success) {
      handleClose();
    } else {
      setError(result.error || t.auth?.loginError || 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (password !== confirmPassword) {
      setError(t.auth?.passwordMismatch || 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError(t.auth?.passwordTooShort || 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError(null);
    const result = await signUpWithEmail(email, password);
    setLoading(false);
    if (result.success) {
      handleClose();
    } else {
      setError(result.error || t.auth?.registerError || 'Registration failed');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    const result = await resetPassword(email);
    setLoading(false);
    if (result.success) {
      setSuccessMsg(t.auth?.resetSent || 'Password reset email sent');
    } else {
      setError(result.error || t.auth?.resetError || 'Failed to send reset email');
    }
  };

  const handleContinueWithoutLogin = () => {
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose}>
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        <div className="p-8">
          {view === 'options' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.auth?.title || 'Sign In'}</h2>
                <p className="text-slate-500 text-sm">{t.auth?.subtitle || 'Choose how you want to continue'}</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-60"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t.auth?.googleButton || 'Continue with Google'}
                </button>

                <button
                  onClick={() => { setView('login'); setError(null); }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 rounded-2xl font-bold text-white hover:bg-indigo-600 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  {t.auth?.emailButton || 'Continue with Email'}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white text-sm text-slate-400">{t.auth?.or || 'or'}</span>
                  </div>
                </div>

                <button
                  onClick={handleContinueWithoutLogin}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                  </svg>
                  {t.auth?.continueWithout || 'Continue without signing in'}
                </button>
              </div>

              <p className="text-center text-xs text-slate-400 mt-6">
                {t.auth?.noAccountYet || "Don't have an account?"}{' '}
                <button onClick={() => { setView('register'); setError(null); }} className="text-indigo-600 font-bold hover:underline">
                  {t.auth?.createAccount || 'Create one'}
                </button>
              </p>
            </>
          )}

          {view === 'login' && (
            <>
              <button onClick={() => { setView('options'); setError(null); }} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                {t.auth?.back || 'Back'}
              </button>

              <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.auth?.loginTitle || 'Sign in with email'}</h2>

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t.auth?.emailLabel || 'Email'}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="name@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t.auth?.passwordLabel || 'Password'}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all disabled:opacity-60"
                >
                  {loading ? '...' : (t.auth?.loginButton || 'Sign In')}
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-6">
                <button onClick={() => { setView('reset'); setError(null); setSuccessMsg(null); }} className="text-indigo-600 font-bold hover:underline">
                  {t.auth?.forgotPassword || 'Forgot password?'}
                </button>
              </p>
            </>
          )}

          {view === 'register' && (
            <>
              <button onClick={() => { setView('options'); setError(null); }} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                {t.auth?.back || 'Back'}
              </button>

              <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.auth?.registerTitle || 'Create account'}</h2>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t.auth?.emailLabel || 'Email'}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="name@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t.auth?.passwordLabel || 'Password'}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t.auth?.confirmPasswordLabel || 'Confirm password'}</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email || !password || !confirmPassword}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all disabled:opacity-60"
                >
                  {loading ? '...' : (t.auth?.registerButton || 'Create Account')}
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-6">
                {t.auth?.alreadyHaveAccount || 'Already have an account?'}{' '}
                <button onClick={() => { setView('login'); setError(null); }} className="text-indigo-600 font-bold hover:underline">
                  {t.auth?.signIn || 'Sign in'}
                </button>
              </p>
            </>
          )}

          {view === 'reset' && (
            <>
              <button onClick={() => { setView('login'); setError(null); setSuccessMsg(null); }} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                {t.auth?.back || 'Back'}
              </button>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.auth?.resetTitle || 'Reset password'}</h2>
              <p className="text-slate-500 text-sm mb-6">{t.auth?.resetSubtitle || 'Enter your email and we will send you a reset link'}</p>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t.auth?.emailLabel || 'Email'}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="name@example.com"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                    {error}
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                    {successMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all disabled:opacity-60"
                >
                  {loading ? '...' : (t.auth?.resetButton || 'Send Reset Link')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageMeta } from '../hooks/usePageMeta';
import { AUTH_ENABLED, useAuth } from '../hooks/useAuth';

type AuthService = typeof import('../services/auth');

// Firebase error codes with a specific message; anything else shows the generic one
const ERROR_KEYS: Record<string, string> = {
  'auth/invalid-credential': 'auth.errors.invalid_credential',
  'auth/invalid-email': 'auth.errors.invalid_email',
  'auth/email-already-in-use': 'auth.errors.email_in_use',
  'auth/weak-password': 'auth.errors.weak_password',
  'auth/too-many-requests': 'auth.errors.too_many_requests',
  'auth/network-request-failed': 'auth.errors.network',
  'auth/popup-blocked': 'auth.errors.popup_blocked',
};

const SILENT_ERRORS = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request'];

const Login = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  // Pages that require an account (e.g. favourites) send the visitor here and get them back after login
  const from = (useLocation().state as { from?: string } | null)?.from;
  const redirectTo = from?.startsWith('/') && !from.startsWith('//') ? from : '/';
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const [noticeKey, setNoticeKey] = useState('');
  const [busy, setBusy] = useState(false);

  const title = t(isSignUp ? 'auth.title_signup' : 'auth.title_signin');
  usePageMeta(title);

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [user, navigate, redirectTo]);

  const run = async (action: (auth: AuthService) => Promise<unknown>, doneKey = '') => {
    setErrorKey('');
    setNoticeKey('');
    setBusy(true);
    try {
      await action(await import('../services/auth'));
      setNoticeKey(doneKey);
    } catch (err) {
      const code = (err as { code?: string }).code ?? '';
      if (!SILENT_ERRORS.includes(code)) setErrorKey(ERROR_KEYS[code] ?? 'auth.errors.generic');
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    run((auth) => (isSignUp ? auth.signUp(email, password) : auth.signIn(email, password)));
  };

  const handleReset = () => {
    if (!email) {
      setNoticeKey('');
      setErrorKey('auth.errors.email_required');
      return;
    }
    run((auth) => auth.resetPassword(email), 'auth.reset_sent');
  };

  if (!AUTH_ENABLED) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.text}>{t('auth.unavailable')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{title}</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            {t('auth.email')}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            {t('auth.password')}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              minLength={isSignUp ? 6 : undefined}
              required
              className={styles.input}
            />
          </label>

          {errorKey && <p role="alert" className={styles.error}>{t(errorKey)}</p>}
          {noticeKey && <p role="status" className={styles.notice}>{t(noticeKey)}</p>}

          <button type="submit" disabled={busy} className={styles.button}>
            {t(isSignUp ? 'auth.submit_signup' : 'auth.submit_signin')}
          </button>
        </form>

        {!isSignUp && (
          <button type="button" onClick={handleReset} disabled={busy} className={styles.link}>
            {t('auth.forgot_password')}
          </button>
        )}

        <div className={styles.divider}>{t('auth.or')}</div>

        <button
          type="button"
          onClick={() => run((auth) => auth.signInWithGoogle())}
          disabled={busy}
          className={styles.button_google}
        >
          {t('auth.google')}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setErrorKey('');
            setNoticeKey('');
          }}
          className={styles.link}
        >
          {t(isSignUp ? 'auth.switch_to_signin' : 'auth.switch_to_signup')}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: "min-h-[70vh] flex items-center justify-center p-4 md:p-8",
  card: "w-full max-w-md bg-white dark:bg-white/5 border border-gray-200 dark:border-f1-red/30 rounded-lg p-6 md:p-8 flex flex-col gap-4",
  title: "font-orbitron text-2xl font-bold text-f1-dark dark:text-white uppercase text-center mb-2",
  text: "font-inter text-gray-600 dark:text-gray-400 text-center",
  form: "flex flex-col gap-4",
  label: "flex flex-col gap-1 font-orbitron text-xs uppercase tracking-wider text-f1-dark dark:text-f1-light-gray",
  input: "font-inter text-base normal-case tracking-normal bg-transparent border border-gray-300 dark:border-gray-600 rounded px-3 py-2 outline-none text-f1-dark dark:text-white focus:border-f1-red",
  error: "font-inter text-sm text-red-700 dark:text-red-300",
  notice: "font-inter text-sm text-green-700 dark:text-green-400",
  button: "px-8 py-3 bg-f1-red text-white font-orbitron uppercase tracking-wider rounded hover:bg-red-700 transition-colors disabled:opacity-50",
  button_google: "px-8 py-3 border border-gray-300 dark:border-gray-600 text-f1-dark dark:text-white font-orbitron text-sm uppercase tracking-wider rounded hover:border-f1-red hover:text-f1-red transition-colors disabled:opacity-50",
  link: "font-inter text-sm text-gray-600 dark:text-gray-400 hover:text-f1-red transition-colors disabled:opacity-50",
  divider: "font-orbitron text-xs uppercase tracking-widest text-gray-400 text-center",
};

export default Login;

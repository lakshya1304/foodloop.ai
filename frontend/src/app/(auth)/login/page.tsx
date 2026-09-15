'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import { Eye, EyeOff, ArrowLeft, Leaf, Lock, Mail, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

// Strong password regex — must match backend auth.schema.ts
const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

interface PasswordRule {
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  { label: 'At least 8 characters',        test: (pw) => pw.length >= 8 },
  { label: 'One uppercase letter (A–Z)',    test: (pw) => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter (a–z)',    test: (pw) => /[a-z]/.test(pw) },
  { label: 'One digit (0–9)',               test: (pw) => /\d/.test(pw) },
  { label: 'One special character (!@#…)',  test: (pw) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw) },
];

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('Qwertyui12345678@');
  const [showPassword, setShowPassword] = useState(false);
  const [showStrength, setShowStrength] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!STRONG_PASSWORD_REGEX.test(password)) {
      setError('Password must include uppercase, lowercase, a number, and a special character (min 8 chars).');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        dispatch(setCredentials({ user: res.data.data.user }));

        const role = res.data.data.user.role;
        if (role === 'KITCHEN_MANAGER') router.push('/dashboard/kitchen');
        else if (role === 'NGO_STAFF') router.push('/dashboard/ngo');
        else if (role === 'ADMIN') router.push('/dashboard/admin');
        else if (role === 'DRIVER') router.push('/dashboard/driver');
        else router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to login. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--bg-primary)] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300/30 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/30 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full mx-auto space-y-6 relative z-10 my-auto">
        <div className="flex justify-between items-center px-2">
          <Link href="/" className="clay-button px-4 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] font-bold text-sm flex items-center space-x-2 hover:text-indigo-500 transition-all">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2 text-indigo-500 font-black">
            <Leaf className="w-6 h-6" />
            <span>FoodLoop</span>
          </div>
        </div>

        <div className="clay-card p-8 bg-[var(--bg-card)] backdrop-blur-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)] font-medium">
              Sign in to manage food inventory &amp; surplus AI analytics.
            </p>

            {/* Quick-Login Demo Pills */}
            <div className="mt-4 p-3 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-2xl border border-indigo-500/20 text-xs text-[var(--text-accent)] font-bold space-y-1">
              <p className="flex items-center justify-center font-extrabold text-[var(--text-accent)]">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-400" /> Demo Quick Login Roles:
              </p>
              <div className="flex justify-center space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setEmail('kitchen@kitchen.com'); setPassword('Qwertyui12345678@'); setShowStrength(false); }}
                  className="px-2.5 py-1 clay-pill bg-[var(--bg-secondary)] text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all text-xs font-bold"
                >
                  Kitchen
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('ngo@ngo.com'); setPassword('Qwertyui12345678@'); setShowStrength(false); }}
                  className="px-2.5 py-1 clay-pill bg-[var(--bg-secondary)] text-purple-500 hover:bg-purple-500 hover:text-white transition-all text-xs font-bold"
                >
                  NGO
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('admin@admin.com'); setPassword('Qwertyui12345678@'); setShowStrength(false); }}
                  className="px-2.5 py-1 clay-pill bg-[var(--bg-secondary)] text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all text-xs font-bold"
                >
                  Admin
                </button>
              </div>
              <p className="text-[10px] font-semibold text-[var(--text-muted)] mt-1 pt-1 border-t border-indigo-500/20">
                Password: <code className="font-mono bg-[var(--bg-secondary)] px-1 rounded text-[var(--text-primary)]">Qwertyui12345678@</code>
              </p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 p-3.5 rounded-2xl text-xs font-bold animate-in fade-in">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-theme)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[var(--text-primary)] text-sm font-semibold shadow-inner transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-10 pr-10 py-3 bg-[var(--bg-secondary)] border border-[var(--border-theme)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[var(--text-primary)] text-sm font-semibold shadow-inner transition-colors"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setShowStrength(true); }}
                  onFocus={() => setShowStrength(true)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Strength Checklist — theme-aware */}
              {showStrength && password.length > 0 && (
                <div className="mt-2.5 p-3 bg-[var(--bg-secondary)] border border-[var(--border-theme)] rounded-2xl space-y-1 animate-in fade-in duration-200">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1.5">Password Requirements</p>
                  {PASSWORD_RULES.map((rule) => {
                    const passed = rule.test(password);
                    return (
                      <div key={rule.label} className="flex items-center space-x-2">
                        {passed
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          : <XCircle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 flex-shrink-0" />
                        }
                        <span className={`text-[11px] font-semibold ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-muted)]'}`}>
                          {rule.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="clay-indigo w-full py-3.5 px-4 font-black text-white active:scale-95 transition-all text-sm shadow-xl cursor-pointer disabled:opacity-70"
            >
              {loading ? 'Authenticating…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs font-medium text-[var(--text-muted)]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-bold text-indigo-500 hover:underline">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Eye, EyeOff, ArrowLeft, ArrowRight, Building, Mail, Lock, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';

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

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'KITCHEN'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showStrength, setShowStrength] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.name || !formData.email) {
        setError('Please fill in your organization name and email');
        return;
      }
      setError('');
      setStep(2);
      return;
    }

    // Client-side strong password check
    if (!STRONG_PASSWORD_REGEX.test(formData.password)) {
      setError('Password must include uppercase, lowercase, a number, and a special character (min 8 chars).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        dispatch(setCredentials({ user: res.data.data.user }));

        const role = res.data.data.user.role;
        if (role === 'KITCHEN_MANAGER') router.push('/dashboard/kitchen');
        else if (role === 'NGO_STAFF') router.push('/dashboard/ngo');
        else if (role === 'DRIVER') router.push('/dashboard/driver');
        else if (role === 'ADMIN') router.push('/dashboard/admin');
        else router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to register account');
    } finally {
      setLoading(false);
    }
  };

  const allRulesPassed = PASSWORD_RULES.every((r) => r.test(formData.password));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300/30 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300/30 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-lg w-full mx-auto space-y-6 relative z-10 my-auto">
        <div className="flex justify-between items-center px-2">
          <Link href="/" className="clay-button px-4 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] font-bold text-sm flex items-center space-x-2 hover:text-emerald-500 transition-all">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2 text-emerald-500 font-black">
            <Leaf className="w-6 h-6" />
            <span>FoodLoop</span>
          </div>
        </div>

        <div className="clay-card p-8 bg-[var(--bg-card)] backdrop-blur-xl">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
              Create an Account
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)] font-medium">
              Step {step} of 2 — {step === 1 ? 'Organization Profile' : 'Security & Account Role'}
            </p>

            {/* Step Indicators */}
            <div className="flex justify-center items-center space-x-3 mt-4">
              <div className={`h-2.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-12 bg-emerald-500' : 'w-4 bg-[var(--border-theme)]'}`} />
              <div className={`h-2.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-12 bg-emerald-500' : 'w-4 bg-[var(--border-theme)]'}`} />
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 p-3.5 rounded-2xl text-xs font-bold animate-in fade-in">
                {error}
              </div>
            )}

            {step === 1 ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Organization Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                      <Building className="h-4 w-4" />
                    </div>
                    <input
                      id="register-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. City Central Kitchen"
                      className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-theme)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-[var(--text-primary)] text-sm font-semibold shadow-inner transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Work Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="register-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@organization.com"
                      className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-theme)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-[var(--text-primary)] text-sm font-semibold shadow-inner transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="clay-emerald w-full py-3.5 px-4 font-black text-white active:scale-95 transition-all text-sm shadow-xl flex items-center justify-center space-x-2 cursor-pointer mt-4"
                >
                  <span>Continue to Step 2</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Account Role</label>
                  <select
                    id="register-role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-theme)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-[var(--text-primary)] text-sm font-semibold shadow-inner transition-colors"
                  >
                    <option value="KITCHEN">Kitchen / Food Business Manager</option>
                    <option value="NGO">NGO / Food Bank Staff</option>
                    <option value="LOGISTICS">Delivery / Logistics Driver</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setShowStrength(true); }}
                      onFocus={() => setShowStrength(true)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-[var(--bg-secondary)] border border-[var(--border-theme)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-[var(--text-primary)] text-sm font-semibold shadow-inner transition-colors"
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
                  {showStrength && formData.password.length > 0 && (
                    <div className="mt-2.5 p-3 bg-[var(--bg-secondary)] border border-[var(--border-theme)] rounded-2xl space-y-1 animate-in fade-in duration-200">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1.5">Password Requirements</p>
                      {PASSWORD_RULES.map((rule) => {
                        const passed = rule.test(formData.password);
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

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setError(''); setStep(1); }}
                    className="clay-button w-1/3 py-3.5 px-4 font-bold bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] text-sm transition-colors"
                  >
                    Back
                  </button>
                  <button
                    id="register-submit"
                    type="submit"
                    disabled={loading || !allRulesPassed}
                    className="clay-emerald w-2/3 py-3.5 px-4 font-black text-white active:scale-95 transition-all text-sm shadow-xl disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Creating Account…' : 'Complete Registration'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 text-center text-xs font-medium text-[var(--text-muted)]">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-emerald-500 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

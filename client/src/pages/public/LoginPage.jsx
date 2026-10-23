import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Scale, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Spinner } from '../../components/ui';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const from = location.state?.from?.pathname;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await login(data.email, data.password);
      toast.success(`Welcome back, ${response.user.name}!`);

      if (from) {
        navigate(from, { replace: true });
      } else if (response.user.role === 'advocate') {
        navigate('/advocate/dashboard', { replace: true });
      } else {
        navigate('/client/dashboard', { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Demo account quick-fill helpers
  const fillClientDemo = () => {
    setValue('email', 'client@lexadvocate.com');
    setValue('password', 'Password123!');
  };

  const fillAdvocateDemo = () => {
    setValue('email', 'priya.sharma@lexadvocate.com');
    setValue('password', 'Password123!');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-md">
            <Scale className="w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-text-primary">
            Lex<span className="text-primary">Advocate</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-text-primary">
          Sign In to Your Account
        </h2>
        <p className="mt-1.5 text-xs text-text-secondary">
          Access your legal consultations, case schedules, and documents
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-card rounded-2xl border border-border sm:px-10">
          {/* Quick Demo Fill Buttons */}
          <div className="mb-6 p-3 bg-red-50/60 rounded-xl border border-red-100">
            <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" /> Quick Demo Login (One-click)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillClientDemo}
                className="py-1.5 px-2 bg-white text-text-primary text-xs font-medium rounded-lg border border-red-200 hover:bg-white/80 hover:text-primary transition-colors text-center shadow-xs"
              >
                Client Demo
              </button>
              <button
                type="button"
                onClick={fillAdvocateDemo}
                className="py-1.5 px-2 bg-white text-text-primary text-xs font-medium rounded-lg border border-red-200 hover:bg-white/80 hover:text-primary transition-colors text-center shadow-xs"
              >
                Advocate Demo
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  className="input-field pl-10"
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-primary">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-primary hover:text-primary-dark"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-primary">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full py-2.5 text-sm font-semibold shadow-sm"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-xs text-text-secondary">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

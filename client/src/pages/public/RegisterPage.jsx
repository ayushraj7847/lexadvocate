import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Scale, Lock, Mail, User, Phone, Briefcase, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const defaultRole = searchParams.get('role') === 'advocate' ? 'advocate' : 'client';
  const [selectedRole, setSelectedRole] = useState(defaultRole);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      role: defaultRole,
    },
  });

  useEffect(() => {
    setValue('role', selectedRole);
  }, [selectedRole, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await registerAuth({
        ...data,
        role: selectedRole,
      });
      toast.success('Registration successful! Welcome to LexAdvocate.');

      if (selectedRole === 'advocate') {
        navigate('/advocate/dashboard', { replace: true });
      } else {
        navigate('/client/dashboard', { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
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
          Create Your LexAdvocate Account
        </h2>
        <p className="mt-1.5 text-xs text-text-secondary">
          Join thousands of clients and advocates across India
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-card rounded-2xl border border-border sm:px-10">
          {/* Role Selection Toggle */}
          <div className="mb-6">
            <label className="label">I want to register as a:</label>
            <div className="grid grid-cols-2 gap-3 mt-1.5">
              <button
                type="button"
                onClick={() => setSelectedRole('client')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  selectedRole === 'client'
                    ? 'border-primary bg-primary-50/50 text-primary font-bold'
                    : 'border-border bg-white text-text-secondary hover:border-gray-300'
                }`}
              >
                <UserCheck className="w-5 h-5 mb-1 text-primary" />
                <span className="text-xs">Client</span>
                <span className="text-[10px] text-text-muted mt-0.5">Seeking Legal Advice</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('advocate')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  selectedRole === 'advocate'
                    ? 'border-primary bg-primary-50/50 text-primary font-bold'
                    : 'border-border bg-white text-text-secondary hover:border-gray-300'
                }`}
              >
                <Briefcase className="w-5 h-5 mb-1 text-primary" />
                <span className="text-xs">Advocate</span>
                <span className="text-[10px] text-text-muted mt-0.5">Practicing Counsel</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="label">Full Legal Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="input-field pl-10"
                  placeholder={selectedRole === 'advocate' ? 'Adv. Rajesh Kumar' : 'Rajesh Kumar'}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-primary">{errors.name.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
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

            {/* Phone Number */}
            <div>
              <label className="label">Mobile Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone number is required' })}
                  className="input-field pl-10"
                  placeholder="+91 98765 43210"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-primary">{errors.phone.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
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

            <p className="text-[11px] text-text-secondary leading-normal pt-1">
              By registering, you agree to LexAdvocate's{' '}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full py-2.5 text-sm font-semibold shadow-sm mt-2"
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-xs text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

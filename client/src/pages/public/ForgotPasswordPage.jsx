import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Scale, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    // Simulate password reset request with realistic delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Password reset instructions sent to your email.');
    }, 1000);
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
          Reset Your Password
        </h2>
        <p className="mt-1.5 text-xs text-text-secondary">
          Enter the email associated with your account to receive a reset link
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-card rounded-2xl border border-border sm:px-10">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-50 text-success rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-text-primary">
                Check Your Inbox
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                We've sent password reset instructions to your email address. Please follow the link in that email to reset your credentials.
              </p>
              <div className="pt-4">
                <Link to="/login" className="btn-primary w-full text-xs">
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="label">Registered Email Address</label>
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
                        message: 'Valid email address is required',
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

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full py-2.5 text-sm font-semibold shadow-sm"
              >
                Send Password Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

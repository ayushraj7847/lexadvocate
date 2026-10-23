import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Scale, Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/advocates', label: 'Find Advocates' },
    { to: '/practice-areas', label: 'Practice Areas' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ];

  const handleDashboardRedirect = () => {
    setUserMenuOpen(false);
    if (user?.role === 'advocate') {
      navigate('/advocate/dashboard');
    } else {
      navigate('/client/dashboard');
    }
  };

  return (
    <nav className="bg-navy border-b border-navy-dark/40 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary text-white rounded-lg flex items-center justify-center shadow-subtle">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Lex<span className="text-blue-400">Advocate</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white bg-white/15 font-semibold'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-white"
                >
                  <Avatar name={user.name} src={user.avatar} size="sm" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white leading-tight max-w-[120px] truncate">
                      {user.name}
                    </p>
                    <span className="text-[11px] font-semibold text-blue-300 capitalize leading-tight">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-300" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-border shadow-modal py-1 z-50">
                    <div className="px-4 py-2.5 border-b border-border bg-surface">
                      <p className="text-sm font-semibold text-text-primary">{user.name}</p>
                      <p className="text-xs text-text-secondary truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleDashboardRedirect}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-primary hover:bg-blue-50 hover:text-primary transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-primary" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate(user.role === 'advocate' ? '/advocate/profile' : '/client/profile');
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-primary hover:bg-blue-50 hover:text-primary transition-colors"
                    >
                      <User className="w-4 h-4 text-primary" />
                      Profile Settings
                    </button>
                    <div className="border-t border-border my-1" />
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                  location.pathname === link.to
                    ? 'text-white bg-white/15 font-semibold'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10 mt-2 space-y-2 px-2">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleDashboardRedirect();
                    }}
                    className="w-full btn-primary text-center"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="w-full btn-ghost text-rose-300 hover:text-rose-200 hover:bg-white/10 justify-center"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full btn-secondary text-center block"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full btn-primary text-center block"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

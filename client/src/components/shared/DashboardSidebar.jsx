import { NavLink } from 'react-router-dom';
import { Scale, LogOut, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui';

const DashboardSidebar = ({ links, isOpen, onClose }) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-navy border-r border-navy-dark/40 flex flex-col z-50
          transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-subtle">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              Lex<span className="text-blue-300">Advocate</span>
            </span>
          </NavLink>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="px-5 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name} src={user?.avatar} size="md" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm text-white truncate">{user?.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                <span className="text-xs text-slate-300 capitalize font-medium">
                  {user?.role} Portal
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Link Groups */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {links.map((group, idx) => (
            <div key={idx}>
              {group.label && (
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3.5 mb-2">
                  {group.label}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.exact}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `sidebar-link ${
                          isActive ? 'active' : ''
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <NavLink
            to="/"
            className="sidebar-link"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Back to Public Site</span>
          </NavLink>
          <button
            onClick={logout}
            className="w-full sidebar-link text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;

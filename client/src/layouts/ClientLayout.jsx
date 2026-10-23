import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Bell,
  LayoutDashboard,
  Search,
  Calendar,
  Briefcase,
  FileText,
  MessageSquare,
  CreditCard,
  Heart,
  User,
} from 'lucide-react';
import DashboardSidebar from '../components/shared/DashboardSidebar';
import MobileBottomNav from '../components/shared/MobileBottomNav';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/ui';
import api from '../services/api';

const clientNavGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/client/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { to: '/client/find-advocate', label: 'Find Advocate', icon: Search },
    ],
  },
  {
    label: 'Legal Engagements',
    items: [
      { to: '/client/bookings', label: 'My Bookings', icon: Calendar },
      { to: '/client/cases', label: 'My Cases', icon: Briefcase },
    ],
  },
  {
    label: 'Collaboration',
    items: [
      { to: '/client/documents', label: 'Documents', icon: FileText },
      { to: '/client/messages', label: 'Messages', icon: MessageSquare },
      { to: '/client/payments', label: 'Payment History', icon: CreditCard },
      { to: '/client/saved', label: 'Saved Advocates', icon: Heart },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/client/profile', label: 'Profile Settings', icon: User },
    ],
  },
];

const ClientLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await api.get('/notifications');
        if (data.success) {
          setUnreadNotifications(data.data.unreadCount || 0);
        }
      } catch (err) {
        // Silently catch in layout
      }
    };
    fetchUnread();
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <DashboardSidebar
        links={clientNavGroups}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-border px-4 lg:px-8 h-16 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:bg-surface focus:outline-none"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">
                Client Workspace
              </span>
              <h2 className="text-sm font-semibold text-text-primary">
                Welcome back, {user?.name?.split(' ')[0] || 'Client'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/client/notifications"
              className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-white"></span>
              )}
            </Link>

            <div className="h-6 w-px bg-border hidden sm:block"></div>

            <Link
              to="/client/profile"
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-surface transition-colors"
            >
              <Avatar name={user?.name} src={user?.avatar} size="sm" />
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-text-primary leading-tight">
                  {user?.name}
                </p>
                <p className="text-[11px] text-text-muted leading-tight">Client Account</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Dashboard Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <Outlet />
        </main>

        {/* Responsive Mobile Bottom Nav */}
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default ClientLayout;

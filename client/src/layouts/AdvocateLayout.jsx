import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Bell,
  LayoutDashboard,
  User,
  Calendar,
  Briefcase,
  FileText,
  MessageSquare,
  CreditCard,
  Clock,
  Award,
} from 'lucide-react';
import DashboardSidebar from '../components/shared/DashboardSidebar';
import MobileBottomNav from '../components/shared/MobileBottomNav';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/ui';
import api from '../services/api';

const advocateNavGroups = [
  {
    label: 'Practice Dashboard',
    items: [
      { to: '/advocate/dashboard', label: 'Practice Overview', icon: LayoutDashboard, exact: true },
      { to: '/advocate/bookings', label: 'Consultations', icon: Calendar },
      { to: '/advocate/cases', label: 'Case Management', icon: Briefcase },
    ],
  },
  {
    label: 'Client Services',
    items: [
      { to: '/advocate/documents', label: 'Document Review', icon: FileText },
      { to: '/advocate/messages', label: 'Client Messages', icon: MessageSquare },
      { to: '/advocate/earnings', label: 'Earnings & Fees', icon: CreditCard },
      { to: '/advocate/availability', label: 'Working Hours & Slots', icon: Clock },
    ],
  },
  {
    label: 'Advocate Profile',
    items: [
      { to: '/advocate/profile', label: 'Professional Profile', icon: User },
    ],
  },
];

const AdvocateLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await api.get('/notifications');
        if (data.success) {
          setUnreadNotifications(data.data.unreadCount || 0);
        }
      } catch (err) {
        // Silently catch
      }
    };
    fetchUnread();
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <DashboardSidebar
        links={advocateNavGroups}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
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
              <span className="text-xs text-primary font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                Advocate Chambers Portal
              </span>
              <h2 className="text-sm font-semibold text-text-primary">
                {user?.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/advocate/notifications"
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
              to="/advocate/profile"
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-surface transition-colors"
            >
              <Avatar name={user?.name} src={user?.avatar} size="sm" />
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-text-primary leading-tight">
                  {user?.name}
                </p>
                <p className="text-[11px] text-primary font-medium leading-tight">Verified Advocate</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Dashboard Main View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <Outlet />
        </main>

        <MobileBottomNav />
      </div>
    </div>
  );
};

export default AdvocateLayout;

import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Briefcase, MessageSquare, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MobileBottomNav = () => {
  const { user } = useAuth();
  if (!user) return null;

  const isAdvocate = user.role === 'advocate';
  const prefix = isAdvocate ? '/advocate' : '/client';

  const navItems = [
    { to: `${prefix}/dashboard`, label: 'Home', icon: LayoutDashboard },
    { to: `${prefix}/bookings`, label: 'Bookings', icon: Calendar },
    { to: `${prefix}/cases`, label: 'Cases', icon: Briefcase },
    { to: `${prefix}/messages`, label: 'Messages', icon: MessageSquare },
    { to: `${prefix}/profile`, label: 'Profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40 py-2 px-3 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-text-muted hover:text-text-primary'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;

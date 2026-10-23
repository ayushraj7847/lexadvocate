import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Calendar,
  Briefcase,
  CreditCard,
  MessageSquare,
  Clock,
  Trash2,
} from 'lucide-react';
import { Button, Spinner, EmptyState } from '../../components/ui';
import { formatDate } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications');
      if (data.success) {
        setNotifications(data.data.notifications || []);
      }
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      toast.error('Failed to update notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-primary" />;
      case 'case':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-text-muted" />;
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Activity Alerts
          </span>
          <h1 className="text-2xl font-bold text-text-primary mt-0.5">
            Notifications
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Real-time updates regarding consultations, case milestones, and documents
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <Spinner size="lg" />
          <p className="text-xs text-text-secondary mt-3">Loading notifications...</p>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && handleMarkAsRead(n._id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                n.isRead
                  ? 'bg-white border-border'
                  : 'bg-primary-50/40 border-primary-200 shadow-xs'
              }`}
            >
              <div className="p-2 rounded-xl bg-surface shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-text-primary truncate">{n.title}</h4>
                  <span className="text-[10px] text-text-muted shrink-0">
                    {formatDate(n.createdAt)}
                  </span>
                </div>

                <p className="text-xs text-text-secondary mt-1 leading-relaxed">{n.message}</p>

                {n.link && (
                  <Link
                    to={n.link}
                    className="inline-block mt-2 text-[11px] font-semibold text-primary hover:underline"
                  >
                    View Details →
                  </Link>
                )}
              </div>

              {!n.isRead && (
                <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2"></span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card bg-white p-12 text-center">
          <EmptyState
            icon={Bell}
            title="All Caught Up!"
            description="You do not have any unread notifications at this time."
          />
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;

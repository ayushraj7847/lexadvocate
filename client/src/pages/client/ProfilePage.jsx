import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, ShieldCheck, Save, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar, Button } from '../../components/ui';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', {
        name: data.name,
        phone: data.phone,
      });
      if (res.data.success) {
        updateUser(res.data.data.user);
        toast.success('Profile details updated successfully');
      }
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">
          Account Preferences
        </span>
        <h1 className="text-2xl font-bold text-text-primary mt-0.5">
          Profile Settings
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Manage your personal details and contact preferences
        </p>
      </div>

      <div className="card bg-white p-6 sm:p-8 space-y-6">
        {/* User Avatar & Status Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-border">
          <Avatar name={user?.name} src={user?.avatar} size="xl" className="shadow-xs" />
          <div>
            <h3 className="text-base font-bold text-text-primary">{user?.name}</h3>
            <p className="text-xs text-text-secondary capitalize">{user?.role} Account</p>
            <span className="badge bg-green-100 text-success text-[10px] mt-1.5 flex items-center gap-1 w-max">
              <ShieldCheck className="w-3 h-3" /> Account Active & Verified
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label text-xs">Full Legal Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="input-field pl-10 text-xs"
              />
            </div>
            {errors.name && <p className="text-xs text-primary mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label text-xs">Email Address (Read-only)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                disabled
                className="input-field pl-10 text-xs bg-surface text-text-muted cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-text-muted mt-1">
              Email address cannot be modified once verified for security purposes.
            </p>
          </div>

          <div>
            <label className="label text-xs">Primary Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                {...register('phone')}
                className="input-field pl-10 text-xs"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <Button type="submit" variant="primary" size="md" loading={loading}>
              <Save className="w-4 h-4" /> Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

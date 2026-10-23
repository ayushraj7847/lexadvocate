import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      reset();
      toast.success('Thank you! Your message has been routed to our legal concierge team.');
    }, 1000);
  };

  return (
    <div className="bg-surface min-h-[calc(100vh-64px)] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Client Concierge & Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mt-1">
            Get in Touch with LexAdvocate
          </h1>
          <p className="text-sm text-text-secondary mt-2">
            Have questions regarding consultation bookings, advocate verification, or enterprise law firm accounts? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details Card */}
          <div className="card bg-white p-8 space-y-8 lg:col-span-1">
            <div>
              <h3 className="text-base font-bold text-text-primary mb-2">Chambers Headquarters</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Bar Council Marg, High Court Enclave, New Delhi 110001
              </p>
            </div>

            <div className="space-y-4 text-xs text-text-secondary">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary">Telephone</p>
                  <p>+91 (011) 4987-0000</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary">General Inquiries</p>
                  <p>support@lexadvocate.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary">Support Hours</p>
                  <p>Monday - Saturday: 09:00 AM - 08:00 PM IST</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="p-3 bg-primary-50/50 rounded-xl border border-primary-100 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                <p className="text-[11px] text-text-primary font-medium">
                  Verified Bar Council grievance redressal officer available.
                </p>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="card bg-white p-8 lg:col-span-2">
            <h3 className="text-lg font-bold text-text-primary mb-1">Send Us a Direct Message</h3>
            <p className="text-xs text-text-secondary mb-6">
              Fill out the form below and our response team will get back to you within 2 working hours.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label text-xs">Your Name</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="input-field text-xs"
                    placeholder="Adv. / Mr. / Ms."
                  />
                  {errors.name && <p className="text-xs text-primary mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="label text-xs">Email Address</label>
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="input-field text-xs"
                    placeholder="name@example.com"
                  />
                  {errors.email && <p className="text-xs text-primary mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label text-xs">Phone Number</label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="input-field text-xs"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="label text-xs">Subject / Matter Category</label>
                  <select {...register('subject')} className="input-field text-xs">
                    <option value="Consultation Query">Consultation Query</option>
                    <option value="Advocate Onboarding">Advocate Onboarding</option>
                    <option value="Billing & Invoicing">Billing & Invoicing</option>
                    <option value="Technical Support">Technical Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label text-xs">Detailed Inquiry</label>
                <textarea
                  rows={5}
                  {...register('message', { required: 'Please enter your message' })}
                  className="input-field text-xs resize-none"
                  placeholder="Describe your query or case matter requirements..."
                />
                {errors.message && <p className="text-xs text-primary mt-1">{errors.message.message}</p>}
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full sm:w-auto text-xs py-2.5 px-6"
              >
                <Send className="w-3.5 h-3.5" /> Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

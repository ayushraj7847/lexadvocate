import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Clock, AlertCircle, Receipt, ArrowUpRight } from 'lucide-react';
import { Spinner, EmptyState } from '../../components/ui';
import { formatDate, formatCurrency, getStatusColor } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/payments/my');
        if (data.success) {
          setPayments(data.data.payments || []);
        }
      } catch (err) {
        toast.error('Failed to load transaction history');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">
          Billing & Invoicing
        </span>
        <h1 className="text-2xl font-bold text-text-primary mt-0.5">
          Payment & Transaction History
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Review consultation fee receipts, mock transaction IDs, and settlement statuses
        </p>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <Spinner size="lg" />
          <p className="text-xs text-text-secondary mt-3">Loading transaction records...</p>
        </div>
      ) : payments.length > 0 ? (
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface border-b border-border text-text-muted uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-5 py-3.5">Transaction ID</th>
                  <th className="px-5 py-3.5">Advocate / Description</th>
                  <th className="px-5 py-3.5">Amount (INR)</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Method</th>
                  <th className="px-5 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-primary text-[11px]">
                      {p.transactionId}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-text-primary">
                        {p.advocate?.name || 'Advocate Consultation'}
                      </p>
                      <p className="text-[11px] text-text-muted">
                        {p.description || 'Consultation fee'}
                      </p>
                    </td>

                    <td className="px-5 py-4 font-bold text-text-primary">
                      {formatCurrency(p.amount)}
                    </td>

                    <td className="px-5 py-4 text-text-secondary">
                      {formatDate(p.createdAt)}
                    </td>

                    <td className="px-5 py-4 capitalize font-medium text-text-secondary">
                      {p.paymentMethod || 'Mock Adapter'}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span className={`badge ${getStatusColor(p.status)} text-[10px]`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card bg-white p-12 text-center">
          <EmptyState
            icon={Receipt}
            title="No Transactions Recorded"
            description="You have not made any consultation payments yet. Payments will appear here with downloadable receipts."
          />
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;

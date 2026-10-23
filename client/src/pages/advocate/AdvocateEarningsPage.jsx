import { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, DollarSign, Calendar, ArrowUpRight, Receipt } from 'lucide-react';
import { Spinner, EmptyState } from '../../components/ui';
import { formatDate, formatCurrency, getStatusColor } from '../../utils/formatters';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdvocateEarningsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/payments/my');
        if (data.success) {
          setPayments(data.data.payments || []);
        }
      } catch (err) {
        toast.error('Failed to load earnings history');
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  const totalEarnings = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-wider">
          Financial Management
        </span>
        <h1 className="text-2xl font-bold text-text-primary mt-0.5">
          Earnings & Remittances
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Track received consultation fee payments, client settlements, and receipts
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 bg-white border border-border">
          <span className="text-xs text-text-muted font-medium">Total Fees Collected</span>
          <p className="text-2xl font-black text-primary mt-1">{formatCurrency(totalEarnings)}</p>
          <span className="text-[11px] text-success font-semibold mt-0.5 block flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 100% Retained by Chambers
          </span>
        </div>

        <div className="card p-5 bg-white border border-border">
          <span className="text-xs text-text-muted font-medium">Paid Consultations</span>
          <p className="text-2xl font-bold text-text-primary mt-1">
            {payments.filter((p) => p.status === 'completed').length}
          </p>
          <span className="text-[11px] text-text-muted mt-0.5 block">Completed sessions</span>
        </div>

        <div className="card p-5 bg-white border border-border">
          <span className="text-xs text-text-muted font-medium">Payout Mode</span>
          <p className="text-base font-bold text-text-primary mt-2">Direct Settlement</p>
          <span className="text-[11px] text-text-muted mt-0.5 block">Automated Bank Transfer</span>
        </div>
      </div>

      {/* Payments History Table */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <Spinner size="lg" />
          <p className="text-xs text-text-secondary mt-3">Loading financial records...</p>
        </div>
      ) : payments.length > 0 ? (
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs">
          <div className="p-4 border-b border-border">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Fee Remittance Ledger
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface border-b border-border text-text-muted uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-5 py-3.5">Transaction Ref</th>
                  <th className="px-5 py-3.5">Consulting Client</th>
                  <th className="px-5 py-3.5">Fee Amount</th>
                  <th className="px-5 py-3.5">Remittance Date</th>
                  <th className="px-5 py-3.5 text-right">Settlement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-primary text-[11px]">
                      {p.transactionId}
                    </td>

                    <td className="px-5 py-4 font-semibold text-text-primary">
                      {p.client?.name || 'Verified Client'}
                    </td>

                    <td className="px-5 py-4 font-bold text-text-primary">
                      {formatCurrency(p.amount)}
                    </td>

                    <td className="px-5 py-4 text-text-secondary">
                      {formatDate(p.createdAt)}
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
            title="No Remittances Recorded"
            description="Fee payments from confirmed client consultations will appear in this ledger."
          />
        </div>
      )}
    </div>
  );
};

export default AdvocateEarningsPage;

import { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { Balance } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { DollarSign } from 'lucide-react';

interface EarningsViewProps {
  username: string;
  showNotification: (msg: string, type: 'success' | 'error' | 'warning') => void;
}

export default function EarningsView({ username, showNotification }: EarningsViewProps) {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data = await apiFetch('/balance');
        setBalance(data);
      } catch (err) {
        showNotification('Failed to load earnings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!balance) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl h-64">
        <DollarSign className="w-12 h-12 text-slate-600 mb-4" />
        <h3 className="text-slate-400 font-bold text-lg">Unable to load earnings</h3>
      </div>
    );
  }

  return (
    <div className="pb-24 space-y-6">
      <h2 className="text-xl font-bold text-white mb-4">Earnings</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Available</div>
          <div className="text-3xl font-mono font-bold text-green-400">
            ${Number(balance.balance).toFixed(2)}
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Pending Verification</div>
          <div className="text-3xl font-mono font-bold text-amber-400">
            ${Number(balance.pending_amount).toFixed(2)}
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">All Time</div>
          <div className="text-3xl font-mono font-bold text-white">
            ${Number(balance.lifetime_earnings).toFixed(2)}
          </div>
        </div>
      </div>

      <p className="text-slate-400 text-sm italic">
        Payouts are processed manually by your operator. Contact them directly to arrange withdrawal.
      </p>

      <div className="mt-8 pt-8 border-t border-slate-800">
        <h3 className="text-sm font-bold text-white mb-4">Account Info</h3>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <div className="text-white font-bold text-lg">u/{username}</div>
            <div className="text-slate-500 text-xs mt-1">Registered Poster</div>
          </div>
          <div className="px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-bold uppercase text-slate-400">
            Active
          </div>
        </div>
      </div>
    </div>
  );
}

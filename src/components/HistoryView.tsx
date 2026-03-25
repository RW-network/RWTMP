import { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { Submission } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { RefreshCw, FileText } from 'lucide-react';

interface HistoryViewProps {
  showNotification: (msg: string, type: 'success' | 'error' | 'warning') => void;
}

export default function HistoryView({ showNotification }: HistoryViewProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchHistory = async (isRefresh = false, nextCursor?: string) => {
    try {
      if (isRefresh) setRefreshing(true);
      const url = `/submissions?limit=50${nextCursor ? `&cursor=${nextCursor}` : ''}`;
      const data = await apiFetch(url);
      
      const newSubs = Array.isArray(data) ? data : data.submissions || [];
      if (nextCursor) {
        setSubmissions(prev => [...prev, ...newSubs]);
      } else {
        setSubmissions(newSubs);
      }
      setCursor(data.next_cursor || null);
    } catch (err) {
      showNotification('Failed to load history', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'cleared':
        return <span className="px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-[10px] font-bold uppercase text-green-400">Cleared</span>;
      case 'failed':
        return <span className="px-2 py-1 rounded-md bg-red-900/20 border border-red-900/30 text-[10px] font-bold uppercase text-red-400">Failed</span>;
      case 'expired':
        return <span className="px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-bold uppercase text-slate-500">Expired</span>;
      case 'pending_verification':
      default:
        return <span className="px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-bold uppercase text-slate-400">Pending</span>;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="pb-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Submission History</h2>
        <button 
          onClick={() => fetchHistory(true)}
          disabled={refreshing}
          className="text-slate-400 hover:text-white transition-colors p-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl h-64">
          <FileText className="w-12 h-12 text-slate-600 mb-4" />
          <h3 className="text-slate-400 font-bold text-lg">No submissions yet</h3>
          <p className="text-slate-600 text-sm mt-2">Complete your first task to see your history here.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="divide-y divide-slate-800">
            {submissions.map((sub) => (
              <div key={sub.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <a 
                    href={sub.post_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 text-sm font-medium truncate block mb-1"
                  >
                    {sub.post_url.length > 40 ? sub.post_url.substring(0, 40) + '...' : sub.post_url}
                  </a>
                  <div className="text-slate-400 text-xs">
                    {new Date(sub.submitted_at).toLocaleDateString()} {new Date(sub.submitted_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  {getStatusBadge(sub.status)}
                  <span className={`font-mono font-bold ${sub.status === 'cleared' ? 'text-green-400' : 'text-slate-500'}`}>
                    ${Number(sub.payout).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {cursor && (
            <div className="p-4 border-t border-slate-800 flex justify-center">
              <button
                onClick={() => {
                  setLoadingMore(true);
                  fetchHistory(false, cursor);
                }}
                disabled={loadingMore}
                className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {loadingMore ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

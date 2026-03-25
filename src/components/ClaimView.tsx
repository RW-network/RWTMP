import { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { Copy, Check } from 'lucide-react';

interface ClaimViewProps {
  claim: any;
  onClearClaim: () => void;
  showNotification: (msg: string, type: 'success' | 'error' | 'warning') => void;
  setView: (view: string) => void;
}

export default function ClaimView({ claim, onClearClaim, showNotification, setView }: ClaimViewProps) {
  const [postUrl, setPostUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [expired, setExpired] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const updateTimer = () => {
      const expiresAt = new Date(claim.expires_at).getTime();
      const now = new Date().getTime();
      const distance = expiresAt - now;

      if (distance < 0) {
        setExpired(true);
        setTimeLeft('00:00');
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [claim.expires_at]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showNotification('Copied!', 'success');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postUrl.startsWith('https://reddit.com/') && !postUrl.startsWith('https://www.reddit.com/')) {
      showNotification('URL must be a direct link to your Reddit post starting with https://reddit.com/', 'error');
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/submit', {
        method: 'POST',
        body: JSON.stringify({ claim_id: claim.claim_id, post_url: postUrl })
      });
      showNotification(`Submitted! Your post is being verified. You'll earn $${Number(claim.payout).toFixed(2)} once cleared.`, 'success');
      onClearClaim();
      setView('history');
    } catch (err: any) {
      showNotification(err.data?.message || 'Failed to submit post URL', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (expired) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-64">
        <h3 className="text-red-400 font-bold text-lg mb-2">Claim expired</h3>
        <p className="text-slate-400 text-sm mb-6">You did not submit the post URL in time.</p>
        <button
          onClick={() => {
            onClearClaim();
            setView('board');
          }}
          className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Back to board
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center sticky top-0 z-10 -mx-4 px-4 mb-4">
        <div>
          <h2 className="font-bold text-white">Active Task: r/{claim.subreddit}</h2>
          <div className="font-mono text-indigo-400 text-sm">Expires in: {timeLeft}</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg">
          <span className="text-xl font-mono font-bold text-green-400">${Number(claim.payout).toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-yellow-900/20 border-b border-yellow-700/30 p-3 flex gap-3 items-center justify-center -mx-4 px-4 mb-6">
        <p className="text-yellow-400 text-xs text-center font-medium">
          Keep the post live for at least 2 weeks after it clears. Removing it early may result in suspension.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Post Title</label>
              <button onClick={() => handleCopy(claim.post_content.title, 'title')} className="text-slate-400 hover:text-white">
                {copiedField === 'title' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <textarea
              readOnly
              value={claim.post_content.title}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none resize-none h-20"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Post Body</label>
              <button onClick={() => handleCopy(claim.post_content.body, 'body')} className="text-slate-400 hover:text-white">
                {copiedField === 'body' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <textarea
              readOnly
              value={claim.post_content.body}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none resize-y min-h-[150px]"
            />
          </div>
        </div>

        <div className="space-y-6">
          {claim.post_content.note && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Instructions</label>
              <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 text-slate-300 text-sm whitespace-pre-wrap">
                {claim.post_content.note}
              </div>
            </div>
          )}

          {claim.post_content.hooks && claim.post_content.hooks.length > 0 && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Hooks</label>
              <div className="space-y-2">
                {claim.post_content.hooks.map((hook: string, i: number) => (
                  <div key={i} className="flex justify-between items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
                    <span className="text-sm text-slate-300 truncate mr-2">{hook}</span>
                    <button onClick={() => handleCopy(hook, `hook-${i}`)} className="text-slate-400 hover:text-white shrink-0">
                      {copiedField === `hook-${i}` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <hr className="border-slate-800" />

          <form onSubmit={handleSubmit}>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Submit Your Post URL</label>
            <input
              type="url"
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              placeholder="https://reddit.com/r/..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors mb-3"
              required
            />
            <button
              type="submit"
              disabled={loading || !postUrl.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? <div className="animate-spin border-white border-t-transparent rounded-full w-5 h-5 border-2"></div> : 'Submit Post'}
            </button>
            <p className="text-slate-500 text-xs mt-2 text-center">URL must be a direct link to your Reddit post</p>
          </form>
        </div>
      </div>
    </div>
  );
}

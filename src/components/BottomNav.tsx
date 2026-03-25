import { LayoutDashboard, CheckSquare, Clock, DollarSign } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  setView: (view: string) => void;
  hasActiveClaim: boolean;
}

export default function BottomNav({ currentView, setView, hasActiveClaim }: BottomNavProps) {
  const navItems = [
    { id: 'board', label: 'Board', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'claim', label: 'Active', icon: <CheckSquare className="w-5 h-5" />, disabled: !hasActiveClaim },
    { id: 'history', label: 'History', icon: <Clock className="w-5 h-5" /> },
    { id: 'earnings', label: 'Earnings', icon: <DollarSign className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 pb-safe z-40">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => !item.disabled && setView(item.id)}
            disabled={item.disabled}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              currentView === item.id 
                ? 'text-indigo-400' 
                : item.disabled 
                  ? 'text-slate-700 cursor-not-allowed' 
                  : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

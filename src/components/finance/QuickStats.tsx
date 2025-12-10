import { BarChart3, Trophy, Tag, Hash } from 'lucide-react';

interface QuickStatsProps {
  transactionCount: number;
  biggestExpense?: { amount: number; category: string; description: string };
  topCategory?: { name: string; amount: number };
}

export function QuickStats({ transactionCount, biggestExpense, topCategory }: QuickStatsProps) {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <Hash className="w-4 h-4" />
          <span className="text-xs font-bold uppercase">Total Entries</span>
        </div>
        <p className="font-bangers text-2xl">{transactionCount}</p>
      </div>

      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <Trophy className="w-4 h-4 text-warning" />
          <span className="text-xs font-bold uppercase">Biggest Expense</span>
        </div>
        <p className="font-bangers text-2xl text-expense">
          {biggestExpense ? formatMoney(biggestExpense.amount) : '₹0'}
        </p>
        {biggestExpense && (
          <p className="text-xs text-muted-foreground truncate">{biggestExpense.category}</p>
        )}
      </div>

      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <Tag className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold uppercase">Top Category</span>
        </div>
        <p className="font-bangers text-xl truncate">
          {topCategory ? topCategory.name : 'None yet'}
        </p>
        {topCategory && (
          <p className="text-xs text-muted-foreground">{formatMoney(topCategory.amount)}</p>
        )}
      </div>

      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <BarChart3 className="w-4 h-4 text-balance" />
          <span className="text-xs font-bold uppercase">Status</span>
        </div>
        <p className="font-bangers text-xl">
          {transactionCount === 0
            ? '🆕 Fresh Start'
            : transactionCount < 10
            ? '🌱 Growing'
            : transactionCount < 50
            ? '💪 On Track'
            : '🏆 Pro Budgeter'}
        </p>
      </div>
    </div>
  );
}

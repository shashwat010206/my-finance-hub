import { TrendingUp, TrendingDown, Wallet, Sparkles } from 'lucide-react';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export function SummaryCards({ totalIncome, totalExpense, balance }: SummaryCardsProps) {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Income Card */}
      <div className="money-card group">
        <div className="absolute -top-4 -right-4 text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
          📈
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-income/20">
            <TrendingUp className="w-5 h-5 text-income" />
          </div>
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
            Total Income
          </span>
        </div>
        <p className="text-3xl font-bangers text-income tracking-wide">
          {formatMoney(totalIncome)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Paisa hi paisa! 💰</p>
      </div>

      {/* Expense Card */}
      <div className="money-card group">
        <div className="absolute -top-4 -right-4 text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
          🔥
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-expense/20">
            <TrendingDown className="w-5 h-5 text-expense" />
          </div>
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
            Total Expenses
          </span>
        </div>
        <p className="text-3xl font-bangers text-expense tracking-wide">
          {formatMoney(totalExpense)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Kharcha unlimited 😅</p>
      </div>

      {/* Balance Card */}
      <div className="money-card group border-2 border-balance/30">
        <div className="absolute -top-4 -right-4 text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
          {balance >= 0 ? '🚀' : '💀'}
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-balance/20">
            <Wallet className="w-5 h-5 text-balance" />
          </div>
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
            Balance
          </span>
          {balance > 0 && <Sparkles className="w-4 h-4 text-secondary animate-pulse" />}
        </div>
        <p className={`text-3xl font-bangers tracking-wide ${balance >= 0 ? 'text-balance' : 'text-expense'}`}>
          {formatMoney(balance)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {balance >= 0 ? 'Stonks! 📈' : 'Not stonks 📉'}
        </p>
      </div>
    </div>
  );
}

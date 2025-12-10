import { useState } from 'react';
import { Trash2, Edit2, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Transaction, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types/finance';
import { TransactionForm } from './TransactionForm';

interface TransactionListProps {
  transactions: Transaction[];
  onUpdate: (id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onUpdate, onDelete }: TransactionListProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">📈 Income</SelectItem>
            <SelectItem value="expense">📉 Expense</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {allCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-6xl mb-4">🤷</p>
            <p className="font-bold text-lg">No transactions found!</p>
            <p className="text-sm">Add some to get started 💪</p>
          </div>
        ) : (
          filteredTransactions.map((t, index) => (
            <div
              key={t.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-md transition-all slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Category Icon */}
              <div
                className={`text-2xl p-2 rounded-xl ${
                  t.type === 'income' ? 'bg-income/10' : 'bg-expense/10'
                }`}
              >
                {t.category.split(' ')[0]}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{t.category.slice(2).trim()}</p>
                {t.description && (
                  <p className="text-sm text-muted-foreground truncate">{t.description}</p>
                )}
                <p className="text-xs text-muted-foreground">{formatDate(t.date)}</p>
              </div>

              {/* Amount */}
              <div className="text-right">
                <p
                  className={`font-bangers text-xl ${
                    t.type === 'income' ? 'text-income' : 'text-expense'
                  }`}
                >
                  {t.type === 'income' ? '+' : '-'}{formatMoney(t.amount)}
                </p>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    t.type === 'income' ? 'income-badge' : 'expense-badge'
                  }`}
                >
                  {t.type}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-1">
                <TransactionForm
                  initialData={t}
                  onSubmit={(updates) => onUpdate(t.id, updates)}
                  trigger={
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  }
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-bangers text-xl">Delete Transaction? 🗑️</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this transaction. Are you sure?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Nah, keep it</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(t.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Yes, delete it! 💀
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Transaction, TransactionType, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types/finance';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  initialData?: Transaction;
  trigger?: React.ReactNode;
}

export function TransactionForm({ onSubmit, initialData, trigger }: TransactionFormProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TransactionType>(initialData?.type || 'expense');
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onSubmit({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
    });

    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setOpen(false);
  };

  const resetForm = () => {
    setType(initialData?.type || 'expense');
    setAmount(initialData?.amount?.toString() || '');
    setCategory(initialData?.category || '');
    setDescription(initialData?.description || '');
    setDate(initialData?.date || new Date().toISOString().split('T')[0]);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) resetForm(); }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="fun-button bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2">
            <Plus className="w-5 h-5" />
            Add Transaction
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bangers text-2xl tracking-wide flex items-center gap-2">
            {initialData ? 'Edit' : 'New'} Transaction 
            <span className="text-2xl">{type === 'income' ? '💰' : '💸'}</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Toggle */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === 'income' ? 'default' : 'outline'}
              className={`flex-1 font-bold ${type === 'income' ? 'bg-income text-primary-foreground' : ''}`}
              onClick={() => { setType('income'); setCategory(''); }}
            >
              📈 Income
            </Button>
            <Button
              type="button"
              variant={type === 'expense' ? 'default' : 'outline'}
              className={`flex-1 font-bold ${type === 'expense' ? 'bg-expense text-primary-foreground' : ''}`}
              onClick={() => { setType('expense'); setCategory(''); }}
            >
              📉 Expense
            </Button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="font-bold">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg font-bold"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="font-bold">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="font-bold">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-bold">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="What's this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className={`w-full fun-button font-bold text-lg ${
              type === 'income' 
                ? 'bg-income hover:bg-income/90' 
                : 'bg-expense hover:bg-expense/90'
            } text-primary-foreground`}
          >
            {initialData ? 'Update' : 'Add'} {type === 'income' ? '💰' : '💸'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

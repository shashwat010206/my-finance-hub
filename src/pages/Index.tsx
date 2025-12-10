import { MemeHeader } from '@/components/finance/MemeHeader';
import { SummaryCards } from '@/components/finance/SummaryCards';
import { TransactionForm } from '@/components/finance/TransactionForm';
import { TransactionList } from '@/components/finance/TransactionList';
import { QuickStats } from '@/components/finance/QuickStats';
import { DataActions } from '@/components/finance/DataActions';
import { useFinanceData } from '@/hooks/useFinanceData';

const Index = () => {
  const {
    transactions,
    isLoaded,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    exportData,
    importData,
    clearAllData,
    stats,
  } = useFinanceData();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">💰</div>
          <p className="font-bangers text-2xl">Loading your monies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8 px-4 space-y-8">
        {/* Header */}
        <MemeHeader />

        {/* Summary Cards */}
        <SummaryCards
          totalIncome={stats.totalIncome}
          totalExpense={stats.totalExpense}
          balance={stats.balance}
        />

        {/* Quick Stats */}
        <QuickStats
          transactionCount={stats.transactionCount}
          biggestExpense={stats.biggestExpense}
          topCategory={stats.topCategory}
        />

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border">
          <div>
            <h2 className="font-bangers text-2xl">Transactions</h2>
            <p className="text-sm text-muted-foreground">
              {transactions.length} total entries
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <DataActions
              onExport={exportData}
              onImport={importData}
              onClear={clearAllData}
              transactionCount={transactions.length}
            />
            <TransactionForm onSubmit={addTransaction} />
          </div>
        </div>

        {/* Transaction List */}
        <TransactionList
          transactions={transactions}
          onUpdate={updateTransaction}
          onDelete={deleteTransaction}
        />

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground py-8 border-t border-border">
          <p>Made with 💖 and chai ☕</p>
          <p className="text-xs mt-1">Your data stays in your browser 🔒</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;

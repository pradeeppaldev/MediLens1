import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseChart from '../components/ExpenseChart';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { IndianRupee, Calendar, Filter, Trash2, Plus, TrendingUp, PieChart, Receipt, ArrowUpDown } from 'lucide-react';
import { INDIAN_EXPENSES } from '../data/indianClinicalData';
import { toast } from 'sonner';

const ExpenseTracker = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  useEffect(() => {
    if (!user) {
      setExpenses(INDIAN_EXPENSES);
      setLoading(false);
      return;
    }

    const unsubExpenses = onSnapshot(collection(db, `users/${user.uid}/expenses`), (snapshot) => {
      const expenseData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date
      }));

      if (expenseData.length > 0) {
        setExpenses(expenseData);
      } else {
        setExpenses(INDIAN_EXPENSES);
      }
      setLoading(false);
    }, (err) => {
      console.warn('Using Indian medical expense ledger fallback');
      setExpenses(INDIAN_EXPENSES);
      setLoading(false);
    });

    return () => unsubExpenses();
  }, [user]);

  const filteredAndSortedExpenses = React.useMemo(() => {
    let filtered = [...expenses];

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(expense => expense.category === categoryFilter);
    }

    // Apply time range filter
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(0); // All time
    }

    filtered = filtered.filter(expense => {
      const expenseDate = expense.date?.seconds
        ? new Date(expense.date.seconds * 1000)
        : new Date(expense.date || 0);
      return expenseDate >= startDate;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      const aTime = a.date?.seconds ? a.date.seconds * 1000 : new Date(a.date || 0).getTime();
      const bTime = b.date?.seconds ? b.date.seconds * 1000 : new Date(b.date || 0).getTime();

      switch (sortBy) {
        case 'date-desc': return bTime - aTime;
        case 'date-asc': return aTime - bTime;
        case 'cost-desc': return (b.cost || 0) - (a.cost || 0);
        case 'cost-asc': return (a.cost || 0) - (b.cost || 0);
        case 'category': return (a.category || '').localeCompare(b.category || '');
        default: return 0;
      }
    });

    return filtered;
  }, [expenses, timeRange, categoryFilter, sortBy]);

  const totalExpenses = filteredAndSortedExpenses.reduce((sum, expense) => sum + (expense.cost || 0), 0);
  const categories = [...new Set(expenses.map(expense => expense.category).filter(Boolean))];

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;
    try {
      if (user && !user.isDemo && expenseToDelete.id?.length > 10) {
        await deleteDoc(doc(db, `users/${user.uid}/expenses`, expenseToDelete.id));
      }
      setExpenses(prev => prev.filter(e => e.id !== expenseToDelete.id));
      toast.success('Expense removed from records');
      setShowDeleteModal(false);
      setExpenseToDelete(null);
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Healthcare Expense Ledger (₹ INR)
            </h1>
            <Badge variant="outline" className="font-bold text-xs bg-primary/5 text-primary">
              ₹ Indian Rupees
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Out-of-pocket Indian prescription bills, Apollo / MedPlus receipts, lab tests, and doctor consultations.
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          size="sm"
          className="rounded-xl text-xs font-bold gap-1.5 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Add Expense Record
        </Button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Healthcare Outlay</span>
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-2 tabular-numbers">
            ₹{totalExpenses.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Across {filteredAndSortedExpenses.length} medical receipts in this timeframe
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Average / Entry</span>
            <div className="h-9 w-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-2 tabular-numbers">
            ₹{filteredAndSortedExpenses.length > 0 ? Math.round(totalExpenses / filteredAndSortedExpenses.length).toLocaleString('en-IN') : '0'}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Per-item clinical expenditure average
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Spending Categories</span>
            <div className="h-9 w-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <PieChart className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-2 tabular-numbers">
            {categories.length || 4}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Prescriptions, Diagnostics, Devices, OPD Fees
          </p>
        </div>
      </div>

      {/* Filter and Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border border-border/80 bg-muted/30">
        <div className="flex flex-wrap items-center gap-2">
          {/* Time range segmented control */}
          <div className="flex items-center p-1 rounded-xl bg-muted/70 border border-border/60">
            {[
              { id: 'week', label: '7D' },
              { id: 'month', label: '1M' },
              { id: 'quarter', label: '1Q' },
              { id: 'year', label: '1Y' },
              { id: 'all', label: 'All' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTimeRange(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-120 ${
                  timeRange === tab.id
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-8 w-[160px] text-xs rounded-xl font-medium">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-8 w-[170px] text-xs rounded-xl font-medium">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="cost-desc">Highest Cost</SelectItem>
              <SelectItem value="cost-asc">Lowest Cost</SelectItem>
              <SelectItem value="category">Category (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Expense Visualization Chart */}
      {filteredAndSortedExpenses.length > 0 && (
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">
              Healthcare Spending Analytics (₹)
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Cost allocation by category and historical trend.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ExpenseChart expenses={filteredAndSortedExpenses} />
          </CardContent>
        </Card>
      )}

      {/* Ledger Table / List */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="text-base font-bold text-foreground">
            Receipts & Invoices Ledger
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Itemized breakdown of verified out-of-pocket medical expenses.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAndSortedExpenses.length > 0 ? (
            <div className="divide-y divide-border/60">
              {filteredAndSortedExpenses.map((expense) => {
                const dateObj = expense.date?.seconds
                  ? new Date(expense.date.seconds * 1000)
                  : new Date(expense.date || Date.now());

                return (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 font-bold">
                        <Receipt className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-foreground truncate">
                          {expense.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            {dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          {expense.pharmacy && <span>• {expense.pharmacy}</span>}
                          {expense.receiptId && (
                            <span className="hidden sm:inline font-mono text-[10px] bg-muted px-1.5 py-0.2 rounded border border-border/50">
                              {expense.receiptId}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <div className="text-right">
                        <p className="text-sm sm:text-base font-extrabold text-foreground tabular-numbers">
                          ₹{Number(expense.cost || 0).toLocaleString('en-IN')}
                        </p>
                        <Badge variant="secondary" className="text-[10px] font-bold mt-0.5">
                          {expense.category || 'Medical'}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setExpenseToDelete(expense);
                          setShowDeleteModal(true);
                        }}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No transactions match the selected timeframe or category filters.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Expense Modal */}
      <ExpenseForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onExpenseAdded={() => {
          setShowAddModal(false);
          toast.success('Medical expense recorded');
        }}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-destructive">
              Delete Expense Entry?
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to remove <strong className="text-foreground">{expenseToDelete?.name}</strong> (₹{expenseToDelete?.cost}) from your health ledger?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(false)}
              className="rounded-xl text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteExpense}
              className="rounded-xl text-xs font-bold"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpenseTracker;

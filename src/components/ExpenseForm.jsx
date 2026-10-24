import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Plus, Calendar, Tag, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const ExpenseForm = ({ isOpen, onClose, onExpenseAdded }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    category: 'Prescription',
    pharmacy: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Prescription',
    'Doctor Consultation',
    'Lab Tests',
    'Diagnostics',
    'Medical Device',
    'Supplements',
    'Hospital Care',
    'Other'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Item or medicine name is required');
      return false;
    }
    if (!formData.cost || isNaN(formData.cost) || parseFloat(formData.cost) <= 0) {
      setError('Please enter a valid cost in INR (greater than 0)');
      return false;
    }
    if (!formData.category) {
      setError('Please select an expenditure category');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const expenseData = {
        name: formData.name.trim(),
        cost: parseFloat(formData.cost),
        category: formData.category,
        pharmacy: formData.pharmacy.trim() || 'Pharmacy / Clinic',
        date: new Date(formData.date),
        createdAt: new Date(),
        userId: user ? user.uid : 'demo'
      };

      if (user && !user.isDemo) {
        await addDoc(collection(db, `users/${user.uid}/expenses`), expenseData);
      }

      toast.success(`Expense saved: ₹${parseFloat(formData.cost).toLocaleString('en-IN')} for ${formData.name}`);

      setFormData({
        name: '',
        cost: '',
        category: 'Prescription',
        pharmacy: '',
        date: new Date().toISOString().split('T')[0]
      });

      if (onExpenseAdded) onExpenseAdded();
      if (onClose) onClose();
    } catch (err) {
      console.error('Error adding expense:', err);
      setError('Failed to record expense. Please try again.');
      toast.error('Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="item-name" className="text-xs font-semibold">
          Expense / Item Name *
        </Label>
        <Input
          id="item-name"
          placeholder="e.g. Telma 40 Monthly Refill, Apollo Pharmacy"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="h-10 text-xs rounded-xl"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="item-cost" className="text-xs font-semibold">
            Cost (₹ INR) *
          </Label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">₹</span>
            <Input
              id="item-cost"
              type="number"
              step="1"
              min="1"
              placeholder="e.g. 840"
              value={formData.cost}
              onChange={(e) => handleInputChange('cost', e.target.value)}
              className="pl-8 h-10 text-xs rounded-xl tabular-numbers font-medium"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="item-category" className="text-xs font-semibold">
            Category *
          </Label>
          <Select
            value={formData.category}
            onValueChange={(val) => handleInputChange('category', val)}
          >
            <SelectTrigger id="item-category" className="h-10 text-xs rounded-xl">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} className="text-xs">{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="item-pharmacy" className="text-xs font-semibold">
            Pharmacy / Clinic Provider
          </Label>
          <Input
            id="item-pharmacy"
            placeholder="e.g. Apollo Pharmacy, Dr. Lal PathLabs"
            value={formData.pharmacy}
            onChange={(e) => handleInputChange('pharmacy', e.target.value)}
            className="h-10 text-xs rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="item-date" className="text-xs font-semibold">
            Expense Date *
          </Label>
          <Input
            id="item-date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="h-10 text-xs rounded-xl"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-3 border-t border-border/50">
        {onClose && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl text-xs font-bold"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          className="rounded-xl text-xs font-bold"
          disabled={loading}
        >
          {loading ? 'Recording...' : 'Save Expense (₹)'}
        </Button>
      </div>
    </form>
  );

  if (isOpen !== undefined) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Record Medical Expense</DialogTitle>
            <DialogDescription className="text-xs">
              Log out-of-pocket Indian prescription or healthcare expenditure in INR (₹).
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return content;
};

export default ExpenseForm;

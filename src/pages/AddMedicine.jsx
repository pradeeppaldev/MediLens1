import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Pill, Save, ArrowLeft, Clock, Calendar, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const AddMedicine = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    instructions: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: '',
    scheduleTimes: ['08:00']
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    if (formData.frequency) {
      const numDoses = formData.frequency === 'Once daily' ? 1 :
                       formData.frequency === 'Twice daily' ? 2 :
                       formData.frequency === 'Three times daily' ? 3 :
                       formData.frequency === 'Four times daily' ? 4 : 1;
      const defaultTimes = [];
      for (let i = 0; i < numDoses; i++) {
        if (i === 0) defaultTimes.push('08:00');
        else if (i === 1) defaultTimes.push('20:00');
        else if (i === 2) defaultTimes.push('12:00');
        else if (i === 3) defaultTimes.push('16:00');
      }
      setFormData(prev => ({ ...prev, scheduleTimes: defaultTimes }));
    }
  }, [formData.frequency]);

  const handleTimeChange = (index, value) => {
    const newTimes = [...formData.scheduleTimes];
    newTimes[index] = value;
    setFormData(prev => ({ ...prev, scheduleTimes: newTimes }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be signed in to add medications');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Medication name is required');
      return;
    }

    if (!formData.dosage.trim()) {
      toast.error('Dosage is required (e.g. 500mg, 1 tablet)');
      return;
    }

    setLoading(true);
    try {
      const medicineData = {
        ...formData,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true,
        enableNotifications: true,
        doses: []
      };

      const medicinesRef = collection(db, `users/${user.uid}/medicines`);
      await addDoc(medicinesRef, medicineData);

      toast.success(`${formData.name} added to your regimen!`);
      navigate('/medications');
    } catch (error) {
      console.error('Error adding medicine:', error);
      toast.error('Failed to add medicine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-3 pb-2 border-b border-border/40">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-9 w-9 rounded-xl border-border/60 hover:bg-muted active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Add Medication
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Configure dosage, daily intervals, and administration guidance.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-border/70 shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Pill className="h-4 w-4 text-primary" />
              Medication Details
            </CardTitle>
            <CardDescription className="text-xs">
              Fill in all clinical parameters for accurate reminder notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="med-name" className="text-xs font-semibold">
                  Medication Name *
                </Label>
                <Input
                  id="med-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. Amoxicillin, Lisinopril"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="med-dosage" className="text-xs font-semibold">
                  Dosage / Strength *
                </Label>
                <Input
                  id="med-dosage"
                  value={formData.dosage}
                  onChange={(e) => handleInputChange('dosage', e.target.value)}
                  placeholder="e.g. 500mg, 10ml, 1 capsule"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="med-freq" className="text-xs font-semibold">
                Frequency
              </Label>
              <Select
                value={formData.frequency}
                onValueChange={(val) => handleInputChange('frequency', val)}
              >
                <SelectTrigger id="med-freq">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Once daily">Once daily (1 dose/day)</SelectItem>
                  <SelectItem value="Twice daily">Twice daily (Morning & Evening)</SelectItem>
                  <SelectItem value="Three times daily">Three times daily (Every 8 hours)</SelectItem>
                  <SelectItem value="Four times daily">Four times daily (Every 6 hours)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Schedule Times */}
            <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border/60">
              <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Daily Dose Times ({formData.scheduleTimes.length} per day)
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {formData.scheduleTimes.map((time, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Dose #{idx + 1}
                    </span>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => handleTimeChange(idx, e.target.value)}
                      className="tabular-numbers text-xs h-9 bg-background"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="med-start" className="text-xs font-semibold">
                  Start Date
                </Label>
                <Input
                  id="med-start"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="med-end" className="text-xs font-semibold">
                  End Date (Optional)
                </Label>
                <Input
                  id="med-end"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  placeholder="Continuous if left blank"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="med-inst" className="text-xs font-semibold">
                Administration Instructions
              </Label>
              <Input
                id="med-inst"
                value={formData.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                placeholder="e.g. Take with food, drink full glass of water, do not crush"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="med-notes" className="text-xs font-semibold">
                Additional Notes or Warnings
              </Label>
              <Textarea
                id="med-notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Prescribing physician, refill prescription number, special considerations..."
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 pt-4 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="rounded-xl text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl text-xs font-semibold gap-1.5 px-5"
            >
              <Save className="h-3.5 w-3.5" />
              {loading ? 'Saving...' : 'Save Medication'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default AddMedicine;

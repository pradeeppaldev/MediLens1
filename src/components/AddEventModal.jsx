import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Plus } from 'lucide-react';
import { toast } from 'sonner';

const AddEventModal = ({ isOpen, onClose, onAdd, prefillTitle = '', prefillNotes = '' }) => {
  const [formData, setFormData] = useState({
    type: 'appointment',
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    notes: '',
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      title: prefillTitle || prev.title,
      notes: prefillNotes || prev.notes,
    }));
  }, [prefillTitle, prefillNotes]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Event title is required');
      return;
    }
    if (!formData.date) {
      toast.error('Event date is required');
      return;
    }

    onAdd(formData);
    setFormData({
      type: 'appointment',
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      notes: '',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Schedule Healthcare Event
          </DialogTitle>
          <DialogDescription className="text-xs">
            Add doctor consults, blood tests, or prescription refills.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3.5 py-1">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Event Type *</Label>
            <Select value={formData.type} onValueChange={(val) => handleChange('type', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select event category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appointment">Doctor Appointment / Consult</SelectItem>
                <SelectItem value="test">Diagnostic Blood / Lab Test</SelectItem>
                <SelectItem value="refill">Pharmacy Medication Refill</SelectItem>
                <SelectItem value="other">General Reminder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="event-title" className="text-xs font-semibold">Title *</Label>
            <Input
              id="event-title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Annual Cardiology Review, Fasting Lipid Panel"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="event-date" className="text-xs font-semibold">Date *</Label>
              <Input
                id="event-date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="event-time" className="text-xs font-semibold">Time</Label>
              <Input
                id="event-time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="event-notes" className="text-xs font-semibold">Instructions / Notes</Label>
            <Textarea
              id="event-notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Clinic suite number, prep instructions (e.g. 12hr fasting)..."
              rows={2}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="rounded-xl text-xs font-semibold">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="rounded-xl text-xs font-semibold gap-1">
              <Plus className="h-3.5 w-3.5" />
              Schedule Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;

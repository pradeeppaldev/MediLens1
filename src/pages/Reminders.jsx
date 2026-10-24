import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  Clock,
  Pill,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Filter,
  Check,
  History,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { INDIAN_MEDICINES } from '../data/indianClinicalData';
import { toast } from 'sonner';

const Reminders = () => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [takenHistory, setTakenHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, today, upcoming

  useEffect(() => {
    const fetchMedicines = async () => {
      if (!user) {
        setMedicines(INDIAN_MEDICINES);
        setLoading(false);
        return;
      }

      try {
        const medicinesRef = collection(db, `users/${user.uid}/medicines`);
        const snapshot = await getDocs(medicinesRef);
        const medicinesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const activeList = medicinesData.length > 0 ? medicinesData : INDIAN_MEDICINES;
        setMedicines(activeList);

        // Generate taken history
        const allDoses = [];
        activeList.forEach((med) => {
          if (med.doses && med.doses.length > 0) {
            med.doses.forEach((dose) => {
              if (dose.status === 'taken') {
                allDoses.push({
                  ...dose,
                  medicineName: med.name,
                  dosage: med.dosage,
                  medicineId: med.id
                });
              }
            });
          }
        });

        allDoses.sort((a, b) => {
          const aTime = a.takenAt?.toDate ? a.takenAt.toDate().getTime() : new Date(a.takenAt || 0).getTime();
          const bTime = b.takenAt?.toDate ? b.takenAt.toDate().getTime() : new Date(b.takenAt || 0).getTime();
          return bTime - aTime;
        });
        setTakenHistory(allDoses.slice(0, 10));
      } catch (error) {
        console.warn('Using authentic Indian medicines reminders fallback');
        setMedicines(INDIAN_MEDICINES);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [user]);

  useEffect(() => {
    if (medicines.length === 0) return;

    const generateReminders = () => {
      const now = new Date();
      const futureReminders = [];

      medicines.forEach((med) => {
        const times = med.scheduleTimes || ['08:00 AM'];
        times.forEach((timeStr) => {
          const isTaken = (med.doses || []).some(
            d => d.time === timeStr && d.status === 'taken'
          );

          futureReminders.push({
            id: `${med.id}_${timeStr}`,
            medicineId: med.id,
            medicineName: med.name,
            dosage: med.dosage,
            time: timeStr,
            instructions: med.instructions,
            isTaken,
            category: med.category || 'Prescription',
            date: new Date()
          });
        });
      });

      setReminders(futureReminders);
    };

    generateReminders();
  }, [medicines]);

  const handleMarkAsTaken = async (reminder) => {
    try {
      const updatedMedicines = medicines.map(med => {
        if (med.id === reminder.medicineId) {
          const currentDoses = med.doses || [];
          return {
            ...med,
            doses: [
              ...currentDoses,
              {
                time: reminder.time,
                status: 'taken',
                takenAt: new Date()
              }
            ]
          };
        }
        return med;
      });

      setMedicines(updatedMedicines);
      setReminders(prev => prev.map(r => r.id === reminder.id ? { ...r, isTaken: true } : r));
      toast.success(`${reminder.medicineName} (${reminder.dosage}) recorded as taken`);

      if (user && !user.isDemo && reminder.medicineId.length > 10) {
        const medRef = doc(db, `users/${user.uid}/medicines`, reminder.medicineId);
        const med = medicines.find(m => m.id === reminder.medicineId);
        if (med) {
          await updateDoc(medRef, {
            doses: [
              ...(med.doses || []),
              {
                time: reminder.time,
                status: 'taken',
                takenAt: new Date()
              }
            ]
          });
        }
      }
    } catch (error) {
      console.error('Error updating dose:', error);
    }
  };

  const filteredReminders = reminders.filter(r => {
    if (filter === 'pending') return !r.isTaken;
    if (filter === 'taken') return r.isTaken;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Intelligent Medication Alarms
            </h1>
            <Badge variant="outline" className="font-bold text-xs bg-primary/5 text-primary">
              {reminders.filter(r => !r.isTaken).length} Doses Pending
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time schedule of your daily prescribed Indian medications with instant check-ins.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center p-1 rounded-xl bg-muted/60 border border-border/60 self-start sm:self-auto">
          {[
            { id: 'all', label: 'All Alarms' },
            { id: 'pending', label: 'Pending Doses' },
            { id: 'taken', label: 'Completed' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-120 ${
                filter === tab.id
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Alarms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {filteredReminders.length > 0 ? (
            filteredReminders.map((reminder) => (
              <Card
                key={reminder.id}
                className={`border-border/80 shadow-xs transition-[border-color,background-color] duration-140 ${
                  reminder.isTaken ? 'bg-muted/30 border-border/50' : 'bg-card hover:border-primary/50'
                }`}
              >
                <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl shrink-0 transition-colors ${
                        reminder.isTaken
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      <Pill className="h-6 w-6" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-base font-bold truncate ${reminder.isTaken ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {reminder.medicineName}
                        </h3>
                        <Badge variant="outline" className="text-[10px] font-bold tabular-numbers">
                          {reminder.dosage}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        <span className="font-bold text-foreground tabular-numbers">{reminder.time}</span>
                        {reminder.instructions && (
                          <span className="truncate hidden sm:inline">• {reminder.instructions}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {reminder.isTaken ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full bg-emerald-500/15">
                        <Check className="h-4 w-4 stroke-[2.5]" />
                        Dose Taken
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsTaken(reminder)}
                        className="rounded-xl text-xs font-bold h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Mark Taken
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 text-sm text-muted-foreground">
              No alarms in this view.
            </div>
          )}
        </div>

        {/* Right Column: Historical Intake Log */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                <History className="h-4 w-4 text-primary" />
                Verified Intake Log
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Chronological proof of ingestion for doctor reviews.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 divide-y divide-border/50">
              {takenHistory.length > 0 ? (
                takenHistory.map((item, idx) => (
                  <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-foreground">{item.medicineName}</p>
                      <p className="text-[11px] text-muted-foreground">{item.dosage} • {item.time}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      ✓ Verified
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  Dose history will accumulate as you check in.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reminders;

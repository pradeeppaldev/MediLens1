import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const ProgressRing = () => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [todayAdherence, setTodayAdherence] = useState(0);

  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(collection(db, `users/${user.uid}/medicines`), (snapshot) => {
      const meds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMedicines(meds);
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    let totalScheduledToday = 0;
    let takenToday = 0;

    medicines.forEach(med => {
      if (med.scheduleTimes && med.scheduleTimes.length > 0) {
        totalScheduledToday += med.scheduleTimes.length;
      }
      if (med.doses) {
        med.doses.forEach(dose => {
          if (dose.status === 'taken' && dose.takenAt) {
            const takenDate = dose.takenAt.toDate ? dose.takenAt.toDate() : new Date(dose.takenAt);
            const takenDateStr = takenDate.toISOString().split('T')[0];
            if (takenDateStr === todayStr) {
              takenToday++;
            }
          }
        });
      }
    });

    const adherence = totalScheduledToday > 0
      ? Math.min(100, Math.round((takenToday / totalScheduledToday) * 100))
      : takenToday > 0 ? 100 : 0;

    setTodayAdherence(adherence);
  }, [medicines]);

  const data = [
    { name: 'Taken', value: todayAdherence, color: 'hsl(var(--primary))' },
    { name: 'Remaining', value: Math.max(0, 100 - todayAdherence), color: 'hsl(var(--muted))' }
  ];

  return (
    <div className="p-4 rounded-2xl border border-border/70 bg-card shadow-xs flex flex-col items-center text-center justify-between">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        <Target className="h-3.5 w-3.5 text-primary" />
        <span>Today's Target</span>
      </div>

      <div className="relative h-28 w-28 my-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={38}
              outerRadius={50}
              paddingAngle={todayAdherence > 0 && todayAdherence < 100 ? 4 : 0}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold tracking-tight text-foreground tabular-numbers">
            {todayAdherence}%
          </span>
          <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">
            Done
          </span>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground font-medium mt-1">
        {todayAdherence === 100 ? 'All doses completed!' : 'Daily regimen tracking'}
      </p>
    </div>
  );
};

export default ProgressRing;

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy, Award, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import confetti from 'canvas-confetti';

const StreaksComponent = () => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [hasShownConfetti, setHasShownConfetti] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(collection(db, `users/${user.uid}/medicines`), (snapshot) => {
      const meds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMedicines(meds);
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    const now = new Date();
    const dailyAdherence = {};

    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      let taken = 0;

      medicines.forEach(med => {
        if (med.doses) {
          med.doses.forEach(dose => {
            if (dose.status === 'taken' && dose.takenAt) {
              const takenDate = dose.takenAt.toDate ? dose.takenAt.toDate() : new Date(dose.takenAt);
              const takenDateStr = takenDate.toISOString().split('T')[0];
              if (takenDateStr === dateStr) {
                taken++;
              }
            }
          });
        }
      });

      dailyAdherence[dateStr] = taken > 0 ? 100 : 0;
    }

    const dates = Object.keys(dailyAdherence).sort();
    let current = 0;
    let best = 0;
    let temp = 0;

    for (let i = dates.length - 1; i >= 0; i--) {
      const date = dates[i];
      if (dailyAdherence[date] >= 80) {
        temp++;
        if (i === dates.length - 1) current = temp;
      } else {
        best = Math.max(best, temp);
        temp = 0;
      }
    }
    best = Math.max(best, temp, current);

    setCurrentStreak(current);
    setBestStreak(best);
  }, [medicines]);

  useEffect(() => {
    if (currentStreak >= 7 && !hasShownConfetti) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      setHasShownConfetti(true);
    } else if (currentStreak < 7) {
      setHasShownConfetti(false);
    }
  }, [currentStreak, hasShownConfetti]);

  return (
    <div className="p-4 rounded-2xl border border-border/70 bg-card shadow-xs flex flex-col justify-between">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        <Zap className="h-3.5 w-3.5 text-amber-500" />
        <span>Streaks</span>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-semibold text-foreground">Current</span>
          </div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tabular-numbers">
            {currentStreak} Days
          </span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border/40">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-xs font-semibold text-foreground">All-Time</span>
          </div>
          <span className="text-xs font-bold text-foreground tabular-numbers">
            {bestStreak} Days
          </span>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground text-center mt-2">
        {currentStreak >= 7 ? 'Awesome 7-day adherence streak!' : '7-day streak earns celebration badge'}
      </p>
    </div>
  );
};

export default StreaksComponent;

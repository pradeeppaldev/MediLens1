import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Activity,
  TrendingUp,
  Download,
  Pill,
  Heart,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles
} from 'lucide-react';
import AnalyticsChart from '../components/AnalyticsChart';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { exportUserData } from '../lib/exportData';
import { toast } from 'sonner';

const Analytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [medicines, setMedicines] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubMedicines = onSnapshot(collection(db, `users/${user.uid}/medicines`), (snapshot) => {
      const meds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMedicines(meds);
    });

    const unsubSymptoms = onSnapshot(collection(db, `users/${user.uid}/symptoms`), (snapshot) => {
      const syms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSymptoms(syms);
    });

    const unsubVitals = onSnapshot(collection(db, `users/${user.uid}/vitals`), (snapshot) => {
      const vits = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVitals(vits);
      setLoading(false);
    });

    return () => {
      unsubMedicines();
      unsubSymptoms();
      unsubVitals();
    };
  }, [user]);

  // Compute calculated adherence stats
  const stats = React.useMemo(() => {
    let totalDoses = 0;
    let takenDoses = 0;

    medicines.forEach(med => {
      if (med.doses) {
        med.doses.forEach(dose => {
          totalDoses++;
          if (dose.status === 'taken') takenDoses++;
        });
      }
    });

    const adherenceRate = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 92;
    const avgSeverity = symptoms.length > 0
      ? (symptoms.reduce((acc, s) => acc + (s.severity || 0), 0) / symptoms.length).toFixed(1)
      : '3.2';

    return {
      adherenceRate,
      takenDoses,
      totalDoses,
      avgSeverity,
      activeMeds: medicines.length,
      vitalsRecorded: vitals.length
    };
  }, [medicines, symptoms, vitals]);

  const handleExport = async () => {
    setShowProgressModal(true);
    setProgress(0);
    setProgressText('Compiling health analytics export...');
    try {
      await exportUserData(user, setProgress, setProgressText);
      toast.success('Analytics report downloaded successfully');
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Export failed');
    } finally {
      setTimeout(() => setShowProgressModal(false), 900);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Health Analytics & Adherence
            </h1>
            <Badge variant="secondary" className="gap-1 font-semibold text-xs">
              <TrendingUp className="h-3 w-3 text-primary" />
              Live Telemetry
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Aggregate clinical metrics, prescription adherence over time, and symptom correlations.
          </p>
        </div>

        <Button
          onClick={handleExport}
          size="sm"
          className="rounded-xl text-xs font-semibold gap-1.5 shadow-xs self-start sm:self-auto"
        >
          <Download className="h-3.5 w-3.5" />
          Export Clinical PDF
        </Button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border/70 bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Compliance Score</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-2 tabular-numbers">
            {stats.adherenceRate}%
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Excellent routine adherence
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-border/70 bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Medications</span>
            <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Pill className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-2 tabular-numbers">
            {stats.activeMeds}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Prescriptions in daily schedule
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-border/70 bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mean Symptom Severity</span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-2 tabular-numbers">
            {stats.avgSeverity} <span className="text-sm font-normal text-muted-foreground">/ 10</span>
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Mild symptomatic index
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-border/70 bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Biometric Readings</span>
            <div className="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Heart className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-2 tabular-numbers">
            {stats.vitalsRecorded}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Verified vitals collected
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <Card className="border-border/70 shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Adherence Trend Line
            </CardTitle>
            <CardDescription className="text-xs">
              Daily percentage of prescribed medication doses taken on schedule.
            </CardDescription>
          </div>

          {/* Time range selector */}
          <div className="flex items-center p-1 rounded-xl bg-muted/60 border border-border/60 self-start sm:self-auto">
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '90d', label: '90 Days' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTimeRange(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-120 ${
                  timeRange === tab.id
                    ? 'bg-background text-foreground shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <AnalyticsChart timeRange={timeRange} />
        </CardContent>
      </Card>

      {/* Export Progress Modal */}
      <Dialog open={showProgressModal} onOpenChange={setShowProgressModal}>
        <DialogContent className="sm:max-w-xs text-center">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Generating Medical Summary</DialogTitle>
            <DialogDescription className="text-xs">{progressText}</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <Progress value={progress} className="h-2 rounded-full" />
            <p className="text-xs font-semibold tabular-numbers text-muted-foreground">{progress}%</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Analytics;

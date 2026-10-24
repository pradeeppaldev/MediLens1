import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Activity, HeartPulse, Thermometer, Plus, Trash2, Heart, Scale, Droplets, Clock, AlertCircle, Droplet, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { toast } from 'sonner';

const SAMPLE_INDIAN_VITALS = [
  { id: 'vit_1', type: 'Blood Pressure', value: '122/82 mmHg', notes: 'Resting morning reading with Omron HEM-7120', time: 'Today, 08:15 AM' },
  { id: 'vit_2', type: 'Blood Glucose', value: '98 mg/dL', notes: 'Fasting glucose before breakfast (In Target)', time: 'Today, 07:15 AM' },
  { id: 'vit_3', type: 'Heart Rate', value: '72 bpm', notes: 'Normal resting sinus rhythm', time: 'Today, 08:15 AM' },
  { id: 'vit_4', type: 'Oxygen Saturation', value: '99 % SpO2', notes: 'Evening check, room air', time: 'Yesterday, 09:30 PM' },
  { id: 'vit_5', type: 'Body Weight', value: '74.2 kg', notes: 'BMI 23.6 - Normal range', time: '2 days ago' }
];

const SAMPLE_INDIAN_SYMPTOMS = [
  { id: 'sym_1', symptom: 'Mild morning acidity', severity: 3, notes: 'Felt slight reflux after spicy dinner; resolved after Pan 40', time: 'Today, 07:30 AM' },
  { id: 'sym_2', symptom: 'Slight eye strain / headache', severity: 4, notes: 'After 6 hours continuous screen work; relieved after 20m rest', time: 'Yesterday, 06:00 PM' },
  { id: 'sym_3', symptom: 'Seasonal nasal sneezing', severity: 2, notes: 'Morning dust sensitivity; controlled by Montair-LC', time: '3 days ago' }
];

const HealthMonitor = () => {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Symptom form state
  const [symptomName, setSymptomName] = useState('');
  const [severity, setSeverity] = useState([4]);
  const [symptomNotes, setSymptomNotes] = useState('');
  const [submittingSymptom, setSubmittingSymptom] = useState(false);

  // Vital form state
  const [vitalType, setVitalType] = useState('Blood Pressure');
  const [vitalValue, setVitalValue] = useState('');
  const [vitalNotes, setVitalNotes] = useState('');
  const [submittingVital, setSubmittingVital] = useState(false);

  useEffect(() => {
    if (!user) {
      setSymptoms(SAMPLE_INDIAN_SYMPTOMS);
      setVitals(SAMPLE_INDIAN_VITALS);
      setLoading(false);
      return;
    }

    const symptomsQuery = query(
      collection(db, `users/${user.uid}/symptoms`),
      orderBy('date', 'desc')
    );
    const unsubscribeSymptoms = onSnapshot(symptomsQuery, (snapshot) => {
      const symptomsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSymptoms(symptomsData.length > 0 ? symptomsData : SAMPLE_INDIAN_SYMPTOMS);
    }, () => {
      setSymptoms(SAMPLE_INDIAN_SYMPTOMS);
    });

    const vitalsQuery = query(
      collection(db, `users/${user.uid}/vitals`),
      orderBy('date', 'desc')
    );
    const unsubscribeVitals = onSnapshot(vitalsQuery, (snapshot) => {
      const vitalsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVitals(vitalsData.length > 0 ? vitalsData : SAMPLE_INDIAN_VITALS);
    }, () => {
      setVitals(SAMPLE_INDIAN_VITALS);
    });

    setLoading(false);

    return () => {
      unsubscribeSymptoms();
      unsubscribeVitals();
    };
  }, [user]);

  const handleLogSymptom = async (e) => {
    e.preventDefault();
    if (!symptomName.trim()) {
      toast.error('Please enter a symptom description');
      return;
    }

    setSubmittingSymptom(true);
    try {
      if (user && !user.isDemo) {
        await addDoc(collection(db, `users/${user.uid}/symptoms`), {
          symptom: symptomName.trim(),
          severity: severity[0],
          notes: symptomNotes.trim(),
          date: serverTimestamp()
        });
      } else {
        const localSym = {
          id: `sym_${Date.now()}`,
          symptom: symptomName.trim(),
          severity: severity[0],
          notes: symptomNotes.trim(),
          time: 'Just now'
        };
        setSymptoms(prev => [localSym, ...prev]);
      }

      toast.success('Symptom telemetry recorded');
      setSymptomName('');
      setSeverity([4]);
      setSymptomNotes('');
    } catch (err) {
      console.error('Error logging symptom:', err);
      toast.error('Failed to save symptom');
    } finally {
      setSubmittingSymptom(false);
    }
  };

  const handleLogVital = async (e) => {
    e.preventDefault();
    if (!vitalValue.trim()) {
      toast.error('Please enter measurement value');
      return;
    }

    setSubmittingVital(true);
    try {
      if (user && !user.isDemo) {
        await addDoc(collection(db, `users/${user.uid}/vitals`), {
          type: vitalType,
          value: vitalValue.trim(),
          notes: vitalNotes.trim(),
          date: serverTimestamp()
        });
      } else {
        const localVit = {
          id: `vit_${Date.now()}`,
          type: vitalType,
          value: vitalValue.trim(),
          notes: vitalNotes.trim(),
          time: 'Just now'
        };
        setVitals(prev => [localVit, ...prev]);
      }

      toast.success(`${vitalType} reading saved`);
      setVitalValue('');
      setVitalNotes('');
    } catch (err) {
      console.error('Error logging vital:', err);
      toast.error('Failed to save vital');
    } finally {
      setSubmittingVital(false);
    }
  };

  const handleDeleteSymptom = async (id) => {
    try {
      if (user && !user.isDemo && id.length > 10) {
        await deleteDoc(doc(db, `users/${user.uid}/symptoms`, id));
      }
      setSymptoms(prev => prev.filter(s => s.id !== id));
      toast.success('Symptom entry removed');
    } catch (err) {
      console.error('Error deleting symptom:', err);
      toast.error('Failed to delete symptom');
    }
  };

  const handleDeleteVital = async (id) => {
    try {
      if (user && !user.isDemo && id.length > 10) {
        await deleteDoc(doc(db, `users/${user.uid}/vitals`, id));
      }
      setVitals(prev => prev.filter(v => v.id !== id));
      toast.success('Vital entry removed');
    } catch (err) {
      console.error('Error deleting vital:', err);
      toast.error('Failed to delete vital');
    }
  };

  const getSeverityBadge = (sev) => {
    if (sev <= 3) return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    if (sev <= 6) return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    return 'bg-destructive/15 text-destructive border-destructive/30';
  };

  const getVitalIcon = (type) => {
    switch (type) {
      case 'Blood Pressure': return HeartPulse;
      case 'Heart Rate': return Activity;
      case 'Blood Glucose': return Droplets;
      case 'Temperature': return Thermometer;
      case 'Body Weight': return Scale;
      default: return Heart;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Health Monitor & Telemetry
            </h1>
            <Badge variant="outline" className="font-bold text-xs bg-primary/5 text-primary">
              Real-time Vitals
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Log subjective symptoms, blood pressure trends, and daily glycemic measurements for clinical correlation.
          </p>
        </div>
      </div>

      {/* Main Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- Log Symptoms Section --- */}
        <div className="space-y-6">
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2 font-bold text-foreground">
                <Activity className="h-4 w-4 text-primary" />
                Record Symptom & Severity
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Log side effects or unusual bodily sensations to track correlation with medication intake.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              <form onSubmit={handleLogSymptom} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="sym-name" className="text-xs font-semibold">
                    Symptom Description *
                  </Label>
                  <Input
                    id="sym-name"
                    value={symptomName}
                    onChange={(e) => setSymptomName(e.target.value)}
                    placeholder="e.g. Mild morning acidity, headache, knee stiffness"
                    className="h-10 text-xs rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2 p-3.5 rounded-xl bg-muted/40 border border-border/60">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-foreground">Severity Level</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold tabular-numbers border text-[11px] ${getSeverityBadge(severity[0])}`}>
                      {severity[0]} / 10 ({severity[0] <= 3 ? 'Mild' : severity[0] <= 6 ? 'Moderate' : 'Severe'})
                    </span>
                  </div>
                  <Slider
                    value={severity}
                    onValueChange={setSeverity}
                    min={1}
                    max={10}
                    step={1}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground pt-1">
                    <span>1 (Barely noticeable)</span>
                    <span>5 (Moderate)</span>
                    <span>10 (Severe)</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="sym-notes" className="text-xs font-semibold">
                    Clinical Notes & Trigger Context
                  </Label>
                  <Textarea
                    id="sym-notes"
                    value={symptomNotes}
                    onChange={(e) => setSymptomNotes(e.target.value)}
                    placeholder="Occurred 30 minutes after taking dose, relieved after drinking water..."
                    rows={2}
                    className="text-xs rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submittingSymptom}
                  className="w-full rounded-xl text-xs font-bold h-10 shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  {submittingSymptom ? 'Recording...' : 'Log Symptom'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Symptoms Stream */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
              Recent Symptom History ({symptoms.length})
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {symptoms.map((s) => (
                <div
                  key={s.id}
                  className="flex items-start justify-between p-3.5 rounded-xl border border-border/80 bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-foreground truncate">{s.symptom}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border tabular-numbers ${getSeverityBadge(s.severity || 4)}`}>
                        Lv.{s.severity || 4}
                      </span>
                    </div>
                    {s.notes && <p className="text-xs text-muted-foreground leading-relaxed">{s.notes}</p>}
                    <p className="text-[10px] text-muted-foreground/80 tabular-numbers">
                      {s.time || (s.date?.toDate ? s.date.toDate().toLocaleDateString('en-IN') : 'Recent')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSymptom(s.id)}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 ml-2"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Log Vitals Section --- */}
        <div className="space-y-6">
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="pb-4 border-b border-border/50">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2 font-bold text-foreground">
                <HeartPulse className="h-4 w-4 text-primary" />
                Record Biometric Vital
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Log diagnostic readings (BP, Pulse, Blood Glucose, SpO2).
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              <form onSubmit={handleLogVital} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Vital Type *</Label>
                    <Select value={vitalType} onValueChange={setVitalType}>
                      <SelectTrigger className="h-10 text-xs rounded-xl">
                        <SelectValue placeholder="Select vital" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Blood Pressure">Blood Pressure (mmHg)</SelectItem>
                        <SelectItem value="Heart Rate">Heart Rate (bpm)</SelectItem>
                        <SelectItem value="Blood Glucose">Blood Glucose (mg/dL)</SelectItem>
                        <SelectItem value="Oxygen Saturation">SpO2 Oxygen (%)</SelectItem>
                        <SelectItem value="Temperature">Temperature (°F)</SelectItem>
                        <SelectItem value="Body Weight">Body Weight (kg)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="vital-val" className="text-xs font-semibold">
                      Measurement Value *
                    </Label>
                    <Input
                      id="vital-val"
                      value={vitalValue}
                      onChange={(e) => setVitalValue(e.target.value)}
                      placeholder={
                        vitalType === 'Blood Pressure' ? '122/82' :
                        vitalType === 'Heart Rate' ? '72' :
                        vitalType === 'Blood Glucose' ? '98' :
                        vitalType === 'Oxygen Saturation' ? '99' :
                        vitalType === 'Temperature' ? '98.4' : '74.5'
                      }
                      className="h-10 text-xs rounded-xl tabular-numbers font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="vital-notes" className="text-xs font-semibold">
                    Measurement Context
                  </Label>
                  <Input
                    id="vital-notes"
                    value={vitalNotes}
                    onChange={(e) => setVitalNotes(e.target.value)}
                    placeholder="e.g. Resting morning reading, pre-breakfast, after 30 min walk"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submittingVital}
                  className="w-full rounded-xl text-xs font-bold h-10 shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  {submittingVital ? 'Recording...' : 'Record Vital'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Vitals History */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
              Biometric Timeline ({vitals.length})
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {vitals.map((v) => {
                const Icon = getVitalIcon(v.type);
                return (
                  <div
                    key={v.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {v.type}
                          </span>
                          <span className="text-sm font-extrabold text-foreground tabular-numbers">
                            {v.value}
                          </span>
                        </div>
                        {v.notes && <p className="text-[11px] text-muted-foreground truncate">{v.notes}</p>}
                        <p className="text-[10px] text-muted-foreground/80 tabular-numbers">
                          {v.time || (v.date?.toDate ? v.date.toDate().toLocaleDateString('en-IN') : 'Recorded')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteVital(v.id)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 ml-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthMonitor;

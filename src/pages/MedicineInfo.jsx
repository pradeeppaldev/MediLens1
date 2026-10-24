import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Pill,
  ArrowLeft,
  Clock,
  AlertTriangle,
  Info,
  Heart,
  Shield,
  Zap,
  Calendar,
  Building,
  CheckCircle,
  FileText
} from 'lucide-react';

const MedicineInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Clinical drug dossier data
  const medicine = {
    id: id || 'aspirin',
    name: 'Aspirin Cardio',
    genericName: 'Acetylsalicylic Acid (ASA)',
    dosage: '81mg - 100mg',
    frequency: 'Once daily with meals',
    purpose: 'Anti-platelet aggregation, cardiovascular prophylaxis, mild pain relief',
    sideEffects: [
      'Gastric irritation & dyspepsia',
      'Prolonged bleeding time',
      'Mild heartburn',
      'Rare: Tinnitus with high doses'
    ],
    interactions: [
      'Warfarin / Novel Oral Anticoagulants (NOACs)',
      'NSAIDs (Ibuprofen, Naproxen)',
      'SSRIs (increased bleeding risk)',
      'Corticosteroids'
    ],
    warnings: 'Contraindicated in active peptic ulcer disease, bleeding diathesis, or severe renal impairment. Avoid in children/adolescents with viral illnesses (Reye syndrome risk).',
    manufacturer: 'Bayer Pharmaceuticals / Generic Equivalents',
    expiryDate: '2027-04-30',
    prescriptionRequired: false,
    category: 'Cardiovascular & Anti-platelet',
    description: 'Acetylsalicylic acid acts via irreversible acetylation and inactivation of cyclooxygenase-1 (COX-1), blocking thromboxane A2 production and suppressing platelet aggregation for the lifespan of the platelet (7-10 days).'
  };

  const relatedMedicines = [
    { id: 'clopidogrel', name: 'Clopidogrel (Plavix)', category: 'Anti-platelet Agent' },
    { id: 'atorvastatin', name: 'Atorvastatin (Lipitor)', category: 'Lipid Lowering / Statin' },
    { id: 'lisinopril', name: 'Lisinopril (Zestril)', category: 'ACE Inhibitor' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="flex items-center gap-3 pb-2 border-b border-border/40">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/medications')}
          className="h-9 w-9 rounded-xl border-border/60 hover:bg-muted active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Clinical Drug Dossier
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Pharmacological monographs, interactions, and contraindications.
          </p>
        </div>
      </div>

      {/* Main Overview Card */}
      <Card className="border-border/70 shadow-xs">
        <CardHeader className="pb-4 border-b border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white shadow-md shadow-primary/20 shrink-0">
                <Pill className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                    {medicine.name}
                  </CardTitle>
                  <Badge variant="secondary" className="font-semibold text-xs">
                    {medicine.category}
                  </Badge>
                </div>
                <CardDescription className="text-sm font-medium text-muted-foreground mt-0.5">
                  Generic: {medicine.genericName}
                </CardDescription>
              </div>
            </div>
            <div className="sm:text-right p-3 rounded-xl bg-muted/40 border border-border/40">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Standard Strength</span>
              <p className="text-lg font-bold text-foreground tabular-numbers">{medicine.dosage}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5 space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {medicine.description}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Regimen</p>
                <p className="text-xs font-semibold text-foreground">{medicine.frequency}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20">
              <Building className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Manufacturer</p>
                <p className="text-xs font-semibold text-foreground truncate max-w-[150px]">{medicine.manufacturer}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20">
              <Calendar className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Lot Expiration</p>
                <p className="text-xs font-semibold text-foreground tabular-numbers">{medicine.expiryDate}</p>
              </div>
            </div>
          </div>

          {/* Warnings Banner */}
          <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-0.5">Critical Precautions</h4>
              <p className="text-xs leading-relaxed">{medicine.warnings}</p>
            </div>
          </div>

          {/* Side Effects & Interactions side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border/70 bg-card space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-primary" />
                Reported Side Effects
              </h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {medicine.sideEffects.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-border/70 bg-card space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-secondary" />
                Drug-Drug Interactions
              </h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {medicine.interactions.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Related / Complementary Therapies */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Related Cardiovascular Therapies
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedMedicines.map((rel) => (
                <div
                  key={rel.id}
                  className="p-3 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <p className="text-xs font-semibold text-foreground">{rel.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{rel.category}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicineInfo;

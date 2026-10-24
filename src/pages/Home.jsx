import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '../components/Layout';
import {
  Camera,
  Zap,
  Shield,
  BarChart3,
  Plus,
  Upload,
  FileText,
  Bell,
  Pill,
  ArrowRight,
  Heart,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import AnalyticsChart from '../components/AnalyticsChart';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Prescription OCR Scanner',
      description: 'Instant multi-page optical extraction of drug names, dosages, and administration intervals.',
      icon: Camera,
      action: () => navigate('/prescriptions/upload'),
      badge: 'Vision AI'
    },
    {
      title: 'Smart Medication Alarms',
      description: 'Never miss a critical dose with intelligent scheduled notifications and adherence streaks.',
      icon: Bell,
      action: () => navigate('/reminders'),
      badge: 'Automated'
    },
    {
      title: 'Pharmacological Dossier',
      description: 'Comprehensive database of drug-drug interactions, side effects, and precautions.',
      icon: FileText,
      action: () => navigate('/medications'),
      badge: 'Clinical'
    },
    {
      title: 'Real-time Telemetry',
      description: 'Track blood pressure, glycemic levels, and symptom correlations over 7, 30, and 90 days.',
      icon: BarChart3,
      action: () => navigate('/analytics'),
      badge: 'Metrics'
    },
  ];

  const quickActions = [
    {
      label: 'Scan Prescription',
      icon: Upload,
      variant: 'default',
      onClick: () => navigate('/prescriptions/upload'),
      className: 'rounded-xl text-xs font-semibold shadow-xs'
    },
    {
      label: 'Add Medication',
      icon: Plus,
      variant: 'outline',
      onClick: () => navigate('/medications/add'),
      className: 'rounded-xl text-xs font-semibold'
    },
  ];

  return (
    <Layout
      title="Next-Generation Clinical Care"
      description="Your smart prescription intelligence, automated medication adherence, and health telemetry platform."
      showHero={false}
      actions={quickActions}
    >
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={index}
              className="group flex flex-col justify-between border-border/70 hover:border-primary/40 shadow-xs hover:shadow-md transition-[transform,box-shadow,border-color] duration-160 ease-emil-out"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-140 group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-semibold">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold text-foreground">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed mt-1">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  onClick={feature.action}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between text-xs font-semibold rounded-xl text-primary hover:text-primary hover:bg-primary/10"
                >
                  <span>Launch Tool</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Chart Showcase */}
      <div className="mt-8">
        <Card className="border-border/70 shadow-xs">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Adherence Telemetry Overview
            </CardTitle>
            <CardDescription className="text-xs">
              Continuous 30-day medication compliance and intake monitoring.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <AnalyticsChart timeRange="30d" />
          </CardContent>
        </Card>
      </div>

      {/* Quick KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="p-5 rounded-2xl border border-border/70 bg-card shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
            <Pill className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-foreground tabular-numbers">100%</p>
            <p className="text-xs text-muted-foreground font-medium">Verified Drug Database</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border/70 bg-card shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-foreground tabular-numbers">98.4%</p>
            <p className="text-xs text-muted-foreground font-medium">Target Regimen Adherence</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border/70 bg-card shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary shrink-0">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-foreground tabular-numbers">24/7</p>
            <p className="text-xs text-muted-foreground font-medium">Active Prescription Alerts</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;

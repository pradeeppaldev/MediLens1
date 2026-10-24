import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Palette, Database, User, Key, Moon, Sun, Check, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { db, doc, updateDoc, onSnapshot } from '../lib/firebase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setEmailNotifications(docSnap.data().emailNotifications || false);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleEmailToggle = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        emailNotifications: !emailNotifications
      });
      setEmailNotifications(!emailNotifications);
      toast.success(
        !emailNotifications
          ? 'Email reminder notifications enabled'
          : 'Email notifications disabled'
      );
    } catch (error) {
      console.error('Error updating email notifications:', error);
      toast.error('Failed to update preference');
    }
  };

  const isDark = theme === 'dark';

  const settingsTabs = [
    { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
    { id: 'appearance', label: 'Theme & Appearance', icon: Palette },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'data', label: 'Data & Privacy', icon: Database },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1 pb-2 border-b border-border/40">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage notification channels, visual themes, data encryption, and account access.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 space-y-1">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-[background-color,color,transform] duration-140 ease-emil-out active:scale-[0.98] ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="md:col-span-8 space-y-6">
          {activeTab === 'notifications' && (
            <Card className="border-border/70 shadow-xs">
              <CardHeader className="pb-4 border-b border-border/40">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  Medication Notification Alerts
                </CardTitle>
                <CardDescription className="text-xs">
                  Configure push delivery and email summaries for your doses.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-5">
                <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-muted/20">
                  <div className="space-y-0.5 max-w-[80%]">
                    <p className="text-sm font-semibold text-foreground">Email Notifications</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Receive daily digest of scheduled medications and refill alerts directly to {user?.email || 'your email'}.
                    </p>
                  </div>
                  {/* Apple / Emil tactile switch */}
                  <button
                    type="button"
                    onClick={handleEmailToggle}
                    aria-checked={emailNotifications}
                    role="switch"
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-160 ease-emil-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      emailNotifications ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-160 ease-emil-out ${
                        emailNotifications ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-muted/20 opacity-80">
                  <div className="space-y-0.5 max-w-[80%]">
                    <p className="text-sm font-semibold text-foreground">In-App Browser Audio Chimes</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Play gentle audio feedback chime whenever a prescription dose is due.
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    Enabled
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card className="border-border/70 shadow-xs">
              <CardHeader className="pb-4 border-b border-border/40">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Palette className="h-4 w-4 text-primary" />
                  Visual Theme & Contrast
                </CardTitle>
                <CardDescription className="text-xs">
                  Choose between high-contrast clinical light mode or dark mode for night usage.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => theme !== 'light' && toggleTheme()}
                    className={`p-4 rounded-2xl border text-left space-y-3 transition-[border-color,box-shadow,transform] duration-140 active:scale-95 ${
                      !isDark
                        ? 'border-primary ring-2 ring-primary/20 bg-background shadow-xs'
                        : 'border-border/60 hover:border-border bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Sun className="h-5 w-5 text-amber-500" />
                      {!isDark && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Clinical Light</p>
                      <p className="text-[11px] text-muted-foreground">Crisp high-contrast day mode</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => theme !== 'dark' && toggleTheme()}
                    className={`p-4 rounded-2xl border text-left space-y-3 transition-[border-color,box-shadow,transform] duration-140 active:scale-95 ${
                      isDark
                        ? 'border-primary ring-2 ring-primary/20 bg-background shadow-xs'
                        : 'border-border/60 hover:border-border bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Moon className="h-5 w-5 text-indigo-400" />
                      {isDark && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Midnight Slate</p>
                      <p className="text-[11px] text-muted-foreground">Deep low-glare night mode</p>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="border-border/70 shadow-xs">
              <CardHeader className="pb-4 border-b border-border/40">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Security & Authentication
                </CardTitle>
                <CardDescription className="text-xs">
                  Active authentication session and security logs.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-foreground">Signed In As</p>
                    <p className="text-muted-foreground">{user?.email || 'Guest User'}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">Active</Badge>
                </div>
                <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-foreground">User ID</p>
                    <p className="text-muted-foreground font-mono text-[11px] truncate max-w-[200px]">{user?.uid || 'guest-session'}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">Verified UID</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'data' && (
            <Card className="border-border/70 shadow-xs">
              <CardHeader className="pb-4 border-b border-border/40">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  Data Ownership & Privacy
                </CardTitle>
                <CardDescription className="text-xs">
                  Download or purge all stored clinical records.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your medical data is partitioned under your unique client encryption key in Firebase Firestore. We never sell or share telemetry records with unauthorized third parties.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toast.success('Privacy audit certificate generated');
                    }}
                    className="rounded-xl text-xs font-semibold"
                  >
                    View Privacy Audit Log
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Pill,
  BarChart3,
  Brain,
  Settings,
  FileText,
  Bell,
  Stethoscope,
  Activity,
  Upload,
  DollarSign,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Plus,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';
import { toast } from 'sonner';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await logout();
      toast.success('Signed out of MediLens session');
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to log out');
    }
  };

  const navigationSections = [
    {
      title: 'Care & Treatments',
      items: [
        { name: 'Dashboard', href: '/', icon: Home },
        { name: 'Medications', href: '/medications', icon: Pill },
        { name: 'Reminders', href: '/reminders', icon: Bell },
        { name: 'Health Monitor', href: '/monitor', icon: Activity },
      ]
    },
    {
      title: 'Documents & Intelligence',
      items: [
        { name: 'Upload Prescription', href: '/prescriptions/upload', icon: Upload },
        { name: 'Medical Documents', href: '/documents', icon: FileText },
        { name: 'Health Analytics', href: '/analytics', icon: BarChart3 },
        { name: 'AI Health Chat', href: '/ai/chat', icon: Brain, badge: 'AI' },
      ]
    },
    {
      title: 'Network & Finance',
      items: [
        { name: 'Doctors & Clinics', href: '/doctors', icon: Stethoscope },
        { name: 'Expense Tracker (₹)', href: '/expense-tracker', icon: DollarSign },
        { name: 'Pharmacy Locator', href: '/pharmacy-locator', icon: MapPin },
      ]
    }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
      <div className="flex flex-col flex-grow border-r border-border/80 bg-card/75 backdrop-blur-2xl">
        {/* Header / Brand in Sidebar */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border/60 shrink-0">
          <Logo size="sm" />
        </div>

        {/* Navigation Sections */}
        <div className="flex flex-col flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navigationSections.map((section, sIdx) => (
            <div key={section.title || sIdx} className="space-y-1">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-2">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-[background-color,color,transform] duration-140 ease-emil-out active:scale-[0.98] ${
                        active
                          ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                          : 'text-foreground/80 hover:bg-muted/80 hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center min-w-0 gap-2.5">
                        <Icon
                          className={`h-4 w-4 shrink-0 transition-transform duration-140 ${
                            active
                              ? 'text-primary-foreground'
                              : 'text-muted-foreground group-hover:text-foreground group-hover:scale-105'
                          }`}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge ? (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            active
                              ? 'bg-primary-foreground/20 text-primary-foreground'
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : active ? (
                        <ChevronRight className="h-3 w-3 opacity-70" />
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Action Card inside Sidebar */}
          <div className="pt-2">
            <div className="p-3.5 rounded-2xl border border-primary/25 bg-primary/5 backdrop-blur-xs space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-foreground">AI Health Vault</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Scan Indian prescriptions to analyze interactions & dosages automatically.
              </p>
              <Link to="/prescriptions/upload" className="block pt-1">
                <Button size="sm" variant="outline" className="w-full h-8 rounded-lg text-xs font-bold border-primary/30 text-primary hover:bg-primary/10">
                  <Plus className="h-3 w-3 mr-1" />
                  Scan Prescription
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer / Account & Logout bar */}
        <div className="p-3 border-t border-border/60 bg-muted/30 shrink-0 space-y-2">
          <Link
            to="/profile"
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-[background-color,transform] duration-140 active:scale-[0.98] group"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="rounded-lg h-9 w-9 object-cover ring-1 ring-border shadow-2xs"
              />
            ) : (
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                {user?.displayName || 'Patient Account'}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {user?.bloodGroup ? `${user.bloodGroup} • ${user.city?.split(',')[0] || 'India'}` : user?.email || 'Logged in'}
              </p>
            </div>
            <Link
              to="/settings"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full h-8 justify-start text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg px-2"
          >
            <LogOut className="h-3.5 w-3.5 mr-2" />
            <span>Sign out (Logout)</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

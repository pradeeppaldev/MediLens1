import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Moon,
  Sun,
  Home,
  User,
  Settings,
  LogOut,
  Menu,
  Pill,
  Stethoscope,
  Brain,
  Bell,
  FileText,
  BarChart3,
  Activity,
  Upload,
  DollarSign,
  MapPin,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from './Logo';
import { toast } from 'sonner';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out of MediLens session');
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
      toast.error('Failed to sign out');
    }
  };

  const desktopNavItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Medications', path: '/medications', icon: Pill },
    { name: 'Health Monitor', path: '/monitor', icon: Activity },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'AI Chat', path: '/ai/chat', icon: Brain, badge: 'AI' },
  ];

  const mobileNavItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Medications', path: '/medications', icon: Pill },
    { name: 'Reminders', path: '/reminders', icon: Bell },
    { name: 'Upload Document', path: '/prescriptions/upload', icon: Upload },
    { name: 'Medical Vault', path: '/documents', icon: FileText },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Health Monitor', path: '/monitor', icon: Activity },
    { name: 'Doctors & Clinics', path: '/doctors', icon: Stethoscope },
    { name: 'Expense Tracker (₹)', path: '/expense-tracker', icon: DollarSign },
    { name: 'Pharmacy Locator', path: '/pharmacy-locator', icon: MapPin },
    { name: 'AI Health Chat', path: '/ai/chat', icon: Brain },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Logo size="md" />
          {user?.isDemo && (
            <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-[11px] font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Demo: {user?.displayName || 'Patient'}
            </span>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 bg-muted/60 border border-border/60 p-1 rounded-xl backdrop-blur-md">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-[color,background-color,transform] duration-140 ease-emil-out active:scale-95 ${
                  active
                    ? 'bg-background text-foreground shadow-xs border border-border/80 font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-extrabold rounded-full bg-primary text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Actions & Controls */}
        <div className="flex items-center space-x-2">
          {/* Quick AI Trigger */}
          <Link to="/ai/chat" className="hidden sm:inline-flex">
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 rounded-xl border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50 text-xs font-bold"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Ask AI</span>
            </Button>
          </Link>

          {/* Theme Toggle with tactile feedback */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-9 w-9 rounded-xl border border-border/50 hover:bg-muted active:scale-90 transition-transform duration-120"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4 text-slate-800 transition-transform duration-200" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200" />
            )}
          </Button>

          {/* User Profile Menu */}
          {user ? (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 p-1 rounded-xl border border-border/60 hover:bg-muted/70 transition-[transform,background-color] duration-140 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Open user menu"
                  >
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'Profile'}
                        className="h-7 w-7 rounded-lg object-cover ring-1 ring-border"
                      />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-[11px] font-bold text-white shadow-2xs">
                        {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="hidden md:inline-block text-xs font-bold text-foreground max-w-[110px] truncate pr-1">
                      {user?.displayName ? user.displayName.split(' ')[0] : 'Account'}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60" align="end">
                  <DropdownMenuLabel className="font-normal p-3 pb-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none text-foreground">
                        {user.displayName || 'Patient'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user.email || 'demo@medilens.in'}
                      </p>
                      {user.bloodGroup && (
                        <p className="text-[11px] font-semibold text-primary pt-1">
                          Blood Group: {user.bloodGroup} • {user.city || 'India'}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2.5 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-xs">Patient Health Card</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2.5 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-xs">Preferences & Alerts</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive font-semibold text-xs"
                  >
                    <LogOut className="mr-2.5 h-4 w-4" />
                    <span>Sign out (Exit Session)</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Fast Direct Sign Out button on Desktop */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden xl:inline-flex h-9 px-2.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5 mr-1" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button size="sm" className="rounded-xl text-xs font-bold">
                  Sign in
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Sheet Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 rounded-xl border border-border/50 hover:bg-muted"
                aria-label="Open Navigation Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0 flex flex-col">
              <SheetHeader className="p-5 border-b border-border/60">
                <SheetTitle className="flex items-center justify-between text-left">
                  <Logo size="sm" clickable={false} />
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {mobileNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-[background-color,color] duration-140 ${
                        active
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className={`h-4 w-4 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
              {user && (
                <div className="p-4 border-t border-border/60 bg-muted/30 space-y-2">
                  <div className="text-xs text-muted-foreground truncate px-1">
                    Logged in as <strong className="text-foreground">{user.displayName || user.email}</strong>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full justify-start rounded-xl font-bold text-xs"
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out (Logout)
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

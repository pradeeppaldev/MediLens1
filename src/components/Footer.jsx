import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com' },
    { name: 'GitHub', icon: Github, url: 'https://github.com/pradeeppaldev/MediLens1.git' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com' },
  ];

  const footerNav = [
    {
      title: 'Platform',
      links: [
        { name: 'Medication Tracker', href: '/medications' },
        { name: 'Prescription OCR', href: '/prescriptions/upload' },
        { name: 'Health Monitor & Vitals', href: '/monitor' },
        { name: 'AI Clinical Chat', href: '/ai/chat' },
      ],
    },
    {
      title: 'Clinical Network',
      links: [
        { name: 'Doctors & Clinics (India)', href: '/doctors' },
        { name: 'Pharmacy & Emergency GIS', href: '/pharmacy-locator' },
        { name: 'Healthcare Expense Ledger (₹)', href: '/expense-tracker' },
        { name: 'Adherence Analytics', href: '/analytics' },
      ],
    },
    {
      title: 'Standards & Security',
      links: [
        { name: 'Ayushman Bharat (ABDM)', href: '#' },
        { name: 'HIPAA & CDSCO Guidelines', href: '#' },
        { name: 'Patient Data Privacy', href: '#' },
        { name: 'Terms of Clinical Use', href: '#' },
      ],
    },
  ];

  return (
    <footer className="border-t border-border/80 bg-card/60 backdrop-blur-xl mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Next-generation clinical medication intelligence & prescription OS. Empowers patients, doctors, and caregivers with vision AI prescription parsing, adherence streaks, and real-time medical insights.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>256-bit AES Encryption • ABDM & HIPAA Aligned</span>
            </div>
            <div className="flex space-x-1.5 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                    asChild
                  >
                    <a href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                      <Icon className="h-4 w-4" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Nav columns */}
          {footerNav.map((col) => (
            <div key={col.title} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                {col.title}
              </h4>
              <ul className="space-y-2 text-xs">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary font-medium transition-colors duration-140"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/60 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} MediLens Healthcare Technologies Inc. Built with Google Gemini AI & Emil Kowalski Design Engine.</p>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

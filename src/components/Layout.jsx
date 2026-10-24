import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const Layout = ({ 
  title, 
  description, 
  children, 
  actions,
  showHero = false
}) => {
  return (
    <div className="flex-1 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {(title || description) && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/40">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
              {description && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex flex-wrap gap-2">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'default'}
                    onClick={action.onClick}
                    size="sm"
                    className={action.className || 'rounded-xl text-xs font-semibold'}
                  >
                    {action.icon && <action.icon className="mr-1.5 h-3.5 w-3.5" />}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;

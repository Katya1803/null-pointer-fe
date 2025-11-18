import React from 'react';
import { cn } from '@/lib/utils/cn';

interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant = 'info', children, className }: AlertProps) {
  const variants = {
    success: 'bg-primary-500/10 border-primary-500 text-primary-400',
    error: 'bg-red-500/10 border-red-500 text-red-400',
    warning: 'bg-yellow-500/10 border-yellow-500 text-yellow-400',
    info: 'bg-blue-500/10 border-blue-500 text-blue-400',
  };

  return (
    <div className={cn('px-4 py-3 rounded-lg border', variants[variant], className)}>
      {children}
    </div>
  );
}
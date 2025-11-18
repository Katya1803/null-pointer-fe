import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-dark-card border border-dark-border rounded-lg p-6',
        hover && 'transition-all hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10',
        className
      )}
    >
      {children}
    </div>
  );
}
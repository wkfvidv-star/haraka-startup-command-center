import * as React from 'react';
import { cn } from '../../lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';

const variantStyles: Record<BadgeVariant, string> = {
  default:     'bg-primary/10 text-primary border-primary/20',
  secondary:   'bg-secondary text-secondary-foreground border-transparent',
  destructive: 'bg-red-50 text-red-700 border-red-200',
  outline:     'bg-transparent text-foreground border-border',
  success:     'bg-green-50 text-green-700 border-green-200',
  warning:     'bg-amber-50 text-amber-700 border-amber-200',
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium leading-tight',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

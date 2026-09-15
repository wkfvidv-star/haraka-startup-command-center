import * as React from 'react';
import { cn } from '../../lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  colorOverride?: string;
}

export function Progress({ value = 0, className, colorOverride, ...props }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const barColor = colorOverride ?? (clamped >= 80 ? 'bg-amber-500' : clamped >= 50 ? 'bg-primary' : 'bg-red-500');

  return (
    <div className={cn('relative h-1.5 w-full overflow-hidden rounded-full bg-secondary', className)} {...props}>
      <div
        className={cn('h-full rounded-full transition-all duration-500', barColor)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

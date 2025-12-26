/**
 * Componente Logo
 * Exibe o logo "WebRTC" com estilização
 * 
 * Migrado de: lib/components/Logo.jsx
 */

import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function Logo({ size = 'large', className }: LogoProps) {
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl',
  };

  return (
    <div className={cn('text-center', className)}>
      <h1 className={cn('font-bold text-foreground', sizeClasses[size])}>
        Web
        <span className="text-primary">RTC</span>
      </h1>
    </div>
  );
}

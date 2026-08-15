import React from 'react';

type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'brand', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm';
  
  const variants = {
    brand: 'bg-brand-red/10 text-brand-red dark:bg-brand-red/20',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    neutral: 'bg-slate-100 text-brand-slate dark:bg-slate-800 dark:text-slate-300',
    outline: 'bg-transparent border border-slate-200 text-brand-slate dark:border-slate-700 dark:text-slate-300',
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;

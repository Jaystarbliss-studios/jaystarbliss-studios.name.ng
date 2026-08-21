import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

interface CardProps extends HTMLMotionProps<'div'> {
  hoverEffect?: boolean;
  floatEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = false,
  floatEffect = true,
  ...props 
}) => {
  const baseClasses = 'glass-card rounded-2xl overflow-hidden';
  const hoverClasses = hoverEffect 
    ? 'hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10' 
    : '';
  
  return (
    <motion.div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      whileHover={floatEffect || hoverEffect ? { 
        y: -5,
        transition: { duration: 0.28, ease: [0.25, 1, 0.5, 1] } 
      } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-5 sm:p-6 border-b border-slate-200/50 dark:border-white/10 ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-5 sm:p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`p-5 sm:p-6 border-t border-slate-200/50 dark:border-white/10 bg-white/30 dark:bg-slate-950/30 ${className}`} {...props}>
    {children}
  </div>
);

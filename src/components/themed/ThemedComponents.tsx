import React from 'react';
import { colors, effects, classes } from '@/styles/theme';

interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
}

export const ThemedHeading = ({ children, level = 2, className = '' }: HeadingProps) => {
  const baseClasses = `font-bold ${colors.orange} ${effects.dropShadow}`;
  const sizeClasses = {
    1: 'text-3xl mb-3',
    2: 'text-2xl mb-5', 
    3: 'text-xl mb-1'
  };
  
  const headingClasses = `${baseClasses} ${sizeClasses[level]} ${className}`;
  
  if (level === 1) {
    return <h1 className={headingClasses}>{children}</h1>;
  } else if (level === 3) {
    return <h3 className={headingClasses}>{children}</h3>;
  }
  return <h2 className={headingClasses}>{children}</h2>;
};

interface ThemedLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}

export const ThemedLink = ({ href, children, external = false, className = '' }: ThemedLinkProps) => {
  const linkProps = external ? {
    target: '_blank',
    rel: 'noopener noreferrer'
  } : {};
  
  return (
    <a 
      href={href} 
      className={`${classes.link} ${className}`}
      {...linkProps}
    >
      {children}
    </a>
  );
};

interface ThemedCardProps {
  children: React.ReactNode;
  className?: string;
}

export const ThemedCard = ({ children, className = '' }: ThemedCardProps) => {
  return (
    <div className={`${classes.card} ${className}`}>
      {children}
    </div>
  );
};

interface ThemedButtonProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  external?: boolean;
  className?: string;
}

export const ThemedButton = ({ href, children, icon, external = false, className = '' }: ThemedButtonProps) => {
  const linkProps = external ? {
    target: '_blank',
    rel: 'noopener noreferrer'
  } : {};
  
  return (
    <a
      href={href}
      className={`${classes.cvButton} ${className}`}
      {...linkProps}
    >
      {icon && icon}
      <span className="text-sm font-medium">{children}</span>
    </a>
  );
};

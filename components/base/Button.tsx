import React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';

// Composant Button réutilisable avec des styles personnalisés
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' | 'outline-primary' | 'outline-secondary' | 'outline-success' | 'outline-danger' | 'outline-warning' | 'outline-info' | 'outline-light' | 'outline-dark';
  size?: 'sm' | 'lg';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button = ({
  variant = 'primary',
  size,
  className = '',
  children,
  onClick,
  type = 'button',
  disabled = false,
  href,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  ...rest
}: ButtonProps) => {
  
  const buttonClasses = `
    ${className}
    ${fullWidth ? 'w-100' : ''}
  `.trim();

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="me-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ms-2">{icon}</span>}
    </>
  );

  return (
    <BootstrapButton
      variant={variant}
      size={size}
      className={buttonClasses}
      onClick={onClick}
      type={type}
      disabled={disabled}
      href={href}
      {...rest}
    >
      {content}
    </BootstrapButton>
  );
};

export default Button;
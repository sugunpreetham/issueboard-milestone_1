import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      disabled,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const variantClass = `btn-${variant}`;
    const sizeClass = size === 'icon' ? 'btn-icon' : size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';

    return (
      <button
        ref={ref}
        type={type}
        className={`btn ${variantClass} ${sizeClass} ${className}`.trim()}
        disabled={disabled || isLoading}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

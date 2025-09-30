import React from 'react';

/**
 * Componente Button reutilizable
 * @param {object} props - Propiedades del botón
 * @returns {JSX.Element} Componente Button
 */
const Button = ({
  children,
  type = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  style = {},
  ...props
}) => {
  // Clases CSS según el tipo
  const getTypeClass = () => {
    switch (type) {
      case 'primary':
        return 'guardarComentsBtn';
      case 'secondary':
        return 'btn-secondary';
      case 'danger':
        return 'confirmBtn';
      case 'ghost':
        return 'btn-ghost';
      default:
        return 'guardarComentsBtn';
    }
  };

  // Clases CSS según el tamaño
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'btn-small';
      case 'large':
        return 'btn-large';
      default:
        return '';
    }
  };

  // Clases CSS combinadas
  const buttonClasses = [
    getTypeClass(),
    getSizeClass(),
    loading ? 'btn-loading' : '',
    disabled ? 'btn-disabled' : '',
    className
  ].filter(Boolean).join(' ');

  // Estilos inline
  const buttonStyle = {
    ...style,
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer'
  };

  return (
    <button
      className={buttonClasses}
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="loading-spinner" style={{ marginRight: '8px' }} />
      )}
      {children}
    </button>
  );
};

export default Button;

import React from 'react';

/**
 * Componente Loader para indicar carga
 * @param {object} props - Propiedades del loader
 * @returns {JSX.Element} Componente Loader
 */
const Loader = ({
  size = 'default',
  color = '#1C83E3',
  text = '',
  className = '',
  style = {}
}) => {
  // Tamaños del spinner
  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return { width: '16px', height: '16px' };
      case 'large':
        return { width: '32px', height: '32px' };
      default:
        return { width: '24px', height: '24px' };
    }
  };

  const spinnerSize = getSpinnerSize();

  return (
    <div className={`loading ${className}`} style={style}>
      <div
        className="loading-spinner"
        style={{
          ...spinnerSize,
          borderColor: `${color}20`,
          borderTopColor: color
        }}
      />
      {text && (
        <p style={{ 
          marginTop: '10px', 
          color: '#6b7280',
          fontSize: '14px'
        }}>
          {text}
        </p>
      )}
    </div>
  );
};

/**
 * Componente Loader para botones
 * @param {object} props - Propiedades del loader
 * @returns {JSX.Element} Componente ButtonLoader
 */
export const ButtonLoader = ({ size = 'small', color = '#ffffff' }) => {
  const spinnerSize = size === 'small' ? '12px' : '16px';

  return (
    <span
      className="loading-spinner"
      style={{
        width: spinnerSize,
        height: spinnerSize,
        borderColor: `${color}40`,
        borderTopColor: color,
        marginRight: '8px'
      }}
    />
  );
};

/**
 * Componente Loader para contenido
 * @param {object} props - Propiedades del loader
 * @returns {JSX.Element} Componente ContentLoader
 */
export const ContentLoader = ({ 
  height = '200px', 
  text = 'Cargando...' 
}) => {
  return (
    <div 
      style={{ 
        height, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <Loader size="large" text={text} />
    </div>
  );
};

/**
 * Componente Loader para listas
 * @param {object} props - Propiedades del loader
 * @returns {JSX.Element} Componente ListLoader
 */
export const ListLoader = ({ count = 3 }) => {
  return (
    <div style={{ padding: '10px 0' }}>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          style={{
            height: '40px',
            background: '#f3f4f6',
            borderRadius: '6px',
            marginBottom: '10px',
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: `${index * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

export default Loader;

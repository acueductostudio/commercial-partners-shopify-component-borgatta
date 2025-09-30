import React from 'react';

/**
 * Componente Alert para mostrar mensajes
 * @param {object} props - Propiedades del alert
 * @returns {JSX.Element} Componente Alert
 */
const Alert = ({
  type = 'info',
  title = '',
  message = '',
  showIcon = true,
  closable = false,
  onClose,
  className = '',
  style = {}
}) => {
  // Configuración según el tipo
  const getAlertConfig = () => {
    switch (type) {
      case 'success':
        return {
          class: 'alert-success',
          icon: '✓',
          defaultTitle: 'Éxito'
        };
      case 'error':
        return {
          class: 'alert-error',
          icon: '✕',
          defaultTitle: 'Error'
        };
      case 'warning':
        return {
          class: 'alert-warning',
          icon: '⚠',
          defaultTitle: 'Advertencia'
        };
      case 'info':
      default:
        return {
          class: 'alert-info',
          icon: 'ℹ',
          defaultTitle: 'Información'
        };
    }
  };

  const config = getAlertConfig();
  const alertClasses = `alert ${config.class} ${className}`.trim();

  return (
    <div className={alertClasses} style={style}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {showIcon && (
          <span 
            style={{ 
              marginRight: '10px', 
              fontSize: '16px',
              lineHeight: '1.4'
            }}
          >
            {config.icon}
          </span>
        )}
        
        <div style={{ flex: 1 }}>
          {(title || config.defaultTitle) && (
            <h4 style={{ 
              margin: '0 0 5px 0', 
              fontSize: '16px',
              fontWeight: '600'
            }}>
              {title || config.defaultTitle}
            </h4>
          )}
          
          {message && (
            <p style={{ 
              margin: 0, 
              fontSize: '14px',
              lineHeight: '1.4'
            }}>
              {message}
            </p>
          )}
        </div>

        {closable && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '0',
              marginLeft: '10px',
              color: 'inherit',
              opacity: 0.7
            }}
            aria-label="Cerrar"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Componente Alert para errores de validación
 * @param {object} props - Propiedades del alert
 * @returns {JSX.Element} Componente ValidationAlert
 */
export const ValidationAlert = ({ errors = [], onClose }) => {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <Alert
      type="error"
      title="Errores de validación"
      message={
        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
          {errors.map((error, index) => (
            <li key={index} style={{ marginBottom: '2px' }}>
              {error}
            </li>
          ))}
        </ul>
      }
      closable={!!onClose}
      onClose={onClose}
    />
  );
};

/**
 * Componente Alert para mensajes de éxito
 * @param {object} props - Propiedades del alert
 * @returns {JSX.Element} Componente SuccessAlert
 */
export const SuccessAlert = ({ 
  title = 'Operación exitosa', 
  message = '',
  onClose 
}) => {
  return (
    <Alert
      type="success"
      title={title}
      message={message}
      closable={!!onClose}
      onClose={onClose}
    />
  );
};

/**
 * Componente Alert para errores de red
 * @param {object} props - Propiedades del alert
 * @returns {JSX.Element} Componente NetworkErrorAlert
 */
export const NetworkErrorAlert = ({ onRetry, onClose }) => {
  return (
    <Alert
      type="error"
      title="Error de conexión"
      message="No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo."
      closable={!!onClose}
      onClose={onClose}
    >
      {onRetry && (
        <div style={{ marginTop: '10px' }}>
          <button
            onClick={onRetry}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Reintentar
          </button>
        </div>
      )}
    </Alert>
  );
};

/**
 * Componente Alert para información
 * @param {object} props - Propiedades del alert
 * @returns {JSX.Element} Componente InfoAlert
 */
export const InfoAlert = ({ 
  title = 'Información', 
  message = '',
  onClose 
}) => {
  return (
    <Alert
      type="info"
      title={title}
      message={message}
      closable={!!onClose}
      onClose={onClose}
    />
  );
};

export default Alert;

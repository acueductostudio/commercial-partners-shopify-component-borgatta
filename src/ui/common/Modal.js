import React from 'react';
import './Modal.css';

/**
 * Componente Modal reutilizable para mostrar mensajes de éxito y error
 */
export const Modal = ({ 
  isOpen, 
  onClose, 
  type = 'success', // 'success' | 'error'
  title, 
  message, 
  details = null,
  showRetry = false,
  onRetry = null 
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
    onClose();
  };

  const getIcon = () => {
    if (type === 'success') {
      return (
        <div className="modal-icon success-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    }
    
    return (
      <div className="modal-icon error-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path 
            d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-content">
          {getIcon()}
          
          <h2 className="modal-title">{title}</h2>
          
          <p className="modal-message">{message}</p>
          
          {details && (
            <div className="modal-details">
              <details>
                <summary>Detalles técnicos</summary>
                <pre>{details}</pre>
              </details>
            </div>
          )}
          
          <div className="modal-actions">
            {showRetry && onRetry && (
              <button 
                className="modal-button modal-button-retry" 
                onClick={handleRetry}
              >
                Reintentar
              </button>
            )}
            
            <button 
              className="modal-button modal-button-close" 
              onClick={onClose}
            >
              {type === 'success' ? 'Continuar' : 'Cerrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

import React, { useState } from 'react';
import { Button } from 'antd';
import Swal from 'sweetalert2';
import { SETTINGS } from '../../config/settings.js';

/**
 * Componente SubmitButton para enviar cotización
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente SubmitButton
 */
const SubmitButton = ({
  onSubmit,
  disabled = false,
  loading = false,
  className = '',
  children = 'Pedir Cotización'
}) => {
  const [internalLoading, setInternalLoading] = useState(false);

  // Manejar envío con loading interno
  const handleSubmit = async () => {
    if (disabled || loading || internalLoading) {
      console.log('🚫 SubmitButton: Envío bloqueado - disabled:', disabled, 'loading:', loading, 'internalLoading:', internalLoading);
      return;
    }

    console.log('🚀 SubmitButton: Iniciando envío...');
    setInternalLoading(true);

    try {
      // Simular delay como en el proyecto original
      await new Promise(resolve => setTimeout(resolve, SETTINGS.UI.BUTTON_LOADING_TIME));
      
      // Llamar función de envío
      if (onSubmit) {
        console.log('📤 SubmitButton: Llamando onSubmit...');
        await onSubmit();
        console.log('✅ SubmitButton: onSubmit completado');
      }
    } catch (error) {
      console.error('💥 SubmitButton: Error al enviar cotización:', error);
      showErrorAlert();
    } finally {
      setInternalLoading(false);
      console.log('🏁 SubmitButton: Envío finalizado');
    }
  };

  // Mostrar alerta de éxito
  const showSuccessAlert = () => {
    Swal.fire({
      ...SETTINGS.SWEET_ALERT.SUCCESS,
      customClass: {
        popup: 'popAlert',
        title: 'titlePopup',
        confirmButton: 'clear-cart',
        htmlContainer: 'textpopup',
        closeButton: 'clodeBtnBtn'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
      }
    });
  };

  // Mostrar alerta de error
  const showErrorAlert = () => {
    Swal.fire({
      ...SETTINGS.SWEET_ALERT.ERROR,
      customClass: {
        popup: 'popAlert',
        confirmButton: 'btn-siguiente',
        title: 'titlePopup',
        htmlContainer: 'textpopup',
        closeButton: 'clodeBtnBtn'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        location.reload();
      }
    });
  };

  // Limpiar carrito (función del proyecto original)
  const clearCart = () => {
    if (typeof $ !== 'undefined') {
      $.ajax({
        type: "POST",
        url: '/cart/clear.js',
        success: function() {
          window.location.href = "/";
        },
        dataType: 'json'
      });
    } else {
      // Fallback si jQuery no está disponible
      window.location.href = "/";
    }
  };

  // Verificar conexión a internet
  const checkConnection = () => {
    if (!navigator.onLine) {
      showErrorAlert();
      return false;
    }
    return true;
  };

  // Manejar click con validaciones
  const handleClick = () => {
    if (!checkConnection()) return;
    handleSubmit();
  };

  const isDisabled = disabled || loading || internalLoading;
  const isLoading = loading || internalLoading;

  return (
    <div className={`submit-button-container ${className}`}>
      <Button
        type="primary"
        disabled={isDisabled}
        loading={isLoading}
        onClick={handleClick}
        style={{
          width: '100%',
          height: '48px',
          fontSize: '16px',
          fontWeight: '500',
          borderRadius: '6px'
        }}
      >
        {isLoading ? 'Enviando...' : children}
      </Button>
    </div>
  );
};

/**
 * Componente SubmitButton con validaciones personalizadas
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente ValidatedSubmitButton
 */
export const ValidatedSubmitButton = ({
  onSubmit,
  validationErrors = [],
  requiredFields = [],
  className = '',
  children = 'Pedir Cotización'
}) => {
  const [loading, setLoading] = useState(false);

  // Verificar si el botón debe estar deshabilitado
  const isDisabled = () => {
    // Deshabilitar si hay errores de validación
    if (validationErrors.length > 0) return true;
    
    // Deshabilitar si faltan campos requeridos
    if (requiredFields.some(field => !field.value)) return true;
    
    return false;
  };

  // Manejar envío con validaciones
  const handleSubmit = async () => {
    if (isDisabled() || loading) return;

    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit();
      }
    } catch (error) {
      console.error('Error al enviar cotización:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubmitButton
      onSubmit={handleSubmit}
      disabled={isDisabled()}
      loading={loading}
      className={className}
    >
      {children}
    </SubmitButton>
  );
};

/**
 * Componente SubmitButton con confirmación
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente ConfirmationSubmitButton
 */
export const ConfirmationSubmitButton = ({
  onSubmit,
  confirmationMessage = '¿Estás seguro de que quieres enviar esta cotización?',
  disabled = false,
  className = '',
  children = 'Pedir Cotización'
}) => {
  const [loading, setLoading] = useState(false);

  // Manejar envío con confirmación
  const handleSubmit = async () => {
    if (disabled || loading) return;

    const result = await Swal.fire({
      title: 'Confirmar envío',
      text: confirmationMessage,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'popAlert',
        title: 'titlePopup',
        confirmButton: 'guardarComentsBtn',
        cancelButton: 'closeBtn'
      }
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        if (onSubmit) {
          await onSubmit();
        }
      } catch (error) {
        console.error('Error al enviar cotización:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SubmitButton
      onSubmit={handleSubmit}
      disabled={disabled}
      loading={loading}
      className={className}
    >
      {children}
    </SubmitButton>
  );
};

export default SubmitButton;

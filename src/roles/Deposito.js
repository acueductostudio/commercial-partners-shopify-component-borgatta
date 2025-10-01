import React, { useEffect, useCallback, useMemo } from 'react';
import { useAirtable } from '../hooks/useAirtable.js';
import { useQuotation } from '../hooks/useQuotation.js';
import { SETTINGS } from '../config/settings.js';
import CommentsBox from '../ui/quotation/CommentsBox.js';
import AddressSelector from '../ui/quotation/AddressSelector.js';
import { TotalSend } from '../ui/quotation/SummaryBox.js';
import SubmitButton from '../ui/quotation/SubmitButton.js';
import Alert from '../ui/common/Alert.js';
import Modal from '../ui/common/Modal.js';

/**
 * Componente Deposito - Flujo para usuarios con rol de depósito
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente Deposito
 */
const Deposito = ({
  idCliente,
  email,
  productos = [],
  totalItems = 0,
  totalPrice = 0,
  onQuotationSent,
  className = ''
}) => {
  // Hook para manejo de datos de Airtable
  const {
    loading: airtableLoading,
    error: airtableError,
    clientData,
    addresses,
    isReady: airtableReady
  } = useAirtable(SETTINGS.USER_ROLES.DEPOSITO, idCliente);

  // Hook para manejo de cotización
  const {
    quotationData,
    updateQuotationData,
    updateComments,
    updateSelectedAddress,
    sendQuotation,
    loading: quotationLoading,
    error: quotationError,
    success: quotationSuccess,
    isReadyToSend,
    modal,
    closeModal,
    retrySendQuotation
  } = useQuotation({
    role: SETTINGS.USER_ROLES.DEPOSITO,
    idCliente,
    email,
    productos,
    totalItems,
    totalPrice,
    solicitudPor: SETTINGS.USER_ROLES.DEPOSITO
  });

  // Inicializar datos de cotización
  useEffect(() => {
    updateQuotationData({
      role: SETTINGS.USER_ROLES.DEPOSITO,
      idCliente,
      email,
      productos,
      totalItems,
      totalPrice,
      solicitudPor: SETTINGS.USER_ROLES.DEPOSITO,
      rfc: clientData?.rfc || '', // RFC del cliente
      telemarketing: clientData?.telemarketing || '' // Email de telemarketing
    });
  }, [idCliente, email, totalItems, totalPrice, clientData, updateQuotationData]);

  // Manejar cambio de comentarios
  const handleCommentsChange = useCallback((comments) => {
    updateComments(comments);
  }, [updateComments]);

  // Manejar selección de dirección - basado en el original
  const handleAddressSelect = useCallback((address) => {
    console.log('🏠 Deposito.handleAddressSelect recibido:', address);
    updateSelectedAddress(address);
    console.log('📝 Deposito.handleAddressSelect - actualizando estado...');
  }, [updateSelectedAddress]);

  // Memoizar SKUs para evitar re-renders
  const skuOptions = useMemo(() => {
    return productos ? productos.map(p => p.sku) : [];
  }, [productos]);

  // Manejar envío de cotización
  const handleSubmitQuotation = async () => {
    console.log('🎯 Deposito.handleSubmitQuotation iniciado');
    console.log('📋 Estado actual de quotationData:', quotationData);
    console.log('🔧 isReadyToSend:', isReadyToSend);
    
    try {
      console.log('📤 Llamando a sendQuotation...');
      const result = await sendQuotation();
      console.log('📥 Resultado recibido en Deposito:', result);
      
      if (result.success) {
        console.log('✅ Éxito - notificando al componente padre');
        // Notificar al componente padre
        if (onQuotationSent) {
          onQuotationSent(result);
        }
      }
    } catch (error) {
      console.error('💥 Error en Deposito.handleSubmitQuotation:', error);
    }
  };

  // Verificar si el botón debe estar deshabilitado
  const isSubmitDisabled = () => {
    return !airtableReady || 
           !quotationData.direccionDeposito || 
           quotationLoading || 
           !isReadyToSend;
  };

  return (
    <div className={`Wrapp-component deposito-flow ${className}`}>
      {/* Comentarios */}
      <CommentsBox
        comments={quotationData.comentarios || []}
        onCommentsChange={handleCommentsChange}
        skuOptions={skuOptions}
      />

      {/* Selector de direcciones */}
      <AddressSelector
        addresses={addresses}
        loading={airtableLoading}
        error={airtableError}
        onAddressSelect={handleAddressSelect}
        selectedAddress={quotationData.direccionDeposito}
        title="Seleccionar dirección de depósito"
      />
      
     

      {/* Resumen */}
      <TotalSend totalItems={totalItems} />

      {/* Botón de envío */}
      <div className="cardComponent">
        <SubmitButton
          onSubmit={handleSubmitQuotation}
          disabled={isSubmitDisabled()}
          loading={quotationLoading}
        >
          Pedir Cotización
        </SubmitButton>
      </div>

      {/* Alertas de error */}
      {quotationError && (
        <Alert
          type="error"
          title="Error al enviar cotización"
          message={quotationError}
        />
      )}

      {airtableError && (
        <Alert
          type="error"
          title="Error al cargar datos"
          message={airtableError}
        />
      )}

      {/* Estado de carga global */}
      {(airtableLoading || quotationLoading) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid #e1e5e9',
              borderTop: '3px solid #1C83E3',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 10px'
            }} />
            <p style={{ margin: 0, color: '#6b7280' }}>
              {airtableLoading ? 'Cargando direcciones...' : 'Enviando cotización...'}
            </p>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        details={modal.details}
        showRetry={modal.type === 'error'}
        onRetry={retrySendQuotation}
      />
    </div>
  );
};

/**
 * Componente Deposito con validaciones adicionales
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente ValidatedDeposito
 */
export const ValidatedDeposito = (props) => {
  const { idCliente, email, productos } = props;

  // Validaciones básicas
  const validationErrors = [];

  if (!idCliente) {
    validationErrors.push('ID de cliente es requerido');
  }

  if (!email) {
    validationErrors.push('Email es requerido');
  }

  if (!productos || productos.length === 0) {
    validationErrors.push('Debe haber al menos un producto');
  }

  if (validationErrors.length > 0) {
    return (
      <div className="Wrapp-component">
        <Alert
          type="error"
          title="Datos incompletos"
          message={
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          }
        />
      </div>
    );
  }

  return <Deposito {...props} />;
};

export default Deposito;

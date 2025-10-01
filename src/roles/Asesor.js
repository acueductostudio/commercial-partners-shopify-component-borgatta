import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { AutoComplete } from 'antd';
import { useAirtable } from '../hooks/useAirtable.js';
import { useQuotation } from '../hooks/useQuotation.js';
import { SETTINGS } from '../config/settings.js';
import CommentsBox from '../ui/quotation/CommentsBox.js';
import { AdvisorAddressSelector } from '../ui/quotation/AddressSelector.js';
import { TotalSend } from '../ui/quotation/SummaryBox.js';
import SubmitButton from '../ui/quotation/SubmitButton.js';
import Alert from '../ui/common/Alert.js';
import Modal from '../ui/common/Modal.js';

/**
 * Componente Asesor - Flujo para usuarios con rol de asesor
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente Asesor
 */
const Asesor = ({
  idCliente, // ID del asesor
  email,
  productos = [],
  totalItems = 0,
  totalPrice = 0,
  onQuotationSent,
  className = ''
}) => {
  // Log para debugging
  console.log('🏢 Asesor component render iniciado');
  console.log('🏢 Asesor props:', { idCliente, email, productos: productos.length });
  
  // Estados locales
  const [selectedDepositId, setSelectedDepositId] = useState(null);
  const [selectedDepositName, setSelectedDepositName] = useState('');

  // Hook para manejo de datos de Airtable
  const {
    loading: airtableLoading,
    error: airtableError,
    deposits,
    addresses,
    isReady: airtableReady,
    getDepositOptions,
    processDepositSelection,
    loadAddressesForDeposit
  } = useAirtable(SETTINGS.USER_ROLES.ASESOR, idCliente);

  // Log de datos de Airtable
  console.log('🏢 Asesor - useAirtable data:', {
    loading: airtableLoading,
    error: airtableError,
    deposits: deposits.length,
    addresses: addresses.length,
    isReady: airtableReady
  });

  // Hook para manejo de cotización
  const {
    quotationData,
    updateQuotationData,
    updateComments,
    updateSelectedAddress,
    updateSelectedDeposit,
    sendQuotation,
    loading: quotationLoading,
    error: quotationError,
    success: quotationSuccess,
    isReadyToSend,
    modal,
    closeModal,
    retrySendQuotation
  } = useQuotation({
    role: SETTINGS.USER_ROLES.ASESOR,
    idCliente,
    email,
    productos,
    totalItems,
    totalPrice,
    solicitudPor: SETTINGS.USER_ROLES.ASESOR,
    asesor: idCliente,
    emailAsesor: email,
    deposito: selectedDepositId // ID del depósito seleccionado
  });

  // Inicializar datos de cotización
  useEffect(() => {
    updateQuotationData({
      role: SETTINGS.USER_ROLES.ASESOR,
      idCliente,
      email,
      productos,
      totalItems,
      totalPrice,
      solicitudPor: SETTINGS.USER_ROLES.ASESOR,
      asesor: idCliente,
      emailAsesor: email,
      deposito: selectedDepositId // ID del depósito seleccionado
    });
  }, [idCliente, email, totalItems, totalPrice, selectedDepositId, updateQuotationData]);

  // Log de opciones de depósitos
  const depositOptions = getDepositOptions();
  console.log('🏢 Asesor - getDepositOptions():', depositOptions);
  console.log('🏢 Asesor - depositOptions.length:', depositOptions.length);

  // Manejar selección de depósito
  const handleDepositSelect = (selectedValue) => {
    console.log('🏢 Asesor.handleDepositSelect recibido:', selectedValue);
    
    if (!selectedValue) {
      // Limpiar selección si no hay valor
      setSelectedDepositId(null);
      setSelectedDepositName('');
      return;
    }

    // Verificar si el valor seleccionado es una opción válida
    const isValidOption = depositOptions.some(option => option.value === selectedValue);
    
    if (!isValidOption) {
      console.log('🏢 Asesor - Valor no es una opción válida, ignorando:', selectedValue);
      return;
    }

    // Procesar selección usando el hook
    processDepositSelection(selectedValue);
    
    // Extraer ID del depósito
    const newValue = selectedValue.split(',');
    const finalValue = newValue[0].trim();
    console.log('🏢 Asesor - ID extraído:', finalValue);
    
    // Encontrar el depósito correspondiente
    const deposit = deposits.find(d => {
      if (!d.nuevo || !d.nuevo[0]) return false;
      return d.nuevo[0].trim() === finalValue;
    });
    
    if (deposit) {
      const depositId = deposit.idDeposito || deposit.id || finalValue;
      console.log('🏢 Asesor - Depósito encontrado:', depositId);
      
      setSelectedDepositId(depositId);
      setSelectedDepositName(finalValue);
      
      // Actualizar datos de cotización
      updateSelectedDeposit(depositId);
      
      // Cargar direcciones para el depósito seleccionado
      loadAddressesForDeposit(depositId);
    } else {
      console.error('🏢 Asesor - Depósito no encontrado para:', finalValue);
    }
  };

  // Manejar cambio de comentarios
  const handleCommentsChange = useCallback((comments) => {
    updateComments(comments);
  }, [updateComments]);

  // Manejar selección de dirección
  const handleAddressSelect = useCallback((address) => {
    console.log('🏠 Asesor.handleAddressSelect recibido:', address);
    updateSelectedAddress(address);
    console.log('📝 Asesor.handleAddressSelect - actualizando estado...');
  }, [updateSelectedAddress]);

  // Memoizar SKUs para evitar re-renders
  const skuOptions = useMemo(() => {
    return productos ? productos.map(p => p.sku) : [];
  }, [productos]);

  // Manejar envío de cotización
  const handleSubmitQuotation = async () => {
    try {
      const result = await sendQuotation();
      
      if (result.success) {
        // Notificar al componente padre
        if (onQuotationSent) {
          onQuotationSent(result);
        }
      }
    } catch (error) {
      console.error('Error al enviar cotización:', error);
    }
  };

  // Verificar si el botón debe estar deshabilitado
  const isSubmitDisabled = () => {
    return !airtableReady || 
           !selectedDepositId || 
           !quotationData.direccionDeposito || 
           quotationLoading || 
           !isReadyToSend;
  };

  return (
    <div className={`Wrapp-component asesor-flow ${className}`}>
      {/* Comentarios */}
      <CommentsBox
        comments={quotationData.comentarios || []}
        onCommentsChange={handleCommentsChange}
        skuOptions={skuOptions}
      />

      {/* Selector de depósito y direcciones */}
      <AdvisorAddressSelector
        deposits={depositOptions}
        addresses={addresses}
        loading={airtableLoading}
        error={airtableError}
        onDepositSelect={handleDepositSelect}
        onAddressSelect={handleAddressSelect}
        selectedDeposit={selectedDepositName}
        selectedAddress={quotationData.direccionDeposito}
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
              {airtableLoading ? 'Cargando depósitos...' : 'Enviando cotización...'}
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
 * Componente Asesor con validaciones adicionales
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente ValidatedAsesor
 */
export const ValidatedAsesor = (props) => {
  const { idCliente, email, productos } = props;

  // Validaciones básicas
  const validationErrors = [];

  if (!idCliente) {
    validationErrors.push('ID de asesor es requerido');
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

  return <Asesor {...props} />;
};

export default Asesor;

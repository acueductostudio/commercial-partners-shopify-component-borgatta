import { useState, useCallback } from 'react';
import quotationService from '../core/airtable/quotationService.js';
import { SETTINGS } from '../config/settings.js';

/**
 * Hook personalizado para manejo de cotizaciones
 * @param {object} initialData - Datos iniciales de la cotización
 * @returns {object} Estado y funciones para manejo de cotizaciones
 */
export const useQuotation = (initialData = {}) => {
  // Estados principales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [quotationData, setQuotationData] = useState(initialData);
  
  // Estados del modal
  const [modal, setModal] = useState({
    isOpen: false,
    type: 'success', // 'success' | 'error'
    title: '',
    message: '',
    details: null
  });

  /**
   * Actualiza los datos de la cotización
   */
  const updateQuotationData = useCallback((newData) => {
    setQuotationData(prev => ({
      ...prev,
      ...newData
    }));
  }, []);

  /**
   * Actualiza los comentarios
   */
  const updateComments = useCallback((comments) => {
    setQuotationData(prev => ({
      ...prev,
      comentarios: comments
    }));
  }, []);

  /**
   * Actualiza la dirección seleccionada
   */
  const updateSelectedAddress = useCallback((address) => {
    console.log('🏠 useQuotation.updateSelectedAddress recibido:', address);
    setQuotationData(prev => {
      const newData = {
        ...prev,
        direccionDeposito: address
      };
      console.log('📝 useQuotation.updateSelectedAddress - estado anterior:', prev);
      console.log('📝 useQuotation.updateSelectedAddress - estado nuevo:', newData);
      return newData;
    });
  }, []);

  /**
   * Actualiza el depósito seleccionado (para asesores)
   */
  const updateSelectedDeposit = useCallback((deposit) => {
    setQuotationData(prev => ({
      ...prev,
      depositoSelect: deposit
    }));
  }, []);

  /**
   * Valida los datos de la cotización
   * @param {boolean} silent - Si true, no muestra logs de error
   */
  const validateQuotation = useCallback((silent = false) => {
    return quotationService.validateQuotation(quotationData, silent);
  }, [quotationData]);

  /**
   * Envía la cotización a Airtable
   */
  const sendQuotation = useCallback(async () => {
    console.log('🚀 useQuotation.sendQuotation iniciado');
    console.log('📊 Datos de cotización actuales:', quotationData);
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validar datos antes de enviar
      console.log('✅ Validando datos...');
      const validation = validateQuotation();
      console.log('🔍 Resultado de validación:', validation);
      
      if (!validation.isValid) {
        console.error('❌ Validación fallida:', validation.errors);
        throw new Error(validation.errors.join(', '));
      }

      console.log('📤 Enviando cotización a Airtable...');
      // Enviar cotización
      const result = await quotationService.sendQuotation(quotationData);
      console.log('📥 Respuesta recibida:', result);

      if (result.success) {
        console.log('✅ Cotización enviada exitosamente');
        setSuccess(true);
        showSuccessModal('Tu solicitud de cotización ha sido enviada correctamente. Te contactaremos pronto.');
        return result;
      } else {
        console.error('❌ Error en respuesta:', result.error);
        const errorMsg = result.error || 'Error al enviar cotización';
        showErrorModal(errorMsg, result.details);
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error('💥 Error en sendQuotation:', err);
      setError(err.message);
      showErrorModal(err.message, err.stack);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [quotationData, validateQuotation, showSuccessModal, showErrorModal]);

  /**
   * Limpia el estado de la cotización
   */
  const clearQuotation = useCallback(() => {
    setQuotationData(initialData);
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, [initialData]);

  /**
   * Resetea solo el estado de envío
   */
  const resetSendState = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  /**
   * Muestra el modal de éxito
   */
  const showSuccessModal = useCallback((message = 'Cotización enviada exitosamente') => {
    setModal({
      isOpen: true,
      type: 'success',
      title: '¡Éxito!',
      message: message,
      details: null
    });
  }, []);

  /**
   * Muestra el modal de error
   */
  const showErrorModal = useCallback((message = 'Error al enviar cotización', details = null) => {
    setModal({
      isOpen: true,
      type: 'error',
      title: 'Error',
      message: message,
      details: details
    });
  }, []);

  /**
   * Cierra el modal
   */
  const closeModal = useCallback(() => {
    setModal(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  /**
   * Reintenta el envío de la cotización
   */
  const retrySendQuotation = useCallback(async () => {
    try {
      await sendQuotation();
    } catch (error) {
      // El error se manejará automáticamente en sendQuotation
      console.error('Error en reintento:', error);
    }
  }, [sendQuotation]);

  /**
   * Obtiene el total de productos
   */
  const getTotalProducts = useCallback(() => {
    return quotationService.getTotalProducts(quotationData.productos || []);
  }, [quotationData.productos]);

  /**
   * Obtiene el precio total
   */
  const getTotalPrice = useCallback(() => {
    return quotationService.getTotalPrice(quotationData.productos || []);
  }, [quotationData.productos]);

  /**
   * Verifica si la cotización está lista para enviar
   * Solo valida campos básicos, no ejecuta validación completa
   */
  const isReadyToSend = useCallback(() => {
    // Validación básica sin ejecutar validateQuotation completo
    const hasRequiredFields = quotationData.idCliente && 
                             quotationData.email && 
                             quotationData.productos && 
                             quotationData.productos.length > 0;
    
    return hasRequiredFields && !loading;
  }, [quotationData.idCliente, quotationData.email, quotationData.productos, loading]);

  /**
   * Obtiene los datos formateados para envío
   */
  const getFormattedData = useCallback(() => {
    return {
      ...quotationData,
      totalItems: getTotalProducts(),
      totalPrice: getTotalPrice(),
      timestamp: new Date().toISOString()
    };
  }, [quotationData, getTotalProducts, getTotalPrice]);

  // Computed values
  const hasProducts = quotationData.productos && quotationData.productos.length > 0;
  const hasComments = quotationData.comentarios && quotationData.comentarios.length > 0;
  const hasAddress = !!quotationData.direccionDeposito;
  const hasDeposit = !!quotationData.depositoSelect;

  return {
    // Estados
    loading,
    error,
    success,
    quotationData,
    modal,
    
    // Computed values
    hasProducts,
    hasComments,
    hasAddress,
    hasDeposit,
    isReadyToSend: isReadyToSend(),
    totalProducts: getTotalProducts(),
    totalPrice: getTotalPrice(),
    
    // Funciones
    updateQuotationData,
    updateComments,
    updateSelectedAddress,
    updateSelectedDeposit,
    validateQuotation,
    sendQuotation,
    clearQuotation,
    resetSendState,
    getFormattedData,
    
    // Funciones del modal
    showSuccessModal,
    showErrorModal,
    closeModal,
    retrySendQuotation
  };
};

/**
 * Hook para manejo de comentarios específicamente
 * @param {Array} initialComments - Comentarios iniciales
 * @returns {object} Estado y funciones para comentarios
 */
export const useComments = (initialComments = []) => {
  const [comments, setComments] = useState(initialComments);
  const [editingIndex, setEditingIndex] = useState(null);

  /**
   * Agrega un nuevo comentario
   */
  const addComment = useCallback((comment) => {
    if (editingIndex !== null) {
      // Editar comentario existente
      const updatedComments = [...comments];
      updatedComments[editingIndex] = comment;
      setComments(updatedComments);
      setEditingIndex(null);
    } else {
      // Agregar nuevo comentario
      setComments(prev => [...prev, comment]);
    }
  }, [comments, editingIndex]);

  /**
   * Edita un comentario existente
   */
  const editComment = useCallback((index) => {
    setEditingIndex(index);
  }, []);

  /**
   * Elimina un comentario
   */
  const deleteComment = useCallback((index) => {
    setComments(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    } else if (editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  }, [editingIndex]);

  /**
   * Cancela la edición
   */
  const cancelEdit = useCallback(() => {
    setEditingIndex(null);
  }, []);

  /**
   * Limpia todos los comentarios
   */
  const clearComments = useCallback(() => {
    setComments([]);
    setEditingIndex(null);
  }, []);

  /**
   * Obtiene un comentario por índice
   */
  const getComment = useCallback((index) => {
    return comments[index] || null;
  }, [comments]);

  /**
   * Verifica si un SKU ya tiene comentario
   */
  const hasCommentForSKU = useCallback((sku) => {
    return comments.some(comment => comment.sku === sku);
  }, [comments]);

  /**
   * Obtiene comentarios por SKU
   */
  const getCommentsBySKU = useCallback((sku) => {
    return comments.filter(comment => comment.sku === sku);
  }, [comments]);

  return {
    comments,
    editingIndex,
    addComment,
    editComment,
    deleteComment,
    cancelEdit,
    clearComments,
    getComment,
    hasCommentForSKU,
    getCommentsBySKU
  };
};

/**
 * Hook para manejo de selección de direcciones
 * @param {Array} addresses - Lista de direcciones disponibles
 * @returns {object} Estado y funciones para selección de direcciones
 */
export const useAddressSelection = (addresses = []) => {
  const [selectedAddress, setSelectedAddress] = useState(null);

  /**
   * Selecciona una dirección
   */
  const selectAddress = useCallback((address) => {
    setSelectedAddress(address);
  }, []);

  /**
   * Deselecciona la dirección actual
   */
  const clearSelection = useCallback(() => {
    setSelectedAddress(null);
  }, []);

  /**
   * Verifica si una dirección está seleccionada
   */
  const isSelected = useCallback((address) => {
    return selectedAddress === address;
  }, [selectedAddress]);

  /**
   * Obtiene la dirección seleccionada
   */
  const getSelectedAddress = useCallback(() => {
    return selectedAddress;
  }, [selectedAddress]);

  return {
    selectedAddress,
    selectAddress,
    clearSelection,
    isSelected,
    getSelectedAddress
  };
};

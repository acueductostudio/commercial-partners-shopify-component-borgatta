import { useState, useEffect, useCallback } from 'react';
import userService from '../core/airtable/userService.js';
import { SETTINGS } from '../config/settings.js';

/**
 * Hook personalizado para manejo de datos de Airtable
 * @param {string} role - Rol del usuario (Deposito/Asesor)
 * @param {string} userId - ID del usuario
 * @returns {object} Estado y funciones para manejo de datos
 */
export const useAirtable = (role, userId) => {
  // Estados principales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [selectedDeposit, setSelectedDeposit] = useState(null);

  /**
   * Carga los datos del cliente
   */
  const loadClientData = useCallback(async (clientId) => {
    if (!clientId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await userService.getClientById(clientId);
      setClientData(data);
      setAddresses(data.direcciones || []);
    } catch (err) {
      setError(err.message);
      setClientData(null);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carga los depósitos de un asesor
   */
  const loadAdvisorDeposits = useCallback(async (advisorId) => {
    if (!advisorId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await userService.getAdvisorDeposits(advisorId);
      setDeposits(data);
    } catch (err) {
      setError(err.message);
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carga las direcciones después de seleccionar un depósito
   */
  const loadAddressesForDeposit = useCallback(async (clientId) => {
    if (!clientId) return;

    setLoading(true);
    setError(null);

    try {
      const addresses = await userService.getClientAddresses(clientId);
      setAddresses(addresses);
    } catch (err) {
      setError(err.message);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Maneja la selección de un depósito (para asesores)
   */
  const handleDepositSelection = useCallback((depositId) => {
    setSelectedDeposit(depositId);
    // Cargar direcciones para el depósito seleccionado
    loadAddressesForDeposit(depositId);
  }, []);

  /**
   * Limpia todos los datos
   */
  const clearData = useCallback(() => {
    setClientData(null);
    setAddresses([]);
    setDeposits([]);
    setSelectedDeposit(null);
    setError(null);
  }, []);

  /**
   * Valida si un cliente existe
   */
  const validateClient = useCallback(async (clientId) => {
    if (!clientId) return false;

    try {
      return await userService.validateClient(clientId);
    } catch (err) {
      console.error('Error validando cliente:', err);
      return false;
    }
  }, []);

  /**
   * Valida si un asesor existe
   */
  const validateAdvisor = useCallback(async (advisorId) => {
    if (!advisorId) return false;

    try {
      return await userService.validateAdvisor(advisorId);
    } catch (err) {
      console.error('Error validando asesor:', err);
      return false;
    }
  }, []);

  /**
   * Obtiene las opciones de depósitos formateadas para el selector
   */
  const getDepositOptions = useCallback(() => {
    if (!deposits || deposits.length === 0) {
      return [];
    }

    return deposits.map(deposit => {
      const nombre1 = deposit.nuevo && deposit.nuevo[0] ? deposit.nuevo[0] : 'Sin nombre';
      const nombre2 = deposit.nuevo && deposit.nuevo[1] ? deposit.nuevo[1] : '';
      const uniendoArray = nombre2 ? `${nombre1}, ${nombre2}` : nombre1;
      
      return {
        label: uniendoArray,
        value: uniendoArray,
        id: nombre1.trim(),
        idDeposito: deposit.idDeposito || deposit.id || nombre1.trim()
      };
    });
  }, [deposits]);

  /**
   * Procesa la selección de depósito del AutoComplete
   */
  const processDepositSelection = useCallback((selectedValue) => {
    if (!selectedValue) return;

    const newValue = selectedValue.split(',');
    const finalValue = newValue[0].trim();
    
    // Encontrar el depósito correspondiente
    const deposit = deposits.find(d => {
      if (!d.nuevo || !d.nuevo[0]) return false;
      return d.nuevo[0].trim() === finalValue;
    });
    
    if (deposit) {
      const depositId = deposit.idDeposito || deposit.id || finalValue;
      handleDepositSelection(depositId);
    }
  }, [deposits]);

  // Efectos según el rol
  useEffect(() => {
    if (role === SETTINGS.USER_ROLES.DEPOSITO && userId) {
      loadClientData(userId);
    }
  }, [role, userId, loadClientData]);

  useEffect(() => {
    if (role === SETTINGS.USER_ROLES.ASESOR && userId) {
      loadAdvisorDeposits(userId);
    }
  }, [role, userId, loadAdvisorDeposits]);

  // Computed values
  const hasAddresses = addresses && addresses.length > 0;
  const hasDeposits = deposits && deposits.length > 0;
  const isReady = !loading && !error && (
    (role === SETTINGS.USER_ROLES.DEPOSITO && hasAddresses) ||
    (role === SETTINGS.USER_ROLES.ASESOR && hasDeposits && selectedDeposit)
  );

  return {
    // Estados
    loading,
    error,
    clientData,
    addresses,
    deposits,
    selectedDeposit,
    
    // Computed values
    hasAddresses,
    hasDeposits,
    isReady,
    
    // Funciones
    loadClientData,
    loadAdvisorDeposits,
    loadAddressesForDeposit,
    handleDepositSelection,
    processDepositSelection,
    clearData,
    validateClient,
    validateAdvisor,
    getDepositOptions
  };
};

/**
 * Hook para manejo de direcciones específicamente
 * @param {string} clientId - ID del cliente
 * @returns {object} Estado y funciones para direcciones
 */
export const useAddresses = (clientId) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAddresses = useCallback(async () => {
    if (!clientId) return;

    setLoading(true);
    setError(null);

    try {
      const clientAddresses = await userService.getClientAddresses(clientId);
      setAddresses(clientAddresses);
    } catch (err) {
      setError(err.message);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  return {
    addresses,
    loading,
    error,
    reload: loadAddresses
  };
};

/**
 * Hook para manejo de depósitos específicamente
 * @param {string} advisorId - ID del asesor
 * @returns {object} Estado y funciones para depósitos
 */
export const useDeposits = (advisorId) => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDeposits = useCallback(async () => {
    if (!advisorId) return;

    setLoading(true);
    setError(null);

    try {
      const advisorDeposits = await userService.getAdvisorDeposits(advisorId);
      setDeposits(advisorDeposits);
    } catch (err) {
      setError(err.message);
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  }, [advisorId]);

  useEffect(() => {
    loadDeposits();
  }, [loadDeposits]);

  return {
    deposits,
    loading,
    error,
    reload: loadDeposits
  };
};

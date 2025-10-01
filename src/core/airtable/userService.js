import apiClient from './apiClient.js';
import { getAirtableUrl } from '../../config/env.js';
import { SETTINGS } from '../../config/settings.js';

/**
 * Servicio para manejo de usuarios/clientes en Airtable
 */
class UserService {
  constructor() {
    this.clientsUrl = getAirtableUrl('CLIENTS');
    this.advisorsUrl = getAirtableUrl('ADVISORS');
  }

  /**
   * Busca un cliente por ID en Airtable
   * @param {string} clientId - ID del cliente
   * @returns {Promise<object>} Datos del cliente
   */
  async getClientById(clientId) {

    try {
      if (!clientId) {
        throw new Error('ID de cliente es requerido');
      }

      const filterFormula = apiClient.buildFilterFormula(
        SETTINGS.AIRTABLE_FIELDS.CLIENT.ID_CLIENTE,
        clientId,
        'Find'
      );

      const url = apiClient.buildFilterUrl(this.clientsUrl, {
        filterByFormula: filterFormula
      });

      const response = await apiClient.get(url);

      if (!response.records || response.records.length === 0) {
        throw new Error(`Cliente con ID ${clientId} no encontrado`);
      }

      const clientData = response.records[0].fields;
      
      return {
        id: clientData[SETTINGS.AIRTABLE_FIELDS.CLIENT.ID_CLIENTE],
        direcciones: clientData[SETTINGS.AIRTABLE_FIELDS.CLIENT.DIRECCIONES_DEPOSITOS] || [],
        rfc: clientData[SETTINGS.AIRTABLE_FIELDS.CLIENT.RFC] || '',
        email: clientData[SETTINGS.AIRTABLE_FIELDS.CLIENT.EMAIL] || '',
        telemarketing: clientData[SETTINGS.AIRTABLE_FIELDS.CLIENT.TELEMARKETING] || ''
      };
    } catch (error) {
      console.error('Error al buscar cliente:', error);
      throw error;
    }
  }

  /**
   * Busca asesores disponibles en Airtable
   * @returns {Promise<Array>} Lista de asesores
   */
  async getAdvisors() {
    try {
      const response = await apiClient.get(this.advisorsUrl);

      if (!response.records || response.records.length === 0) {
        return [];
      }

      return response.records.map(record => {
        const fields = record.fields;
        const idDeposito = fields[SETTINGS.AIRTABLE_FIELDS.ADVISOR.ID_DEPOSITO] || [];
        const idName = fields[SETTINGS.AIRTABLE_FIELDS.ADVISOR.ID_NAME] || [];

        // Procesar los datos como en el código original
        const processedData = idName.map(name => {
          const nuevo = name.split(',');
          return {
            nuevo,
            idDeposito: idDeposito[0] // Tomar el primer ID de depósito
          };
        });

        return {
          idAsesor: fields[SETTINGS.AIRTABLE_FIELDS.ADVISOR.ID_ASESOR],
          depositos: processedData
        };
      });
    } catch (error) {
      console.error('Error al buscar asesores:', error);
      throw error;
    }
  }

  /**
   * Busca un asesor específico por ID
   * @param {string} advisorId - ID del asesor
   * @returns {Promise<object>} Datos del asesor
   */
  async getAdvisorById(advisorId) {

    try {
      if (!advisorId) {
        throw new Error('ID de asesor es requerido');
      }

      const filterFormula = apiClient.buildFilterFormula(
        SETTINGS.AIRTABLE_FIELDS.ADVISOR.ID_ASESOR,
        advisorId,
        'Find'
      );

      const url = apiClient.buildFilterUrl(this.advisorsUrl, {
        filterByFormula: filterFormula
      });

      const response = await apiClient.get(url);

      if (!response.records || response.records.length === 0) {
        throw new Error(`Asesor con ID ${advisorId} no encontrado`);
      }

      const advisorData = response.records[0].fields;
      const idDeposito = advisorData[SETTINGS.AIRTABLE_FIELDS.ADVISOR.ID_DEPOSITO] || [];
      const idName = advisorData[SETTINGS.AIRTABLE_FIELDS.ADVISOR.ID_NAME] || [];

      // Procesar los datos como en el código original
      const processedData = idName.map(name => {
        const nuevo = name.split(',');
        return {
          nuevo,
          idDeposito: idDeposito[0] // Tomar el primer ID de depósito
        };
      });

      return {
        idAsesor: advisorData[SETTINGS.AIRTABLE_FIELDS.ADVISOR.ID_ASESOR],
        depositos: processedData
      };
    } catch (error) {
      console.error('Error al buscar asesor:', error);
      throw error;
    }
  }

  /**
   * Valida si un cliente existe
   * @param {string} clientId - ID del cliente
   * @returns {Promise<boolean>} True si existe
   */
  async validateClient(clientId) {
    try {
      await this.getClientById(clientId);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Valida si un asesor existe
   * @param {string} advisorId - ID del asesor
   * @returns {Promise<boolean>} True si existe
   */
  async validateAdvisor(advisorId) {
    try {
      await this.getAdvisorById(advisorId);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene las direcciones de un cliente
   * @param {string} clientId - ID del cliente
   * @returns {Promise<Array>} Lista de direcciones
   */
  async getClientAddresses(clientId) {
    try {
      const client = await this.getClientById(clientId);
      return client.direcciones || [];
    } catch (error) {
      console.error('Error al obtener direcciones del cliente:', error);
      throw error;
    }
  }

  /**
   * Obtiene los depósitos de un asesor
   * @param {string} advisorId - ID del asesor
   * @returns {Promise<Array>} Lista de depósitos
   */
  async getAdvisorDeposits(advisorId) {
    try {
      const advisor = await this.getAdvisorById(advisorId);
      return advisor.depositos || [];
    } catch (error) {
      console.error('Error al obtener depósitos del asesor:', error);
      throw error;
    }
  }
}

// Instancia singleton del servicio
const userService = new UserService();

export default userService;

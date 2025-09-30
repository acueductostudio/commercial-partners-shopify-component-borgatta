import axios from 'axios';
import { ENV_CONFIG, getAuthHeaders } from '../../config/env.js';

/**
 * Cliente API para Airtable
 * Maneja todas las comunicaciones con la API de Airtable
 */
class AirtableApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: ENV_CONFIG.AIRTABLE_BASE_URL,
      timeout: ENV_CONFIG.API_TIMEOUT,
      headers: getAuthHeaders()
    });

    this.setupInterceptors();
  }

  /**
   * Configura interceptores para manejo de errores y reintentos
   */
  setupInterceptors() {
    // Interceptor de respuesta para manejo de errores
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Si es un error de red y no hemos reintentado
        if (error.code === 'NETWORK_ERROR' && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Reintentar con delay exponencial
          await this.delay(ENV_CONFIG.RETRY_DELAY);
          return this.client(originalRequest);
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Maneja errores de la API
   * @param {Error} error - Error original
   * @returns {Error} Error procesado
   */
  handleError(error) {
    if (error.response) {
      // Error de respuesta del servidor
      const status = error.response.status;
      const message = error.response.data?.error?.message || 'Error del servidor';
      
      switch (status) {
        case 401:
          return new Error('Error de autenticación con Airtable');
        case 403:
          return new Error('No tienes permisos para acceder a este recurso');
        case 404:
          return new Error('Recurso no encontrado');
        case 422:
          return new Error('Datos inválidos enviados');
        case 429:
          return new Error('Límite de solicitudes excedido. Inténtalo más tarde (Rate limit de Airtable)');
        default:
          return new Error(`Error del servidor: ${message}`);
      }
    } else if (error.request) {
      // Error de red
      return new Error('Error de conexión. Verifica tu internet.');
    } else {
      // Error de configuración
      return new Error('Error de configuración de la solicitud');
    }
  }

  /**
   * Realiza una petición GET
   * @param {string} url - URL de la petición
   * @param {object} params - Parámetros de consulta
   * @returns {Promise} Respuesta de la API
   */
  async get(url, params = {}) {
    try {
      const response = await this.client.get(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Realiza una petición POST
   * @param {string} url - URL de la petición
   * @param {object} data - Datos a enviar
   * @returns {Promise} Respuesta de la API
   */
  async post(url, data) {
    try {
      const response = await this.client.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Realiza una petición PUT
   * @param {string} url - URL de la petición
   * @param {object} data - Datos a enviar
   * @returns {Promise} Respuesta de la API
   */
  async put(url, data) {
    try {
      const response = await this.client.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Realiza una petición DELETE
   * @param {string} url - URL de la petición
   * @returns {Promise} Respuesta de la API
   */
  async delete(url) {
    try {
      const response = await this.client.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Función auxiliar para delay
   * @param {number} ms - Milisegundos a esperar
   * @returns {Promise} Promise que se resuelve después del delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Construye URL con filtros para Airtable
   * @param {string} baseUrl - URL base
   * @param {object} filters - Filtros a aplicar
   * @returns {string} URL con filtros
   */
  buildFilterUrl(baseUrl, filters = {}) {
    const url = new URL(baseUrl);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
    
    return url.toString();
  }

  /**
   * Construye fórmula de filtro para Airtable
   * @param {string} field - Campo a filtrar
   * @param {string} value - Valor a buscar
   * @param {string} operator - Operador (Find, Equals, etc.)
   * @returns {string} Fórmula de filtro
   */
  buildFilterFormula(field, value, operator = 'Find') {
    switch (operator) {
      case 'Find':
        return `Find("${value}", ${field})`;
      case 'Equals':
        return `{${field}} = "${value}"`;
      case 'Contains':
        return `SEARCH("${value}", {${field}})`;
      default:
        return `Find("${value}", ${field})`;
    }
  }
}

// Instancia singleton del cliente
const apiClient = new AirtableApiClient();

export default apiClient;

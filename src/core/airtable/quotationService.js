import apiClient from './apiClient.js';
import { getAirtableUrl } from '../../config/env.js';
import { SETTINGS } from '../../config/settings.js';

/**
 * Servicio para manejo de cotizaciones en Airtable
 */
class QuotationService {
  constructor() {
    this.quotationsUrl = getAirtableUrl('PEDIDOS');
  }

  /**
   * Envía una cotización a Airtable
   * @param {object} quotationData - Datos de la cotización
   * @returns {Promise<object>} Respuesta de Airtable
   */
  async sendQuotation(quotationData) {
    console.log('📤 Iniciando envío de cotización:', quotationData);
    console.log('🎯 URL de destino:', this.quotationsUrl);
    

    try {
      // Validar datos requeridos
      this.validateQuotationData(quotationData);

      // Preparar payload para Airtable
      const payload = this.buildQuotationPayload(quotationData);

      // Enviar a Airtable
      const response = await apiClient.post(this.quotationsUrl, payload);

      return {
        success: true,
        data: response,
        message: 'Cotización enviada exitosamente'
      };
    } catch (error) {
      console.error('Error al enviar cotización:', error);
      return {
        success: false,
        error: error.message,
        message: 'Error al enviar cotización'
      };
    }
  }

  /**
   * Valida los datos de la cotización
   * @param {object} data - Datos a validar
   * @param {boolean} silent - Si true, no muestra logs de error
   * @throws {Error} Si los datos no son válidos
   */
  validateQuotationData(data, silent = false) {
    if (!silent) {
      console.log('🔍 quotationService.validateQuotationData iniciado');
      console.log('📊 Datos a validar:', data);
    }
    
    const requiredFields = [
      'idCliente',
      'email',
      'productos',
      'solicitudPor'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        if (!silent) console.error(`❌ Campo requerido faltante: ${field}`);
        throw new Error(`Campo requerido faltante: ${field}`);
      }
    }

    // Validaciones específicas por rol
    if (data.solicitudPor === SETTINGS.USER_ROLES.DEPOSITO) {
      if (!data.direccionDeposito) {
        if (!silent) console.error('❌ Dirección de depósito es requerida para solicitudes de depósito');
        throw new Error('Dirección de depósito es requerida para solicitudes de depósito');
      }
    }

    if (data.solicitudPor === SETTINGS.USER_ROLES.ASESOR) {
      if (!data.asesor || !data.emailAsesor) {
        if (!silent) console.error('❌ Datos del asesor son requeridos para solicitudes de asesor');
        throw new Error('Datos del asesor son requeridos para solicitudes de asesor');
      }
    }
    
    if (!silent) console.log('✅ Validación de datos exitosa');
  }

  /**
   * Construye el payload para Airtable
   * @param {object} data - Datos de la cotización
   * @returns {object} Payload formateado para Airtable
   */
  buildQuotationPayload(data) {
    const fields = SETTINGS.AIRTABLE_FIELDS.QUOTATION;
    
    console.log('🔧 buildQuotationPayload - Datos recibidos:', data);
    console.log('🔧 buildQuotationPayload - Campos configurados:', fields);
    
    // Función para limpiar valores undefined/null
    const cleanValue = (value) => {
      if (value === undefined || value === null) return '';
      return value;
    };
    
    const payload = {
      records: [{
        fields: {
          [fields.ID_CLIENTE]: cleanValue(data.idCliente),
          [fields.EMAIL]: cleanValue(data.email),
          [fields.PRODUCTOS]: this.formatProducts(data.productos),
          [fields.SOLICITUD_POR]: cleanValue(data.solicitudPor),
          [fields.COMENTARIO]: this.formatComments(data.comentarios),
          [fields.DEPOSITO]: cleanValue(data.deposito || data.idCliente) // Usar deposito si está disponible, sino idCliente
        }
      }],
      typecast: true
    };
    
    console.log('🔧 buildQuotationPayload - Payload base creado:', payload);

    // Campos específicos por rol
    if (data.solicitudPor === SETTINGS.USER_ROLES.DEPOSITO) {
      payload.records[0].fields[fields.DIRECCION_DEPOSITO] = cleanValue(data.direccionDeposito);
      payload.records[0].fields[fields.RFC] = cleanValue(data.rfc);
      payload.records[0].fields[fields.EMAIL_TELEMARKETING] = cleanValue(data.telemarketing);
    }

    if (data.solicitudPor === SETTINGS.USER_ROLES.ASESOR) {
      payload.records[0].fields[fields.ASESOR] = cleanValue(data.asesor);
      payload.records[0].fields[fields.EMAIL_ASESOR] = cleanValue(data.emailAsesor);
      payload.records[0].fields[fields.DIRECCION_DEPOSITO] = cleanValue(data.direccionDeposito);
      payload.records[0].fields[fields.RFC] = cleanValue(data.rfc);
      payload.records[0].fields[fields.EMAIL_TELEMARKETING] = cleanValue(data.telemarketing);
      console.log('🔧 buildQuotationPayload - Campos de Asesor agregados:', {
        asesor: data.asesor,
        emailAsesor: data.emailAsesor,
        direccionDeposito: data.direccionDeposito,
        deposito: data.deposito,
        rfc: data.rfc,
        telemarketing: data.telemarketing
      });
    }

    // Campos de productos (para compatibilidad con el sistema actual)
    if (data.productos && data.productos.length > 0) {
      payload.records[0].fields[fields.NAME_PRODUCT] = cleanValue(this.formatProductNames(data.productos));
      payload.records[0].fields[fields.SKU_PRODUCT] = cleanValue(this.formatProductSKUs(data.productos));
      payload.records[0].fields[fields.CANTIDAD_PRODUCT] = cleanValue(this.formatProductQuantities(data.productos));
      console.log('🔧 buildQuotationPayload - Campos de productos agregados');
    }

    console.log('🔧 buildQuotationPayload - Payload final:', JSON.stringify(payload, null, 2));
    return payload;
  }

  /**
   * Formatea los productos para Airtable
   * @param {Array} productos - Lista de productos
   * @returns {string} Productos formateados
   */
  formatProducts(productos) {
    if (!productos || productos.length === 0) {
      return 'No hay productos';
    }

    return productos.map(producto => 
      `${producto.title} (SKU: ${producto.sku}) - Cantidad: ${producto.quantity}`
    ).join('; ');
  }

  /**
   * Formatea los comentarios para Airtable
   * @param {Array} comentarios - Lista de comentarios
   * @returns {string} Comentarios formateados
   */
  formatComments(comentarios) {
    if (!comentarios || comentarios.length === 0) {
      return SETTINGS.UI.DEFAULT_MESSAGES.NO_COMMENTS;
    }

    const commentList = comentarios.map(comentario => 
      `<li>${comentario.sku}: ${comentario.comment}</li>`
    ).join('');

    return `<ul style="padding: 2px; margin: 0px;">${commentList}</ul>`;
  }

  /**
   * Formatea los nombres de productos
   * @param {Array} productos - Lista de productos
   * @returns {string} Nombres formateados
   */
  formatProductNames(productos) {
    return productos.map(p => p.title).join(', ');
  }

  /**
   * Formatea los SKUs de productos
   * @param {Array} productos - Lista de productos
   * @returns {string} SKUs formateados
   */
  formatProductSKUs(productos) {
    return productos.map(p => p.sku).join(', ');
  }

  /**
   * Formatea las cantidades de productos
   * @param {Array} productos - Lista de productos
   * @returns {string} Cantidades formateadas
   */
  formatProductQuantities(productos) {
    return productos.map(p => p.quantity).join(', ');
  }

  /**
   * Obtiene el total de productos
   * @param {Array} productos - Lista de productos
   * @returns {number} Total de productos
   */
  getTotalProducts(productos) {
    if (!productos || productos.length === 0) {
      return 0;
    }

    return productos.reduce((total, producto) => total + (producto.quantity || 0), 0);
  }

  /**
   * Obtiene el precio total de productos
   * @param {Array} productos - Lista de productos
   * @returns {number} Precio total
   */
  getTotalPrice(productos) {
    if (!productos || productos.length === 0) {
      return 0;
    }

    return productos.reduce((total, producto) => {
      const price = producto.price || 0;
      const quantity = producto.quantity || 0;
      return total + (price * quantity);
    }, 0);
  }

  /**
   * Valida si una cotización puede ser enviada
   * @param {object} data - Datos de la cotización
   * @param {boolean} silent - Si true, no muestra logs de error
   * @returns {object} Resultado de la validación
   */
  validateQuotation(data, silent = false) {
    if (!silent) {
      console.log('🔍 quotationService.validateQuotation iniciado');
      console.log('📊 Datos a validar:', data);
    }
    
    const errors = [];

    try {
      this.validateQuotationData(data, silent);
    } catch (error) {
      if (!silent) console.error('❌ Error en validateQuotationData:', error.message);
      errors.push(error.message);
    }

    // Validaciones adicionales
    if (data.productos && data.productos.length === 0) {
      if (!silent) console.error('❌ No hay productos en la cotización');
      errors.push('Debe haber al menos un producto en la cotización');
    }

    if (data.solicitudPor === SETTINGS.USER_ROLES.DEPOSITO && !data.direccionDeposito) {
      if (!silent) console.error('❌ No hay dirección de depósito seleccionada');
      errors.push('Debe seleccionar una dirección de depósito');
    }

    if (data.solicitudPor === SETTINGS.USER_ROLES.ASESOR && !data.depositoSelect) {
      if (!silent) console.error('❌ No hay depósito seleccionado para asesor');
      errors.push('Debe seleccionar un depósito');
    }

    const result = {
      isValid: errors.length === 0,
      errors
    };
    
    if (!silent) console.log('✅ Resultado de validación quotationService:', result);
    return result;
  }
}

// Instancia singleton del servicio
const quotationService = new QuotationService();

export default quotationService;

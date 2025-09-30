/**
 * Configuración de variables de entorno
 * Las variables se obtienen de process.env (Vercel) o valores por defecto (desarrollo)
 * En Shopify, estas variables deben ser inyectadas por Liquid
 */

// Valores por defecto para desarrollo (fallback si no hay variables de entorno)
// IMPORTANTE: Para desarrollo local, crea un archivo .env con tus credenciales
// NO incluir credenciales reales aquí - usar solo en .env (no se sube a Git)
const DEFAULT_CONFIG = {
  AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY || '',
  AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID || '',
  AIRTABLE_PEDIDOS_TABLE: process.env.AIRTABLE_PEDIDOS_TABLE || '',
  AIRTABLE_CLIENTS_TABLE: process.env.AIRTABLE_CLIENTS_TABLE || '',
  AIRTABLE_ADVISORS_TABLE: process.env.AIRTABLE_ADVISORS_TABLE || ''
};

export const ENV_CONFIG = {
  // API Airtable - usa variables de entorno o valores por defecto
  AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY || DEFAULT_CONFIG.AIRTABLE_API_KEY,
  AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID || DEFAULT_CONFIG.AIRTABLE_BASE_ID,
  
  // Endpoints de Airtable
  AIRTABLE_ENDPOINTS: {
    // Tabla de pedidos (envío final - todas las solicitudes van aquí)
    PEDIDOS: process.env.AIRTABLE_PEDIDOS_TABLE || DEFAULT_CONFIG.AIRTABLE_PEDIDOS_TABLE,
    // Tabla de clientes/depósitos (solo para consultar direcciones)
    CLIENTS: process.env.AIRTABLE_CLIENTS_TABLE || DEFAULT_CONFIG.AIRTABLE_CLIENTS_TABLE,
    // Tabla de asesores (solo para consultar depósitos)
    ADVISORS: process.env.AIRTABLE_ADVISORS_TABLE || DEFAULT_CONFIG.AIRTABLE_ADVISORS_TABLE
  },
  
  // URLs base
  AIRTABLE_BASE_URL: 'https://api.airtable.com/v0',
  
  // Configuración de desarrollo
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  
  // Timeouts
  API_TIMEOUT: 10000, // 10 segundos
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000 // 1 segundo
};

// Log para verificar configuración (solo en desarrollo)
if (ENV_CONFIG.IS_DEVELOPMENT) {
  console.log('🔧 ENV_CONFIG cargado:', {
    hasApiKey: !!ENV_CONFIG.AIRTABLE_API_KEY,
    baseId: ENV_CONFIG.AIRTABLE_BASE_ID,
    endpoints: Object.keys(ENV_CONFIG.AIRTABLE_ENDPOINTS)
  });
}

/**
 * Función para obtener la URL completa de un endpoint
 * @param {string} endpoint - Nombre del endpoint
 * @returns {string} URL completa
 */
export const getAirtableUrl = (endpoint) => {
  const endpointId = ENV_CONFIG.AIRTABLE_ENDPOINTS[endpoint];
  if (!endpointId) {
    throw new Error(`Endpoint no encontrado: ${endpoint}`);
  }
  return `${ENV_CONFIG.AIRTABLE_BASE_URL}/${ENV_CONFIG.AIRTABLE_BASE_ID}/${endpointId}`;
};

/**
 * Función para obtener headers de autenticación
 * @returns {object} Headers con autenticación
 */
export const getAuthHeaders = () => ({
  'Authorization': `Bearer ${ENV_CONFIG.AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
});

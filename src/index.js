import React from 'react';
import ReactDOM from 'react-dom/client';
import CotizacionComponent, { ShopifyCotizacionComponent } from './CotizacionComponent.js';
import { setMockMode, isMockMode } from './core/airtable/mockService.js';
import './index.css';

// Almacenar roots existentes para evitar crear múltiples
const existingRoots = new Map();

/**
 * Función para inicializar el componente de cotización
 * @param {object} props - Propiedades del componente
 * @param {string} containerId - ID del contenedor DOM
 */
const initializeCotizacionComponent = (props, containerId = 'cotizacion-root') => {
  console.log('🎯 initializeCotizacionComponent llamado con:', { props, containerId });
  
  const container = document.getElementById(containerId);
  console.log('🎯 Contenedor encontrado:', container);
  
  if (!container) {
    console.error(`❌ Contenedor con ID '${containerId}' no encontrado`);
    return;
  }

  // Verificar si ya existe un root para este contenedor
  let root = existingRoots.get(containerId);
  
  if (!root) {
    // Crear root de React 18 solo si no existe
    console.log('🎯 Creando nuevo root de React...');
    root = ReactDOM.createRoot(container);
    existingRoots.set(containerId, root);
    console.log(`✅ Nuevo root creado para contenedor: ${containerId}`);
  } else {
    console.log(`♻️ Reutilizando root existente para contenedor: ${containerId}`);
  }
  
  // Renderizar componente
  console.log('🎯 Renderizando componente con props:', props);
  console.log('🎯 ShopifyCotizacionComponent:', ShopifyCotizacionComponent);
  
  try {
    root.render(
      React.createElement(ShopifyCotizacionComponent, props)
    );
    console.log('✅ Componente renderizado exitosamente');
  } catch (error) {
    console.error('❌ Error al renderizar componente:', error);
  }

  return root;
};

/**
 * Función para renderizar el componente con datos de Shopify
 * Esta función debe ser llamada desde el código Liquid de Shopify
 */
const renderCotizacionFromShopify = () => {
  // Obtener datos del objeto global window (inyectados por Shopify)
  const shopifyData = window.shopifyCotizacionData || {};
  
  // Props del componente
  const props = {
    role: shopifyData.role || '',
    idCliente: shopifyData.idCliente || '',
    email: shopifyData.email || '',
    productos: shopifyData.productos || [],
    totalItems: shopifyData.totalItems || 0,
    totalPrice: shopifyData.totalPrice || 0,
    onQuotationSent: (result) => {
      console.log('Cotización enviada:', result);
      // Aquí se puede agregar lógica adicional después del envío
    }
  };

  // Inicializar componente
  return initializeCotizacionComponent(props);
};

/**
 * Función para renderizar el componente con props personalizadas
 * @param {object} customProps - Props personalizadas
 * @param {string} containerId - ID del contenedor
 */
const renderCotizacionWithProps = (customProps, containerId = 'cotizacion-root') => {
  return initializeCotizacionComponent(customProps, containerId);
};

/**
 * Función para limpiar el componente
 * @param {string} containerId - ID del contenedor
 */
const cleanupCotizacionComponent = (containerId = 'cotizacion-root') => {
  const root = existingRoots.get(containerId);
  
  if (root) {
    // Unmount del root existente
    root.unmount();
    // Remover del Map
    existingRoots.delete(containerId);
    console.log(`🧹 Root limpiado para contenedor: ${containerId}`);
  } else {
    // Fallback: limpiar el contenedor manualmente
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
      console.log(`🧹 Contenedor limpiado manualmente: ${containerId}`);
    }
  }
};


/**
 * Función para obtener información de debugging sobre los roots
 */
const getDebugInfo = () => {
  return {
    activeRoots: Array.from(existingRoots.keys()),
    rootCount: existingRoots.size,
    mockMode: isMockMode()
  };
};

// Exportar funciones para uso global
window.CotizacionComponent = {
  render: renderCotizacionFromShopify,
  renderWithProps: renderCotizacionWithProps,
  cleanup: cleanupCotizacionComponent,
  initialize: initializeCotizacionComponent,
  initializeCotizacionComponent: initializeCotizacionComponent, // Alias para compatibilidad
  cleanupCotizacionComponent: cleanupCotizacionComponent, // Alias para compatibilidad
  setMockMode: (enabled) => setMockMode(enabled, true), // Siempre manual desde la interfaz
  isMockMode: isMockMode,
  getDebugInfo: getDebugInfo
};

console.log('✅ window.CotizacionComponent configurado:', Object.keys(window.CotizacionComponent));

// Auto-inicializar si hay datos de Shopify disponibles
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.shopifyCotizacionData) {
      renderCotizacionFromShopify();
    }
  });
} else {
  if (window.shopifyCotizacionData) {
    renderCotizacionFromShopify();
  }
}

// Exportar componentes para uso en módulos
export {
  CotizacionComponent,
  ShopifyCotizacionComponent,
  initializeCotizacionComponent,
  renderCotizacionFromShopify,
  renderCotizacionWithProps,
  cleanupCotizacionComponent
};

// Exportar por defecto
export default CotizacionComponent;

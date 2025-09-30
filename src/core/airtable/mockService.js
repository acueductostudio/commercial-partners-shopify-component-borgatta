/**
 * Servicio Mock para testing local sin consumir API de Airtable
 * Simula las respuestas de Airtable para evitar límites de rate
 */

// Datos mock para testing
const MOCK_DATA = {
  // Datos de clientes/depósitos
  clients: {
    'D-123574654': {
      id: 'D-123574654',
      direcciones: [
        'Dirección 1 - Sucursal Centro',
        'Dirección 2 - Sucursal Norte',
        'Dirección 3 - Sucursal Sur',
        'Dirección 4 - Bodega Principal'
      ],
      rfc: 'RFC123456789',
      email: 'deposito@test.com',
      telemarketing: 'telemarketing@test.com'
    },
    'D-COMPLETE-001': {
      id: 'D-COMPLETE-001',
      direcciones: [
        'Dirección Completa 1',
        'Dirección Completa 2'
      ],
      rfc: 'RFC987654321',
      email: 'completo@test.com',
      telemarketing: 'tel@test.com'
    }
  },

  // Datos de asesores
  advisors: {
    'A-454654654': {
      idAsesor: 'A-454654654',
      depositos: [
        {
          nuevo: ['D-123574654', 'Cliente Test 1'],
          idDeposito: 'D-123574654'
        },
        {
          nuevo: ['D-COMPLETE-001', 'Cliente Completo'],
          idDeposito: 'D-COMPLETE-001'
        },
        {
          nuevo: ['D-ANOTHER-001', 'Otro Cliente'],
          idDeposito: 'D-ANOTHER-001'
        }
      ]
    }
  }
};

/**
 * Servicio Mock para usuarios
 */
export const mockUserService = {
  async getClientById(clientId) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const client = MOCK_DATA.clients[clientId];
    if (!client) {
      throw new Error(`Cliente con ID ${clientId} no encontrado`);
    }
    
    return client;
  },

  async getAdvisorById(advisorId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const advisor = MOCK_DATA.advisors[advisorId];
    if (!advisor) {
      throw new Error(`Asesor con ID ${advisorId} no encontrado`);
    }
    
    return advisor;
  },

  async getAdvisorDeposits(advisorId) {
    const advisor = await this.getAdvisorById(advisorId);
    return advisor.depositos || [];
  },

  async getClientAddresses(clientId) {
    const client = await this.getClientById(clientId);
    return client.direcciones || [];
  },

  async validateClient(clientId) {
    try {
      await this.getClientById(clientId);
      return true;
    } catch {
      return false;
    }
  },

  async validateAdvisor(advisorId) {
    try {
      await this.getAdvisorById(advisorId);
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Servicio Mock para cotizaciones
 */
export const mockQuotationService = {
  async sendQuotation(quotationData) {
    console.log('🧪 mockQuotationService.sendQuotation iniciado');
    console.log('📊 Datos recibidos en mock:', quotationData);
    
    // Simular delay de envío
    console.log('⏳ Simulando delay de envío...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular éxito/error aleatoriamente (90% éxito)
    const success = Math.random() > 0.1;
    console.log('🎲 Resultado simulado:', success ? 'ÉXITO' : 'ERROR');
    
    if (success) {
      const result = {
        success: true,
        data: {
          id: 'rec' + Math.random().toString(36).substr(2, 9),
          createdTime: new Date().toISOString()
        },
        message: 'Cotización enviada exitosamente (MOCK)'
      };
      console.log('✅ Mock service retornando éxito:', result);
      return result;
    } else {
      const result = {
        success: false,
        error: 'Error simulado para testing',
        message: 'Error al enviar cotización (MOCK)'
      };
      console.log('❌ Mock service retornando error:', result);
      return result;
    }
  },

  validateQuotation(data) {
    console.log('🔍 mockQuotationService.validateQuotation iniciado');
    console.log('📊 Datos a validar:', data);
    
    const errors = [];
    
    if (!data.idCliente) errors.push('ID de cliente es requerido');
    if (!data.email) errors.push('Email es requerido');
    if (!data.productos || data.productos.length === 0) errors.push('Debe haber al menos un producto');
    
    const result = {
      isValid: errors.length === 0,
      errors
    };
    
    console.log('✅ Resultado de validación mock:', result);
    return result;
  },

  getTotalProducts(productos) {
    if (!productos || productos.length === 0) return 0;
    return productos.reduce((total, producto) => total + (producto.quantity || 0), 0);
  },

  getTotalPrice(productos) {
    if (!productos || productos.length === 0) return 0;
    return productos.reduce((total, producto) => {
      const price = producto.price || 0;
      const quantity = producto.quantity || 0;
      return total + (price * quantity);
    }, 0);
  }
};

/**
 * Función para habilitar/deshabilitar modo mock
 */
let mockMode = false;

export const setMockMode = (enabled, manual = false) => {
  mockMode = enabled;
  
  if (manual && typeof window !== 'undefined') {
    window.mockModeManuallySet = true;
  }
  
  console.log(`🧪 Modo Mock ${enabled ? 'HABILITADO' : 'DESHABILITADO'}${manual ? ' (manual)' : ''}`);
  
  if (enabled) {
    console.log('📋 Datos disponibles para testing:');
    console.log('   • Clientes:', Object.keys(MOCK_DATA.clients));
    console.log('   • Asesores:', Object.keys(MOCK_DATA.advisors));
  } else {
    console.log('🌐 Usando API real de Airtable');
  }
};

export const isMockMode = () => mockMode;

// Auto-habilitar modo mock en desarrollo (solo si no está definido manualmente)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Solo activar automáticamente si no se ha establecido manualmente
  if (mockMode === false && !window.mockModeManuallySet) {
    setMockMode(true);
    console.log('🧪 Modo Mock activado automáticamente en localhost');
    console.log('💡 Puedes desactivarlo desde la interfaz de testing');
  }
}

/**
 * Datos de prueba para testing local del componente de cotización
 * Este archivo contiene diferentes escenarios de prueba
 */

// Configuración de testing
export const TEST_CONFIG = {
  // Simular diferentes entornos
  ENVIRONMENTS: {
    DEVELOPMENT: 'development',
    STAGING: 'staging',
    PRODUCTION: 'production'
  },
  
  // URLs de Airtable para testing
  // NOTA: Estas credenciales deben venir del archivo .env
  AIRTABLE_TEST: {
    API_KEY: process.env.AIRTABLE_API_KEY || 'your-test-api-key',
    BASE_ID: process.env.AIRTABLE_BASE_ID || 'your-test-base-id',
    ENDPOINTS: {
      QUOTATIONS: process.env.AIRTABLE_PEDIDOS_TABLE || 'your-quotations-table-id',
      CLIENTS: process.env.AIRTABLE_CLIENTS_TABLE || 'your-clients-table-id',
      ADVISORS: process.env.AIRTABLE_ADVISORS_TABLE || 'your-advisors-table-id'
    }
  }
};

// Datos de prueba para diferentes roles
export const TEST_DATA = {
  // Depósito básico
  DEPOSITO_BASICO: {
    role: "Deposito",
    idCliente: "D-TEST-001",
    email: "deposito@test.com",
    productos: [
      {
        variantId: 123,
        title: "Producto Test A",
        sku: "TEST-001",
        quantity: 2,
        price: 10000
      }
    ],
    totalItems: 2,
    totalPrice: 20000
  },

  // Asesor básico
  ASESOR_BASICO: {
    role: "Asesor",
    idCliente: "A-TEST-001",
    email: "asesor@test.com",
    productos: [
      {
        variantId: 124,
        title: "Producto Test B",
        sku: "TEST-002",
        quantity: 1,
        price: 15000
      }
    ],
    totalItems: 1,
    totalPrice: 15000
  },

  // Datos completos con múltiples productos
  DATOS_COMPLETOS: {
    role: "Deposito",
    idCliente: "D-COMPLETE-001",
    email: "completo@test.com",
    productos: [
      {
        variantId: 125,
        title: "Producto Completo A",
        sku: "COMPLETE-001",
        quantity: 3,
        price: 12000
      },
      {
        variantId: 126,
        title: "Producto Completo B",
        sku: "COMPLETE-002",
        quantity: 1,
        price: 25000
      },
      {
        variantId: 127,
        title: "Producto Completo C",
        sku: "COMPLETE-003",
        quantity: 2,
        price: 8000
      }
    ],
    totalItems: 6,
    totalPrice: 61000
  },

  // Datos inválidos para probar validaciones
  DATOS_INVALIDOS: {
    role: "", // Rol vacío
    idCliente: "", // ID vacío
    email: "invalid-email", // Email inválido
    productos: [], // Sin productos
    totalItems: 0,
    totalPrice: 0
  },

  // Muchos productos (stress test)
  MUCHOS_PRODUCTOS: (() => {
    const productos = [];
    for (let i = 1; i <= 15; i++) {
      productos.push({
        variantId: 1000 + i,
        title: `Producto ${i}`,
        sku: `MULTI-${i.toString().padStart(3, '0')}`,
        quantity: Math.floor(Math.random() * 5) + 1,
        price: Math.floor(Math.random() * 50000) + 5000
      });
    }
    
    const totalItems = productos.reduce((sum, p) => sum + p.quantity, 0);
    const totalPrice = productos.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    return {
      role: "Deposito",
      idCliente: "D-MULTI-001",
      email: "multi@test.com",
      productos,
      totalItems,
      totalPrice
    };
  })(),

  // Sin productos
  SIN_PRODUCTOS: {
    role: "Deposito",
    idCliente: "D-EMPTY-001",
    email: "empty@test.com",
    productos: [],
    totalItems: 0,
    totalPrice: 0
  },

  // Edge cases
  EDGE_CASES: {
    role: "Asesor",
    idCliente: "A-EDGE-001",
    email: "edge@test.com",
    productos: [
      {
        variantId: 999,
        title: "Producto con nombre muy largo que debería manejarse correctamente en la interfaz de usuario y no causar problemas de layout",
        sku: "EDGE-CASE-001",
        quantity: 1,
        price: 999999 // Precio muy alto
      },
      {
        variantId: 1000,
        title: "P",
        sku: "X",
        quantity: 999, // Cantidad muy alta
        price: 1 // Precio muy bajo
      },
      {
        variantId: 1001,
        title: "Producto con caracteres especiales: áéíóú ñü",
        sku: "SPECIAL-001",
        quantity: 1,
        price: 10000
      }
    ],
    totalItems: 1001,
    totalPrice: 1009999
  },

  // Datos de Shopify reales (simulados)
  SHOPIFY_REAL: {
    role: "Deposito",
    idCliente: "D-SHOPIFY-001",
    email: "cliente@shopify.com",
    productos: [
      {
        variantId: 126,
        title: "Producto Shopify",
        sku: "SHOP-001",
        quantity: 3,
        price: 12000
      },
      {
        variantId: 127,
        title: "Otro Producto",
        sku: "SHOP-002",
        quantity: 1,
        price: 25000
      }
    ],
    totalItems: 4,
    totalPrice: 61000
  }
};

// Funciones de utilidad para testing
export const TEST_UTILS = {
  // Generar datos aleatorios
  generateRandomData: (role = 'Deposito') => {
    const roles = ['Deposito', 'Asesor'];
    const selectedRole = roles.includes(role) ? role : roles[Math.floor(Math.random() * roles.length)];
    
    const productos = [];
    const numProductos = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < numProductos; i++) {
      productos.push({
        variantId: Math.floor(Math.random() * 10000) + 1000,
        title: `Producto Aleatorio ${i + 1}`,
        sku: `RAND-${(i + 1).toString().padStart(3, '0')}`,
        quantity: Math.floor(Math.random() * 5) + 1,
        price: Math.floor(Math.random() * 50000) + 5000
      });
    }
    
    const totalItems = productos.reduce((sum, p) => sum + p.quantity, 0);
    const totalPrice = productos.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    return {
      role: selectedRole,
      idCliente: `${selectedRole === 'Asesor' ? 'A' : 'D'}-RAND-${Math.floor(Math.random() * 1000)}`,
      email: `test-${Math.floor(Math.random() * 1000)}@example.com`,
      productos,
      totalItems,
      totalPrice
    };
  },

  // Validar datos
  validateData: (data) => {
    const errors = [];
    
    if (!data.role) errors.push('Rol es requerido');
    if (!data.idCliente) errors.push('ID de cliente es requerido');
    if (!data.email) errors.push('Email es requerido');
    if (!data.productos || data.productos.length === 0) errors.push('Debe haber al menos un producto');
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      errors.push('Email inválido');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Simular respuesta de Airtable
  mockAirtableResponse: (success = true) => {
    if (success) {
      return {
        success: true,
        data: {
          id: 'rec' + Math.random().toString(36).substr(2, 9),
          createdTime: new Date().toISOString()
        },
        message: 'Cotización enviada exitosamente'
      };
    } else {
      return {
        success: false,
        error: 'Error simulado de Airtable',
        message: 'Error al enviar cotización'
      };
    }
  }
};

// Escenarios de prueba predefinidos
export const TEST_SCENARIOS = [
  {
    name: 'Depósito Básico',
    description: 'Flujo básico de depósito con un producto',
    data: TEST_DATA.DEPOSITO_BASICO,
    expectedResult: 'success'
  },
  {
    name: 'Asesor Básico',
    description: 'Flujo básico de asesor con un producto',
    data: TEST_DATA.ASESOR_BASICO,
    expectedResult: 'success'
  },
  {
    name: 'Datos Completos',
    description: 'Múltiples productos y datos completos',
    data: TEST_DATA.DATOS_COMPLETOS,
    expectedResult: 'success'
  },
  {
    name: 'Datos Inválidos',
    description: 'Datos incompletos para probar validaciones',
    data: TEST_DATA.DATOS_INVALIDOS,
    expectedResult: 'error'
  },
  {
    name: 'Muchos Productos',
    description: 'Stress test con muchos productos',
    data: TEST_DATA.MUCHOS_PRODUCTOS,
    expectedResult: 'success'
  },
  {
    name: 'Sin Productos',
    description: 'Carrito vacío',
    data: TEST_DATA.SIN_PRODUCTOS,
    expectedResult: 'error'
  },
  {
    name: 'Edge Cases',
    description: 'Casos límite y datos extremos',
    data: TEST_DATA.EDGE_CASES,
    expectedResult: 'success'
  }
];

// Exportar todo como default para uso fácil
export default {
  TEST_CONFIG,
  TEST_DATA,
  TEST_UTILS,
  TEST_SCENARIOS
};

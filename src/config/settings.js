/**
 * Configuraciones generales del componente
 */

export const SETTINGS = {
  // Estados de la aplicación
  APP_STATES: {
    LOADING: 'loading',
    IDLE: 'idle',
    SUCCESS: 'success',
    ERROR: 'error'
  },
  
  // Roles de usuario
  USER_ROLES: {
    DEPOSITO: 'Deposito',
    ASESOR: 'Asesor'
  },
  
  // Configuración de UI
  UI: {
    // Tiempo de loading del botón (en ms)
    BUTTON_LOADING_TIME: 2000,
    
    // Mensajes por defecto
    DEFAULT_MESSAGES: {
      NO_COMMENTS: 'No hay comentarios',
      NO_ADDRESSES: 'Introduce un ID de cliente para ver las direcciones disponibles',
      LOADING_ADDRESSES: 'Cargando direcciones...',
      SELECT_ADDRESS: 'Selecciona una dirección',
      SELECT_DEPOSIT: 'Selecciona un depósito'
    },
    
    // Placeholders
    PLACEHOLDERS: {
      CLIENT_ID: 'Introduce ID de cliente',
      COMMENTS: 'Escribe tu comentario',
      SELECT_OPTION: 'Selecciona una opción'
    }
  },
  
  // Configuración de validaciones
  VALIDATION: {
    // Campos requeridos
    REQUIRED_FIELDS: {
      DEPOSITO: ['idCliente', 'addressSelect'],
      ASESOR: ['idCliente', 'depositoSelect', 'addressSelect']
    },
    
    // Mensajes de error
    ERROR_MESSAGES: {
      REQUIRED_FIELD: 'Este campo es requerido',
      INVALID_EMAIL: 'Email inválido',
      NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
      API_ERROR: 'Error del servidor. Inténtalo de nuevo.',
      CLIENT_NOT_FOUND: 'Cliente no encontrado',
      NO_ADDRESSES: 'No se encontraron direcciones para este cliente'
    }
  },
  
  // Configuración de SweetAlert2
  SWEET_ALERT: {
    SUCCESS: {
      title: "Solicitaste tu cotización",
      html: "Te enviaremos una copia de tu cotización a tu correo electrónico y nos comunicaremos contigo a la brevedad para confirmar todos los detalles.",
      imageUrl: "https://cdn.shopify.com/s/files/1/0633/1459/1884/files/icon-done.svg?v=1706909092",
      imageWidth: 60,
      imageHeight: 60,
      showCloseButton: true,
      confirmButtonText: "Volver al inicio"
    },
    
    ERROR: {
      title: "No pudimos solicitar tu cotización",
      html: "Lo sentimos, pero algo ha salido mal al procesar tu solicitud. Por favor, verifica tu conexión a internet e inténtalo de nuevo.",
      imageUrl: "https://cdn.shopify.com/s/files/1/0633/1459/1884/files/icon-error.svg?v=1706911874",
      imageWidth: 60,
      imageHeight: 60,
      showCloseButton: true,
      confirmButtonText: "Volver a intentarlo"
    },
    
    DELETE_CONFIRM: {
      title: "¿Quieres eliminar el comentario?",
      html: "Se eliminará y no se enviará en tu cotización.",
      imageUrl: "https://cdn.shopify.com/s/files/1/0588/7721/4871/files/icon-soft-alert.svg?v=1728425808",
      imageWidth: 60,
      imageHeight: 60,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      showCloseButton: false,
      confirmButtonText: "Si, eliminar",
      reverseButtons: true
    }
  },
  
  // Configuración de campos de Airtable
  AIRTABLE_FIELDS: {
    // Campos para cotización
    QUOTATION: {
      ID_CLIENTE: 'Idcliente',
      DIRECCION_DEPOSITO: 'DireccionDeposito',
      COMENTARIO: 'Comentario',
      PRODUCTOS: 'productos',
      EMAIL: 'Email',
      RFC: 'RFC',
      EMAIL_TELEMARKETING: 'emailTelemarketing',
      ASESOR: 'Asesor',
      EMAIL_ASESOR: 'emailAsesor',
      NAME_PRODUCT: 'NameProduct',
      SKU_PRODUCT: 'SkuProduct',
      CANTIDAD_PRODUCT: 'CantidadProduct',
      SOLICITUD_POR: 'SolicitudPor',
      DEPOSITO: 'Deposito'
    },
    
    // Campos para cliente
    CLIENT: {
      ID_CLIENTE: 'IDcliente',
      DIRECCIONES_DEPOSITOS: 'DireccionesDepositos',
      RFC: 'RFC',
      EMAIL: 'Email',
      TELEMARKETING: 'Telemarketing'
    },
    
    // Campos para asesor
    ADVISOR: {
      ID_ASESOR: 'idAsesor',
      ID_DEPOSITO: 'IdDeposito',
      ID_NAME: 'Idname'
    }
  }
};

/**
 * Función para obtener mensaje por defecto
 * @param {string} key - Clave del mensaje
 * @returns {string} Mensaje
 */
export const getDefaultMessage = (key) => {
  return SETTINGS.UI.DEFAULT_MESSAGES[key] || '';
};

/**
 * Función para obtener mensaje de error
 * @param {string} key - Clave del error
 * @returns {string} Mensaje de error
 */
export const getErrorMessage = (key) => {
  return SETTINGS.VALIDATION.ERROR_MESSAGES[key] || 'Error desconocido';
};

/**
 * Función para verificar si un rol es válido
 * @param {string} role - Rol a verificar
 * @returns {boolean} True si es válido
 */
export const isValidRole = (role) => {
  return Object.values(SETTINGS.USER_ROLES).includes(role);
};

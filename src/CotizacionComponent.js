import React from 'react';
import Deposito from './roles/Deposito.js';
import Asesor from './roles/Asesor.js';
import { SETTINGS } from './config/settings.js';
import Alert from './ui/common/Alert.js';

/**
 * Componente principal CotizacionComponent
 * Maneja la lógica condicional de roles y renderiza el flujo correspondiente
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente CotizacionComponent
 */
const CotizacionComponent = ({
  role,
  idCliente,
  email,
  productos = [],
  totalItems = 0,
  totalPrice = 0,
  onQuotationSent,
  className = '',
  ...otherProps
}) => {
  // Validar props requeridas
  if (!role && role !== '') {
    return (
      <div className="Wrapp-component">
        <Alert
          type="error"
          title="Error de configuración"
          message="El rol del usuario es requerido para mostrar el componente de cotización."
        />
      </div>
    );
  }

  if (!idCliente) {
    return (
      <div className="Wrapp-component">
        <Alert
          type="error"
          title="Error de configuración"
          message="El ID del cliente es requerido para procesar la cotización."
        />
      </div>
    );
  }

  if (!email) {
    return (
      <div className="Wrapp-component">
        <Alert
          type="error"
          title="Error de configuración"
          message="El email del cliente es requerido para procesar la cotización."
        />
      </div>
    );
  }

  // Determinar el rol del usuario
  const userRole = determineUserRole(role);

  // Props comunes para ambos componentes
  const commonProps = {
    idCliente,
    email,
    productos,
    totalItems,
    totalPrice,
    onQuotationSent,
    className,
    ...otherProps
  };

  // Renderizar componente según el rol
  switch (userRole) {
    case SETTINGS.USER_ROLES.ASESOR:
      return <Asesor {...commonProps} />;
    
    case SETTINGS.USER_ROLES.DEPOSITO:
    default:
      return <Deposito {...commonProps} />;
  }
};

/**
 * Determina el rol del usuario basado en los tags de Shopify
 * @param {string|Array} roleTags - Tags del usuario de Shopify
 * @returns {string} Rol determinado
 */
const determineUserRole = (roleTags) => {
  // Validar que roleTags no sea null o undefined
  if (!roleTags) {
    return SETTINGS.USER_ROLES.DEPOSITO;
  }
  
  // Si es un array, convertir a string
  const tags = Array.isArray(roleTags) ? roleTags.join(' ') : roleTags;
  
  // Convertir a string y normalizar, asegurándose de que no sea null/undefined
  const normalizedTags = (tags || '').toString().toLowerCase();
  
  // Verificar si contiene "asesor"
  if (normalizedTags.includes('asesor')) {
    return SETTINGS.USER_ROLES.ASESOR;
  }
  
  // Por defecto, asumir que es depósito
  return SETTINGS.USER_ROLES.DEPOSITO;
};

/**
 * Componente CotizacionComponent con validaciones adicionales
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente ValidatedCotizacionComponent
 */
export const ValidatedCotizacionComponent = (props) => {
  const { role, idCliente, email, productos } = props;

  // Validaciones básicas
  const validationErrors = [];

  if (!role) {
    validationErrors.push('Rol del usuario es requerido');
  }

  if (!idCliente) {
    validationErrors.push('ID del cliente es requerido');
  }

  if (!email) {
    validationErrors.push('Email del cliente es requerido');
  }

  if (!productos || productos.length === 0) {
    validationErrors.push('Debe haber al menos un producto en el carrito');
  }

  if (validationErrors.length > 0) {
    return (
      <div className="Wrapp-component">
        <Alert
          type="error"
          title="Datos incompletos"
          message={
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          }
        />
      </div>
    );
  }

  return <CotizacionComponent {...props} />;
};

/**
 * Hook para manejo de props del componente
 * @param {object} props - Props originales
 * @returns {object} Props procesadas
 */
export const useCotizacionProps = (props) => {
  console.log('🔧 useCotizacionProps llamado con props:', props);
  
  const {
    role,
    idCliente,
    email,
    productos = [],
    totalItems = 0,
    totalPrice = 0,
    ...otherProps
  } = props;

  // Procesar productos si es necesario
  const processedProductos = Array.isArray(productos) ? productos : [];
  console.log('🔧 Productos procesados:', processedProductos);

  // Calcular totales si no se proporcionan
  const calculatedTotalItems = totalItems || processedProductos.reduce(
    (sum, producto) => sum + (producto.quantity || 0), 
    0
  );

  const calculatedTotalPrice = totalPrice || processedProductos.reduce(
    (sum, producto) => {
      const price = producto.price || 0;
      const quantity = producto.quantity || 0;
      return sum + (price * quantity);
    }, 
    0
  );

  const processedProps = {
    role,
    idCliente,
    email,
    productos: processedProductos,
    totalItems: calculatedTotalItems,
    totalPrice: calculatedTotalPrice,
    ...otherProps
  };
  
  console.log('🔧 Props procesadas retornadas:', processedProps);
  return processedProps;
};

/**
 * Componente wrapper para integración con Shopify
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente ShopifyCotizacionComponent
 */
export const ShopifyCotizacionComponent = (props) => {
  console.log('🎭 ShopifyCotizacionComponent renderizando con props:', props);
  const processedProps = useCotizacionProps(props);
  console.log('🎭 Props procesadas en ShopifyCotizacionComponent:', processedProps);
  return <ValidatedCotizacionComponent {...processedProps} />;
};

export default CotizacionComponent;

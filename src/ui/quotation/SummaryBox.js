import React from 'react';

/**
 * Componente SummaryBox para mostrar resumen de la cotización
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente SummaryBox
 */
const SummaryBox = ({
  productos = [],
  totalItems = 0,
  totalPrice = 0,
  className = '',
  showPrice = true
}) => {
  // Calcular totales si no se proporcionan
  const calculatedTotalItems = totalItems || productos.reduce((sum, producto) => sum + (producto.quantity || 0), 0);
  const calculatedTotalPrice = totalPrice || productos.reduce((sum, producto) => {
    const price = producto.price || 0;
    const quantity = producto.quantity || 0;
    return sum + (price * quantity);
  }, 0);

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price / 100); // Airtable maneja precios en centavos
  };

  return (
    <div className={`cardComponent ${className}`}>
      <h3 className="title-card_component">Resumen de cotización</h3>
      
      {/* Lista de productos */}
      {productos.length > 0 ? (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '10px',
            color: '#374151'
          }}>
            Productos ({productos.length})
          </h4>
          
          <div className="product-list">
            {productos.map((producto, index) => (
              <ProductItem
                key={index}
                producto={producto}
                showPrice={showPrice}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="nonInfo">No hay productos en la cotización</p>
      )}

      {/* Totales */}
      <div className="summary-totals">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 0',
          borderTop: '1px solid #e1e5e9',
          marginTop: '15px'
        }}>
          <span style={{ 
            fontSize: '16px', 
            fontWeight: '600',
            color: '#374151'
          }}>
            Total de productos:
          </span>
          <span style={{ 
            fontSize: '16px', 
            fontWeight: '600',
            color: '#1C83E3'
          }}>
            {calculatedTotalItems}
          </span>
        </div>

        {showPrice && calculatedTotalPrice > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderTop: '1px solid #e1e5e9'
          }}>
            <span style={{ 
              fontSize: '18px', 
              fontWeight: '700',
              color: '#374151'
            }}>
              Total:
            </span>
            <span style={{ 
              fontSize: '18px', 
              fontWeight: '700',
              color: '#1C83E3'
            }}>
              {formatPrice(calculatedTotalPrice)}
            </span>
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div style={{
        marginTop: '15px',
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        border: '1px solid #e1e5e9'
      }}>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#6b7280',
          lineHeight: '1.4'
        }}>
          <strong>Nota:</strong> Los precios mostrados son de referencia. 
          El precio final será confirmado en tu cotización personalizada.
        </p>
      </div>
    </div>
  );
};

/**
 * Componente ProductItem para cada producto individual
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente ProductItem
 */
const ProductItem = ({
  producto,
  showPrice = true
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price / 100);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px solid #f3f4f6'
    }}>
      <div style={{ flex: 1 }}>
        <h5 style={{
          margin: '0 0 4px 0',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151'
        }}>
          {producto.title}
        </h5>
        <p style={{
          margin: 0,
          fontSize: '12px',
          color: '#6b7280'
        }}>
          SKU: {producto.sku}
        </p>
      </div>
      
      <div style={{ textAlign: 'right' }}>
        <p style={{
          margin: '0 0 4px 0',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151'
        }}>
          Cantidad: {producto.quantity}
        </p>
        {showPrice && producto.price && (
          <p style={{
            margin: 0,
            fontSize: '12px',
            color: '#6b7280'
          }}>
            {formatPrice(producto.price)}
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Componente SummaryBox simplificado (solo totales)
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente SimpleSummaryBox
 */
export const SimpleSummaryBox = ({
  totalItems = 0,
  totalPrice = 0,
  className = '',
  showPrice = true
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price / 100);
  };

  return (
    <div className={`cardComponent ${className}`}>
      <h3 className="title-card_component">Resumen</h3>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 0'
      }}>
        <span style={{ 
          fontSize: '16px', 
          fontWeight: '500',
          color: '#374151'
        }}>
          Total de productos:
        </span>
        <span style={{ 
          fontSize: '16px', 
          fontWeight: '600',
          color: '#1C83E3'
        }}>
          {totalItems}
        </span>
      </div>

      {showPrice && totalPrice > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 0',
          borderTop: '1px solid #e1e5e9'
        }}>
          <span style={{ 
            fontSize: '18px', 
            fontWeight: '600',
            color: '#374151'
          }}>
            Total:
          </span>
          <span style={{ 
            fontSize: '18px', 
            fontWeight: '700',
            color: '#1C83E3'
          }}>
            {formatPrice(totalPrice)}
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Componente TotalSend para mostrar el total de productos a cotizar (como en el proyecto original)
 * @param {object} props - Propiedades del componente
 * @returns {JSX.Element} Componente TotalSend
 */
export const TotalSend = ({ totalItems = 0, className = '' }) => {
  return (
    <div className={`cardComponent ${className}`}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '21px'
      }}>
        <h3 className="title-card_component" style={{ margin: 0 }}>
          Total a cotizar
        </h3>
        <h3 className="title-card_component" style={{ 
          margin: 0,
          color: '#1C83E3',
          fontWeight: 'bold'
        }}>
          {totalItems} productos
        </h3>
      </div>
    </div>
  );
};

export default SummaryBox;

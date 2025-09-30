# 🔗 Guía de Integración con Shopify

Esta guía explica cómo integrar el componente de cotización unificado con tu tienda Shopify.

## 📋 Prerrequisitos

- Tienda Shopify activa
- Acceso a archivos de tema
- Credenciales de Airtable configuradas
- Archivos del componente construidos

## 🚀 Pasos de Integración

### 1. Preparar Archivos

Después de construir el proyecto:

```bash
npm run build
```

Obtendrás estos archivos en la carpeta `dist/`:
- `cotizacion-unificado.js`
- `cotizacion-unificado.css`

### 2. Subir Assets a Shopify

1. **Acceder al Admin de Shopify**:
   - Ve a `Online Store` → `Themes`
   - Selecciona tu tema activo
   - Haz clic en `Actions` → `Edit code`

2. **Subir archivos JavaScript**:
   - Ve a la sección `Assets`
   - Haz clic en `Add a new asset`
   - Sube `cotizacion-unificado.js`

3. **Subir archivos CSS**:
   - En la misma sección `Assets`
   - Sube `cotizacion-unificado.css`

### 3. Modificar Plantillas Liquid

#### Opción A: Reemplazar Componentes Existentes

**Archivo**: `templates/cart.liquid` o donde tengas los componentes actuales

```liquid
<!-- ELIMINAR ESTE CÓDIGO -->
{% if customer.tags contains 'Asesor' %}
  {%- render 'component-asesores'-%}
{% else %}
  {%- render 'componente-depositos'-%}
{% endif %}

<!-- REEMPLAZAR CON ESTE CÓDIGO -->
<div id="cotizacion-root"></div>

<script>
  // Datos del cliente y carrito
  window.shopifyCotizacionData = {
    role: "{{ customer.tags }}",
    idCliente: "{{ customer.default_address.company }}",
    email: "{{ customer.email }}",
    productos: [
      {% for item in cart.items %}
        { 
          variantId: {{ item.variant_id }}, 
          title: "{{ item.title | escape }}", 
          sku: "{{ item.sku | escape }}", 
          quantity: {{ item.quantity }},
          price: {{ item.price }}
        }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ],
    totalItems: {{ cart.item_count }},
    totalPrice: {{ cart.total_price }}
  };
</script>

<!-- Cargar el componente -->
{{ 'cotizacion-unificado.css' | asset_url | stylesheet_tag }}
<script src="{{ 'cotizacion-unificado.js' | asset_url }}" defer></script>
```

#### Opción B: Crear Snippet Reutilizable

**Archivo**: `snippets/cotizacion-component.liquid`

```liquid
<div id="cotizacion-root"></div>

<script>
  window.shopifyCotizacionData = {
    role: "{{ customer.tags }}",
    idCliente: "{{ customer.default_address.company }}",
    email: "{{ customer.email }}",
    productos: [
      {% for item in cart.items %}
        { 
          variantId: {{ item.variant_id }}, 
          title: "{{ item.title | escape }}", 
          sku: "{{ item.sku | escape }}", 
          quantity: {{ item.quantity }},
          price: {{ item.price }}
        }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ],
    totalItems: {{ cart.item_count }},
    totalPrice: {{ cart.total_price }}
  };
</script>

{{ 'cotizacion-unificado.css' | asset_url | stylesheet_tag }}
<script src="{{ 'cotizacion-unificado.js' | asset_url }}" defer></script>
```

Luego usar en cualquier plantilla:

```liquid
{% render 'cotizacion-component' %}
```

### 4. Configurar Variables de Entorno

**Archivo**: `config/settings_schema.json` (opcional)

```json
{
  "name": "Cotización",
  "settings": [
    {
      "type": "header",
      "content": "Configuración de Airtable"
    },
    {
      "type": "text",
      "id": "airtable_api_key",
      "label": "API Key de Airtable",
      "info": "Tu API key de Airtable"
    },
    {
      "type": "text",
      "id": "airtable_base_id",
      "label": "Base ID de Airtable",
      "info": "ID de tu base de datos en Airtable"
    }
  ]
}
```

### 5. Personalizar Estilos (Opcional)

**Archivo**: `assets/cotizacion-custom.css`

```css
/* Personalizaciones específicas de tu tema */
.Wrapp-component {
  max-width: 900px; /* Ajustar ancho máximo */
}

.title-card_component {
  color: #your-brand-color; /* Color de marca */
}

.guardarComentsBtn {
  background-color: #your-button-color; /* Color de botón */
}
```

Incluir en la plantilla:

```liquid
{{ 'cotizacion-custom.css' | asset_url | stylesheet_tag }}
```

## 🔧 Configuración Avanzada

### Variables de Entorno Dinámicas

Si necesitas configurar variables de entorno dinámicamente:

```liquid
<script>
  window.shopifyCotizacionData = {
    // ... datos del carrito ...
    config: {
      airtableApiKey: "{{ settings.airtable_api_key }}",
      airtableBaseId: "{{ settings.airtable_base_id }}",
      environment: "{{ settings.environment | default: 'production' }}"
    }
  };
</script>
```

### Manejo de Errores Personalizado

```liquid
<script>
  window.shopifyCotizacionData = {
    // ... datos del carrito ...
    onError: function(error) {
      // Lógica personalizada de manejo de errores
      console.error('Error en cotización:', error);
      
      // Enviar a analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'cotizacion_error', {
          error_message: error.message
        });
      }
    }
  };
</script>
```

### Integración con Analytics

```liquid
<script>
  window.shopifyCotizacionData = {
    // ... datos del carrito ...
    onSuccess: function(result) {
      // Tracking de conversión
      if (typeof gtag !== 'undefined') {
        gtag('event', 'cotizacion_enviada', {
          event_category: 'engagement',
          event_label: 'cotizacion',
          value: {{ cart.total_price | divided_by: 100 }}
        });
      }
      
      // Facebook Pixel
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead');
      }
    }
  };
</script>
```

## 🧪 Testing

### 1. Testing en Desarrollo

```liquid
<!-- Agregar al final de la plantilla para testing -->
<script>
  // Solo en desarrollo
  if (window.location.hostname.includes('myshopify.com')) {
    console.log('Datos de cotización:', window.shopifyCotizacionData);
  }
</script>
```

### 2. Testing de Roles

```liquid
<!-- Forzar rol para testing -->
<script>
  window.shopifyCotizacionData = {
    // ... otros datos ...
    role: "Asesor", // o "Deposito" para testing
  };
</script>
```

### 3. Testing de Datos

```liquid
<!-- Datos de prueba -->
<script>
  window.shopifyCotizacionData = {
    role: "Deposito",
    idCliente: "D-TEST-123",
    email: "test@ejemplo.com",
    productos: [
      {
        variantId: 123,
        title: "Producto de Prueba",
        sku: "TEST-001",
        quantity: 1,
        price: 10000
      }
    ],
    totalItems: 1,
    totalPrice: 10000
  };
</script>
```

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Componente no se carga

**Síntomas**: No aparece el componente en la página

**Soluciones**:
- Verificar que los archivos JS/CSS estén subidos correctamente
- Revisar la consola del navegador por errores
- Verificar que el contenedor `#cotizacion-root` exista

#### 2. Datos no se cargan

**Síntomas**: El componente aparece pero no hay datos

**Soluciones**:
- Verificar que `window.shopifyCotizacionData` esté definido
- Revisar que el cliente esté logueado
- Verificar que el carrito tenga productos

#### 3. Errores de API

**Síntomas**: Errores al enviar cotización

**Soluciones**:
- Verificar credenciales de Airtable
- Revisar permisos de la API key
- Verificar que las tablas existan en Airtable

### Debugging

```liquid
<!-- Habilitar modo debug -->
<script>
  window.shopifyCotizacionData = {
    // ... datos ...
    debug: true
  };
</script>
```

## 📱 Responsive Design

El componente es responsive por defecto, pero puedes ajustar los breakpoints:

```css
/* En tu CSS personalizado */
@media (max-width: 768px) {
  .Wrapp-component {
    padding: 10px;
  }
  
  .cardComponent {
    padding: 15px;
  }
}
```

## 🔄 Actualizaciones

Para actualizar el componente:

1. **Construir nueva versión**:
   ```bash
   npm run build
   ```

2. **Subir nuevos archivos** a Shopify Assets

3. **Limpiar caché** del navegador

4. **Probar** en diferentes dispositivos y roles

## 📞 Soporte

Si encuentras problemas durante la integración:

1. Revisar la consola del navegador
2. Verificar los logs de Airtable
3. Contactar al equipo de desarrollo

---

**¡Listo! Tu componente de cotización unificado está integrado con Shopify.** 🎉

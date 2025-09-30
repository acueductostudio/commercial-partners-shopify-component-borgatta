# Componente de Cotización Unificado

Componente React unificado para cotizaciones de Shopify con manejo de roles (Depósito/Asesor).

## 🚀 Uso Rápido

### Instalación
```bash
npm install
```

### Variables de Entorno
El proyecto ya incluye un archivo `.env` configurado con las credenciales de Airtable.

**Desarrollo Local:**
```bash
# El archivo .env ya existe y está configurado
# Parcel lo lee automáticamente
```

**Producción (Vercel):**
- Configura las variables en Vercel Dashboard (no uses el archivo `.env`)
- Ver **[DEPLOY_VERCEL.md](DEPLOY_VERCEL.md)** para guía completa
- Ver **[VARIABLES_ENTORNO.md](VARIABLES_ENTORNO.md)** para troubleshooting

### Desarrollo
```bash
npm run dev
```
Abre `http://localhost:3000` - Panel completo con controles de desarrollo
**¡Sin build!** Los cambios se reflejan automáticamente.

### Producción
```bash
npm run build
```
Archivos listos en `dist/`: `cotizacion-unificado.js` y `cotizacion-unificado.css`

## 📁 Archivo Único

**`index.html`** - Un solo archivo para desarrollo y producción:

### 🧪 Modo Desarrollo
- Panel de controles visible
- Datos de prueba
- Botones para cambiar entre Depósito/Asesor
- Debug info
- Modo Mock habilitado

### 🚀 Modo Producción
1. **Comenta** la sección `dev-controls` en HTML
2. **Comenta** el script de desarrollo
3. **Descomenta** el script de producción (Shopify Liquid)

## 🔧 Configuración para Shopify

En `index.html`, reemplaza el script de desarrollo con:

```html
<script>
    // Datos reales de Shopify
    const shopifyData = {
        role: "{{ customer.tags }}",
        idCliente: "{{ customer.default_address.company }}",
        email: "{{ customer.email }}",
        productos: [
            {% for item in cart.items %}
            {
                variantId: {{ item.variant_id }},
                title: "{{ item.title }}",
                sku: "{{ item.sku }}",
                quantity: {{ item.quantity }}
            }{% unless forloop.last %},{% endunless %}
            {% endfor %}
        ],
        totalItems: {{ cart.item_count }},
        totalPrice: {{ cart.total_price | money_without_currency }}
    };
    
    // Inicializar componente
    function initializeProductionComponent() {
        if (window.CotizacionComponent) {
            window.CotizacionComponent.initializeCotizacionComponent(
                'cotizacion-root',
                shopifyData
            );
        } else {
            setTimeout(initializeProductionComponent, 100);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeProductionComponent);
    } else {
        initializeProductionComponent();
    }
</script>
```

## 📋 Comandos Disponibles

- `npm run dev` - Desarrollo con auto-reload (puerto 3000)
- `npm run build` - Build para producción
- `npm start` - Desarrollo sin auto-reload

## 🎯 Flujos Soportados

### Depósito
- Selecciona dirección de sus propias direcciones
- Campos: RFC, Email Telemarketing

### Asesor
- Selecciona depósito del cliente
- Selecciona dirección del depósito
- Campos: Asesor, Email Asesor

## 🔗 Integración Airtable

Todas las solicitudes se envían a la tabla **"Pedidos"** (`tbl7q7V4X0euPXyyC`).

### Variables de Entorno de Airtable
- `AIRTABLE_API_KEY` - API Key de Airtable
- `AIRTABLE_BASE_ID` - ID de la base
- `AIRTABLE_PEDIDOS_TABLE` - ID de tabla de pedidos
- `AIRTABLE_CLIENTS_TABLE` - ID de tabla de clientes
- `AIRTABLE_ADVISORS_TABLE` - ID de tabla de asesores

**Nota**: En desarrollo, usa los valores por defecto en `src/config/env.js`. En producción (Vercel), configura estas variables en el Dashboard.

### Campos Enviados
- `Idcliente` - ID del cliente/depósito
- `DireccionDeposito` - Dirección seleccionada
- `Comentario` - Comentarios del usuario
- `productos` - Lista de productos
- `Email` - Email del cliente
- `Asesor` - ID del asesor (solo Asesor)
- `emailAsesor` - Email del asesor (solo Asesor)
- `SolicitudPor` - "Deposito" o "Asesor"
- `Deposito` - ID del depósito seleccionado
- `NameProduct`, `SkuProduct`, `CantidadProduct` - Detalles de productos

## 🧪 Testing

### Datos de Prueba
- **Depósito**: ID `D-123574654`
- **Asesor**: ID `A-454654654`

### Modo Mock
- Simula respuestas de API
- Evita límites de Airtable
- Activado automáticamente en localhost

## 📁 Estructura

```
├── index.html              # Archivo único (desarrollo + producción)
├── src/                    # Código fuente React
├── dist/                   # Build de producción
├── scripts/                # Scripts de build
└── package.json           # Configuración
```

## 🔄 Flujo de Trabajo

1. **Desarrollo**: `npm run dev` → Edita archivos en `src/` → Cambios automáticos
2. **Testing**: Usa controles en `index.html` para probar diferentes escenarios
3. **Producción**: Comenta sección de desarrollo en `index.html` → Deploy

---

**¡Un solo archivo, dos modos, máxima simplicidad!** 🎉
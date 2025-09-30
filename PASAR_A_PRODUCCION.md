# 🚀 Guía para Pasar a Producción

Esta guía te muestra **exactamente** qué secciones comentar en el archivo `index.html` para desplegar en Shopify.

---

## 📋 Checklist de Producción

- [ ] Desactivar modo Mock
- [ ] Comentar panel de desarrollo
- [ ] Comentar script de desarrollo
- [ ] Descomentar script de producción
- [ ] Hacer build de producción
- [ ] Subir archivos a Shopify

---

## 🔧 Paso 1: Desactivar Modo Mock

Antes de hacer build, asegúrate de que el modo mock esté desactivado:

### Opción A: Desde la interfaz (si tienes el servidor corriendo)
1. Abre `http://localhost:3000`
2. **Desmarca** el checkbox "Modo Mock (datos de prueba)"
3. Verifica que diga "PRODUCCIÓN" en verde

### Opción B: En el código (recomendado)
En `src/core/airtable/mockService.js`:

```javascript
// Línea 5-6
const mockConfig = {
  enabled: false,  // ← Cambiar a false para producción
  manual: false
};
```

---

## 📝 Paso 2: Modificar `index.html`

### Sección 1: Panel de Desarrollo (COMENTAR)

**Líneas 159-187** - Comentar todo el panel de controles:

```html
<!-- COMENTAR DESDE AQUÍ PARA PRODUCCIÓN -->
<!--
<div class="dev-controls">
    <h3>🧪 Panel de Desarrollo</h3>
    
    <div class="control-group">
        <label>
            <input type="checkbox" id="mockModeCheckbox">
            <span>Modo Mock (datos de prueba)</span>
        </label>
        <span id="mockStatus" class="status mock">MOCK</span>
    </div>
    
    <div class="control-group">
        <button class="btn" onclick="loadDepositoData()">📦 Cargar Datos Depósito</button>
        <button class="btn" onclick="loadAsesorData()">👤 Cargar Datos Asesor</button>
        <button class="btn secondary" onclick="clearComponent()">🗑️ Limpiar</button>
    </div>
    
    <div class="control-group">
        <button class="btn warning" onclick="showDebugInfo()">🔍 Debug Info</button>
        <button class="btn success" onclick="toggleMockMode()">🔄 Cambiar Modo</button>
        <button class="btn" onclick="testReact()">🧪 Test React</button>
        <button class="btn secondary" onclick="checkComponentStatus()">📋 Estado del Componente</button>
    </div>
</div>
-->
<!-- COMENTAR HASTA AQUÍ -->
```

### Sección 2: Estilos del Panel (OPCIONAL - COMENTAR)

**Líneas 38-147** - Puedes comentar los estilos del panel de desarrollo:

```html
<!-- ESTILOS SOLO PARA DESARROLLO - COMENTAR EN PRODUCCIÓN -->
<!--
.dev-controls {
    background: #34495e;
    color: white;
    padding: 20px;
    border-bottom: 1px solid #2c3e50;
}
... (resto de estilos)
-->
```

### Sección 3: Script de Desarrollo (COMENTAR)

**Líneas 198-633** - Comentar TODO el script de desarrollo:

```html
<!-- SCRIPT DE DESARROLLO - COMENTAR EN PRODUCCIÓN -->
<!--
<script type="module">
    // TODO EL CONTENIDO DEL SCRIPT DE DESARROLLO
    // ... loadComponent(), TEST_DATA, funciones, etc.
</script>
-->
```

### Sección 4: Script de Producción (DESCOMENTAR)

**Líneas 587-633** - Descomentar y configurar el script de producción:

```html
<!-- DESCOMENTAR PARA PRODUCCIÓN -->
<script type="module">
    // Importar el componente
    import './src/index.js';
    
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
                quantity: {{ item.quantity }},
                price: {{ item.price }}
            }{% unless forloop.last %},{% endunless %}
            {% endfor %}
        ],
        totalItems: {{ cart.item_count }},
        totalPrice: {{ cart.total_price | money_without_currency }}
    };
    
    // Inicializar componente cuando esté listo
    function initializeProductionComponent() {
        if (window.CotizacionComponent && window.CotizacionComponent.initializeCotizacionComponent) {
            // IMPORTANTE: Orden correcto de parámetros
            window.CotizacionComponent.initializeCotizacionComponent(
                shopifyData,           // ← Props primero
                'cotizacion-root'      // ← Container ID segundo
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

---

## 🏗️ Paso 3: Hacer Build de Producción

```bash
# En tu terminal
npm run build
```

Esto generará los archivos en `dist/`:
- `cotizacion-unificado.js`
- `cotizacion-unificado.css`

---

## 📤 Paso 4: Subir a Shopify

### Archivos a Subir

1. **JavaScript**: `dist/cotizacion-unificado.js`
   - Subir a: `Assets` en Shopify
   - Nombre sugerido: `cotizacion-unificado.js`

2. **CSS**: `dist/cotizacion-unificado.css`
   - Subir a: `Assets` en Shopify
   - Nombre sugerido: `cotizacion-unificado.css`

### Integrar en Shopify Theme

En tu template de Shopify (ej: `cart.liquid` o página personalizada):

```liquid
<!-- En el <head> -->
{{ 'cotizacion-unificado.css' | asset_url | stylesheet_tag }}

<!-- En el <body>, donde quieras que aparezca el componente -->
<div id="cotizacion-root"></div>

<!-- Antes de cerrar </body> -->
<script type="module" src="{{ 'cotizacion-unificado.js' | asset_url }}"></script>

<script type="module">
    // Script de inicialización (el mismo de arriba)
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
                quantity: {{ item.quantity }},
                price: {{ item.price }}
            }{% unless forloop.last %},{% endunless %}
            {% endfor %}
        ],
        totalItems: {{ cart.item_count }},
        totalPrice: {{ cart.total_price | money_without_currency }}
    };
    
    function initializeProductionComponent() {
        if (window.CotizacionComponent && window.CotizacionComponent.initializeCotizacionComponent) {
            window.CotizacionComponent.initializeCotizacionComponent(
                shopifyData,
                'cotizacion-root'
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

---

## ✅ Verificación Post-Despliegue

1. **Abre la página en Shopify**
2. **Abre la consola del navegador** (F12)
3. **Verifica que NO aparezcan estos logs:**
   - ❌ "🧪 Panel de Desarrollo"
   - ❌ "MOCK MODE"
   - ❌ Datos de prueba

4. **Verifica que SÍ aparezcan:**
   - ✅ "✅ window.CotizacionComponent configurado"
   - ✅ Datos reales de Shopify
   - ✅ Componente renderizado correctamente

5. **Prueba funcional:**
   - ✅ Seleccionar dirección
   - ✅ Agregar comentarios
   - ✅ Enviar cotización
   - ✅ Verificar que llegue a Airtable

---

## 🔄 Para Volver a Desarrollo

Si necesitas hacer cambios:

1. **Descomenta** el panel de desarrollo
2. **Descomenta** el script de desarrollo
3. **Comenta** el script de producción
4. **Activa** el modo mock desde la interfaz o código
5. **Ejecuta**: `npm run dev`

---

## 📊 Resumen Visual

```
DESARROLLO (localhost:3000)
├── ✅ Panel de controles visible
├── ✅ Botones de prueba
├── ✅ Modo mock activado
├── ✅ Datos de prueba
└── ✅ Hot reload activo

    ↓ [Pasar a Producción]

PRODUCCIÓN (Shopify)
├── ❌ Panel de controles (comentado)
├── ❌ Botones de prueba (comentados)
├── ❌ Modo mock (desactivado)
├── ✅ Datos reales de Shopify
└── ✅ Build optimizado
```

---

## 🐛 Troubleshooting

### El componente no se renderiza en Shopify

**Causas posibles:**
1. El script de producción aún está comentado
2. Los archivos JS/CSS no se cargaron correctamente
3. El `div#cotizacion-root` no existe

**Solución:**
1. Verifica que descomentas el script de producción
2. Verifica que los archivos estén en Assets
3. Verifica que el div exista en el template

### Sigue apareciendo "Modo Mock"

**Causa:** El modo mock sigue activado en el código

**Solución:**
1. Ve a `src/core/airtable/mockService.js`
2. Cambia `enabled: true` a `enabled: false`
3. Haz build de nuevo: `npm run build`

### Los datos no se envían a Airtable

**Causa:** Variables de entorno no configuradas o modo mock activo

**Solución:**
1. Verifica `.env` o variables de Vercel
2. Desactiva modo mock
3. Verifica credenciales de Airtable

---

## 📚 Archivos de Referencia

- **Build**: Ver `package.json` scripts
- **Deploy Vercel**: Ver `DEPLOY_VERCEL.md`
- **Variables**: Ver `VARIABLES_ENTORNO.md`
- **Integración Shopify**: Ver `INTEGRACION_SHOPIFY.md`

---

**¡Tu componente está listo para producción! 🚀**

Recuerda hacer pruebas en un entorno de staging antes de desplegar a producción.


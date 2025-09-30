# 🧪 Guía de Testing Local

Esta guía te explica cómo probar el componente de cotización localmente con datos dummy antes de subirlo a Shopify.

## 🚀 Inicio Rápido

### Opción 1: Servidor de Desarrollo (Recomendado)

```bash
# 1. Construir el proyecto
npm run build

# 2. Iniciar servidor de testing
npm run test:local
```

Esto iniciará un servidor en `http://localhost:3000` con una interfaz completa de testing.

### Opción 2: Abrir Archivo Directamente

```bash
# 1. Construir el proyecto
npm run build

# 2. Abrir el archivo de testing
open test-local.html
```

## 🎮 Interfaz de Testing

El archivo `test-local.html` incluye:

### 📊 Panel de Control
- **Botones de datos predefinidos**: Depósito básico, Asesor básico, datos completos, etc.
- **Controles personalizados**: Cambiar rol, limpiar componente
- **Logs en tiempo real**: Ver errores y mensajes de debug

### 📋 Datos de Prueba Disponibles

1. **Depósito Básico**: Un producto simple
2. **Asesor Básico**: Un producto con rol de asesor
3. **Datos Completos**: Múltiples productos
4. **Datos Inválidos**: Para probar validaciones
5. **Muchos Productos**: Stress test con 15 productos
6. **Sin Productos**: Carrito vacío
7. **Edge Cases**: Casos límite y datos extremos

### 🔧 Funcionalidades de Testing

- **Logs en tiempo real**: Ve todos los console.log, errores y warnings
- **Datos actuales**: Visualiza los datos que se están pasando al componente
- **Cambio de rol**: Cambia entre Depósito y Asesor dinámicamente
- **Limpieza**: Limpia el componente y logs

## 📝 Ejemplos de Uso

### 1. Probar Flujo de Depósito

```javascript
// En la consola del navegador
const datosDeposito = {
    role: "Deposito",
    idCliente: "D-TEST-001",
    email: "deposito@test.com",
    productos: [
        {
            variantId: 123,
            title: "Producto Test",
            sku: "TEST-001",
            quantity: 2,
            price: 10000
        }
    ],
    totalItems: 2,
    totalPrice: 20000
};

window.CotizacionComponent.renderWithProps(datosDeposito);
```

### 2. Probar Flujo de Asesor

```javascript
const datosAsesor = {
    role: "Asesor",
    idCliente: "A-TEST-001",
    email: "asesor@test.com",
    productos: [
        {
            variantId: 124,
            title: "Producto Asesor",
            sku: "ASESOR-001",
            quantity: 1,
            price: 15000
        }
    ],
    totalItems: 1,
    totalPrice: 15000
};

window.CotizacionComponent.renderWithProps(datosAsesor);
```

### 3. Probar Datos Inválidos

```javascript
const datosInvalidos = {
    role: "", // Rol vacío
    idCliente: "", // ID vacío
    email: "email-invalido", // Email inválido
    productos: [], // Sin productos
    totalItems: 0,
    totalPrice: 0
};

window.CotizacionComponent.renderWithProps(datosInvalidos);
```

## 🔍 Debugging

### 1. Ver Logs en Tiempo Real

La interfaz de testing captura automáticamente:
- `console.log()`
- `console.error()`
- `console.warn()`
- Errores globales de JavaScript
- Promesas rechazadas

### 2. Inspeccionar Datos

```javascript
// Ver datos actuales
console.log('Datos actuales:', window.shopifyCotizacionData);

// Ver estado del componente
console.log('Componente disponible:', window.CotizacionComponent);
```

### 3. Simular Errores de API

```javascript
// Interceptar llamadas a Airtable
const originalFetch = window.fetch;
window.fetch = function(url, options) {
    if (url.includes('airtable.com')) {
        console.log('🚫 Simulando error de API');
        return Promise.reject(new Error('Error simulado de Airtable'));
    }
    return originalFetch(url, options);
};
```

## 🧪 Escenarios de Prueba

### 1. Flujo Completo de Depósito
1. Cargar "Depósito Básico"
2. Agregar comentarios
3. Seleccionar dirección
4. Enviar cotización
5. Verificar logs de éxito

### 2. Flujo Completo de Asesor
1. Cargar "Asesor Básico"
2. Seleccionar depósito
3. Seleccionar dirección
4. Agregar comentarios
5. Enviar cotización

### 3. Validaciones
1. Cargar "Datos Inválidos"
2. Verificar mensajes de error
3. Probar con campos vacíos
4. Probar con emails inválidos

### 4. Performance
1. Cargar "Muchos Productos"
2. Verificar tiempo de renderizado
3. Probar con datos extremos
4. Monitorear uso de memoria

## 🐛 Troubleshooting

### Problema: Componente no se carga

**Solución:**
```bash
# Verificar que el build esté actualizado
npm run build

# Verificar archivos en dist/
ls -la dist/
```

### Problema: Errores de CORS

**Solución:**
```bash
# Usar el servidor de desarrollo
npm run test:local

# En lugar de abrir el archivo directamente
```

### Problema: Datos no se muestran

**Solución:**
```javascript
// Verificar que los datos estén bien formateados
console.log('Datos:', datos);

// Verificar que el componente esté disponible
console.log('Componente:', window.CotizacionComponent);
```

## 📊 Métricas de Testing

### Tiempos de Carga
- **Componente básico**: < 1 segundo
- **Con muchos productos**: < 2 segundos
- **Con datos inválidos**: < 500ms

### Memoria
- **Uso base**: ~10MB
- **Con muchos productos**: ~15MB
- **Después de limpiar**: ~10MB

## 🚀 Próximos Pasos

Después de probar localmente:

1. **Verificar funcionalidad**: Todos los flujos funcionan correctamente
2. **Probar edge cases**: Datos extremos y casos límite
3. **Optimizar**: Si encuentras problemas de performance
4. **Documentar**: Anotar cualquier comportamiento inesperado
5. **Subir a Shopify**: Cuando esté todo listo

## 💡 Tips

- **Usa los logs**: Son tu mejor amigo para debugging
- **Prueba diferentes roles**: Asegúrate de que ambos flujos funcionen
- **Simula errores**: Prueba qué pasa cuando falla la API
- **Prueba en diferentes navegadores**: Chrome, Firefox, Safari
- **Prueba responsive**: Diferentes tamaños de pantalla

---

**¡Happy Testing!** 🎉

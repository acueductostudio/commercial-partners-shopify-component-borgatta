# 🧪 Cómo Probar el Componente Localmente

## 🎯 Resumen Rápido

Para probar el componente con datos dummy antes de subirlo a Shopify:

### 1. **Construir el proyecto**
```bash
npm run build
```

### 2. **Iniciar servidor de testing**
```bash
npm run test:local
```

### 3. **Abrir en el navegador**
```
http://localhost:3000
```

## 🎮 Interfaz de Testing

La interfaz incluye:

- **📊 Panel de Control**: Botones para cargar diferentes datos de prueba
- **📋 Datos Actuales**: Visualización de los datos que se están pasando
- **📝 Logs en Tiempo Real**: Captura de console.log, errores y warnings
- **🔧 Controles**: Limpiar, cambiar rol, ver logs

## 📊 Datos de Prueba Disponibles

| Botón | Descripción | Rol | Productos |
|-------|-------------|-----|-----------|
| **Depósito Básico** | Flujo simple de depósito | Deposito | 1 producto |
| **Asesor Básico** | Flujo simple de asesor | Asesor | 1 producto |
| **Datos Completos** | Múltiples productos | Deposito | 3 productos |
| **Datos Inválidos** | Para probar validaciones | - | 0 productos |
| **Muchos Productos** | Stress test | Deposito | 15 productos |
| **Sin Productos** | Carrito vacío | Deposito | 0 productos |
| **Edge Cases** | Casos límite | Asesor | 3 productos extremos |

## 🔍 Qué Probar

### ✅ Flujos Básicos
1. **Depósito**: Cargar → Agregar comentarios → Seleccionar dirección → Enviar
2. **Asesor**: Cargar → Seleccionar depósito → Seleccionar dirección → Enviar

### ✅ Validaciones
1. **Datos inválidos**: Verificar mensajes de error
2. **Campos vacíos**: Probar validaciones
3. **Emails inválidos**: Verificar formato

### ✅ Edge Cases
1. **Nombres largos**: Productos con nombres muy largos
2. **Precios extremos**: Precios muy altos/bajos
3. **Cantidades grandes**: Muchos productos

### ✅ Performance
1. **Tiempo de carga**: < 2 segundos
2. **Memoria**: Monitorear uso
3. **Responsive**: Diferentes pantallas

## 🐛 Debugging

### Ver Logs
- Los logs aparecen automáticamente en el panel
- Captura console.log, console.error, console.warn
- Muestra errores globales de JavaScript

### Inspeccionar Datos
```javascript
// En la consola del navegador
console.log('Datos actuales:', window.shopifyCotizacionData);
console.log('Componente:', window.CotizacionComponent);
```

### Simular Errores
```javascript
// Interceptar API calls
const originalFetch = window.fetch;
window.fetch = function(url, options) {
    if (url.includes('airtable.com')) {
        return Promise.reject(new Error('Error simulado'));
    }
    return originalFetch(url, options);
};
```

## 🚀 Comandos Útiles

```bash
# Construir y probar
npm run test:build

# Solo construir
npm run build

# Solo servidor de testing
npm run test:local

# Desarrollo con hot reload
npm run dev
```

## 📱 URLs Disponibles

- **http://localhost:3000** - Interfaz completa de testing (recomendado)
- **http://localhost:3000/ejemplo-uso.html** - Ejemplo básico
- **http://localhost:3000/dist/index.html** - Build de desarrollo

## ✅ Checklist de Testing

### Antes de Subir a Shopify:

- [ ] **Flujo Depósito funciona** (cargar, comentarios, dirección, enviar)
- [ ] **Flujo Asesor funciona** (cargar, depósito, dirección, enviar)
- [ ] **Validaciones funcionan** (datos inválidos muestran errores)
- [ ] **Edge cases funcionan** (nombres largos, precios extremos)
- [ ] **Performance es buena** (< 2 segundos de carga)
- [ ] **Responsive funciona** (diferentes tamaños de pantalla)
- [ ] **Logs son claros** (errores se muestran correctamente)
- [ ] **Limpieza funciona** (limpiar componente y logs)

## 🎉 ¡Listo para Shopify!

Una vez que hayas probado todo localmente y esté funcionando correctamente:

1. **Subir archivos** `cotizacion-unificado.js` y `cotizacion-unificado.css` a Shopify Assets
2. **Actualizar código Liquid** en las plantillas
3. **Probar en staging** de Shopify
4. **Desplegar en producción**

---

**¡Happy Testing!** 🚀

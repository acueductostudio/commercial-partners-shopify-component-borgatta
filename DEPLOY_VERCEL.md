# 🚀 Guía de Despliegue en Vercel

## 📋 Tabla de Contenidos
- [Variables de Entorno](#variables-de-entorno)
- [Archivos de Configuración](#archivos-de-configuración)
- [Pasos para Desplegar](#pasos-para-desplegar)
- [Verificación Post-Despliegue](#verificación-post-despliegue)
- [Troubleshooting](#troubleshooting)

---

## 🔐 Variables de Entorno

### Variables Requeridas en Vercel

Configura estas variables en **Vercel Dashboard** → **Settings** → **Environment Variables**:

```bash
AIRTABLE_API_KEY=tu_api_key_aqui
AIRTABLE_BASE_ID=tu_base_id_aqui
AIRTABLE_PEDIDOS_TABLE=tu_tabla_pedidos_id
AIRTABLE_CLIENTS_TABLE=tu_tabla_clientes_id
AIRTABLE_ADVISORS_TABLE=tu_tabla_asesores_id
```

### ⚠️ Importante
- Estas variables deben configurarse para los entornos: **Production**, **Preview**, y **Development**
- No compartas estas credenciales públicamente
- Mantén el archivo `.env` fuera del control de versiones (ya está en `.gitignore`)

---

## 📁 Archivos de Configuración

### 1. `vercel.json`
Ya está configurado en el proyecto con:
- Build command: `npm run build`
- Output directory: `dist`
- Framework: null (Parcel se encarga del build)

### 2. `.gitignore`
Ya está configurado para excluir:
- `node_modules/`
- `dist/`
- `.parcel-cache/`
- `.env` y `.env.local`
- Archivos del sistema

### 3. `.env.example`
Archivo de referencia para documentar las variables necesarias (sin valores reales)

---

## 🚀 Pasos para Desplegar

### Opción 1: Despliegue desde GitHub (Recomendado)

1. **Sube tu código a GitHub:**
   ```bash
   git add .
   git commit -m "Preparar proyecto para despliegue en Vercel"
   git push -u origin main
   ```

2. **Conecta con Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Click en **"Add New Project"**
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente la configuración

3. **Configura las Variables de Entorno:**
   - En la página de configuración del proyecto
   - Ve a **"Environment Variables"**
   - Agrega cada variable listada arriba
   - Selecciona los entornos: Production, Preview, Development

4. **Despliega:**
   - Click en **"Deploy"**
   - Vercel construirá y desplegará automáticamente

### Opción 2: Despliegue con Vercel CLI

1. **Instala Vercel CLI (si no lo tienes):**
   ```bash
   npm install -g vercel
   ```

2. **Login en Vercel:**
   ```bash
   vercel login
   ```

3. **Despliega:**
   ```bash
   # Para preview
   vercel
   
   # Para producción
   vercel --prod
   ```

4. **Configura variables de entorno desde CLI:**
   ```bash
   vercel env add AIRTABLE_API_KEY
   vercel env add AIRTABLE_BASE_ID
   vercel env add AIRTABLE_PEDIDOS_TABLE
   vercel env add AIRTABLE_CLIENTS_TABLE
   vercel env add AIRTABLE_ADVISORS_TABLE
   ```

---

## ✅ Verificación Post-Despliegue

### 1. Verifica que el Build fue Exitoso
- En Vercel Dashboard, revisa que el build no tenga errores
- El output debe mostrar: `✓ Built in XXs`

### 2. Prueba la Aplicación
- Abre la URL de producción (ej: `https://tu-proyecto.vercel.app`)
- Prueba ambos roles:
  - **Depósito**: Click en "📦 Cargar Datos Depósito"
  - **Asesor**: Click en "👔 Cargar Datos Asesor"

### 3. Verifica la Conexión con Airtable
- Abre la consola del navegador (F12)
- Verifica que no haya errores de API
- Intenta enviar una cotización de prueba
- Confirma que los datos lleguen a Airtable en la tabla "Pedidos"

### 4. Prueba el Modo Mock
- Click en "🔄 Toggle Mock Mode"
- Verifica que funcione con datos de prueba
- Vuelve a desactivar el modo mock

---

## 🐛 Troubleshooting

### Error: "AIRTABLE_API_KEY is not defined"
**Solución:** Verifica que las variables de entorno estén configuradas en Vercel Dashboard

### Error: "Failed to fetch"
**Solución:** 
- Verifica que las credenciales de Airtable sean correctas
- Confirma que las tablas existan en tu base de Airtable
- Revisa que el API key tenga permisos suficientes

### Error: "Build failed"
**Solución:**
- Revisa los logs del build en Vercel Dashboard
- Asegúrate de que todas las dependencias estén en `package.json`
- Verifica que `npm run build` funcione localmente

### La página se ve en blanco
**Solución:**
- Abre la consola del navegador para ver errores
- Verifica que `dist/` contenga los archivos correctos
- Confirma que `index.html` esté en el directorio raíz

### Cambios no se reflejan
**Solución:**
- Asegúrate de hacer commit y push a GitHub
- Vercel desplegará automáticamente en cada push a `main`
- Limpia la caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)

---

## 🔄 Re-despliegue y Actualizaciones

### Despliegue Automático
- Cada push a la rama `main` desplegará automáticamente
- Los pull requests crearán preview deployments

### Despliegue Manual
```bash
# Desde CLI
vercel --prod

# O en Vercel Dashboard
# Deployments → ... → Redeploy
```

---

## 📊 Monitoreo

### Analytics
- Ve a **Analytics** en Vercel Dashboard
- Revisa: Page views, visitors, top pages

### Logs
- Ve a **Deployments** → Click en un deployment
- **Logs** tab muestra los logs del build y runtime
- **Functions** tab (si usas serverless functions)

---

## 🔗 Enlaces Útiles

- [Documentación de Vercel](https://vercel.com/docs)
- [Configuración de Variables de Entorno](https://vercel.com/docs/environment-variables)
- [Parcel Bundler](https://parceljs.org/)
- [Airtable API](https://airtable.com/developers/web/api/introduction)

---

## 📝 Notas Adicionales

### Para Desarrollo Local
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales locales
# Luego ejecutar:
npm run dev
```

### Seguridad
- ⚠️ **NUNCA** hagas commit del archivo `.env`
- ⚠️ **NO** expongas las credenciales en el código frontend
- ✅ Usa variables de entorno para todas las credenciales
- ✅ Rota tus API keys periódicamente

### Performance
- Vercel CDN distribuirá tu aplicación globalmente
- Los assets estáticos se cachearán automáticamente
- El build de Parcel ya está optimizado para producción

---

**¿Necesitas ayuda?** Revisa la sección de [Troubleshooting](#troubleshooting) o contacta al equipo de desarrollo.


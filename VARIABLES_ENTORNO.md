# 🔐 Guía de Variables de Entorno

## ✅ Archivo `.env` Creado

Tu archivo `.env` ya está configurado con todas las credenciales necesarias.

---

## 📋 Variables Configuradas

```bash
AIRTABLE_API_KEY=patRKAOUDaKjoM6c1.***  # Tu API Key de Airtable
AIRTABLE_BASE_ID=appVwlmLP1164Ceku      # ID de tu base
AIRTABLE_PEDIDOS_TABLE=tbl7q7V4X0euPXyyC   # Tabla de Pedidos
AIRTABLE_CLIENTS_TABLE=tblgGAZYgdKhaKu7f   # Tabla de Clientes
AIRTABLE_ADVISORS_TABLE=tblA5nanxMBvyKiY9  # Tabla de Asesores
```

---

## 🚀 Cómo Funciona

### Desarrollo Local

1. **Parcel lee automáticamente** el archivo `.env`
2. **Las variables están disponibles** en `process.env.NOMBRE_VARIABLE`
3. **Valores por defecto** si no encuentra las variables (en `src/config/env.js`)

### Flujo de Carga

```
┌─────────────┐
│   .env      │  ← Variables locales
└──────┬──────┘
       ↓
┌─────────────────────┐
│ src/config/env.js   │  ← Lee process.env o usa defaults
└──────┬──────────────┘
       ↓
┌─────────────────────┐
│  Tu Aplicación      │  ← Usa ENV_CONFIG
└─────────────────────┘
```

---

## 🧪 Verificar que Funciona

### 1. Reinicia el servidor de desarrollo:
```bash
# Detén el servidor actual (Ctrl+C)
npm run dev
```

### 2. Verifica en la consola del navegador:
Deberías ver este log:
```
🔧 ENV_CONFIG cargado: {
  hasApiKey: true,
  baseId: "appVwlmLP1164Ceku",
  endpoints: ["PEDIDOS", "CLIENTS", "ADVISORS"]
}
```

### 3. Prueba el componente:
- Click en "📦 Cargar Datos Depósito" o "👔 Cargar Datos Asesor"
- Verifica que se carguen las direcciones desde Airtable
- Envía una cotización de prueba

---

## 🔒 Seguridad

### ✅ Lo que SÍ está protegido:
- ✅ `.env` está en `.gitignore` → **NO se sube a Git**
- ✅ `env.example` documenta las variables → **SIN valores reales**
- ✅ Valores por defecto en `src/config/env.js` → **Para desarrollo rápido**

### ⚠️ IMPORTANTE:
- **NUNCA** hagas commit del archivo `.env`
- **NUNCA** compartas las credenciales públicamente
- **SIEMPRE** usa `env.example` para documentar

---

## 🚀 Despliegue en Vercel

En Vercel, **NO uses el archivo `.env`**. En su lugar:

1. Ve a **Vercel Dashboard** → Tu Proyecto → **Settings** → **Environment Variables**
2. Agrega cada variable manualmente:
   - `AIRTABLE_API_KEY`
   - `AIRTABLE_BASE_ID`
   - `AIRTABLE_PEDIDOS_TABLE`
   - `AIRTABLE_CLIENTS_TABLE`
   - `AIRTABLE_ADVISORS_TABLE`

Vercel inyectará estas variables en `process.env` durante el build.

---

## 🔄 Cómo Cambiar las Variables

### Desarrollo Local:
1. Edita el archivo `.env`
2. Reinicia el servidor (`npm run dev`)

### Vercel:
1. Ve a **Settings** → **Environment Variables**
2. Edita la variable
3. **Redeploy** el proyecto

---

## 🐛 Troubleshooting

### Problema: "Las variables no se cargan"

**Solución:**
```bash
# 1. Verifica que el archivo existe
ls -la .env

# 2. Verifica el contenido
cat .env

# 3. Reinicia el servidor
# Ctrl+C para detener
npm run dev
```

### Problema: "process.env.VARIABLE is undefined"

**Causas posibles:**
1. El servidor no se reinició después de crear `.env`
2. Hay un error de sintaxis en `.env`
3. El nombre de la variable no coincide

**Solución:**
1. Reinicia el servidor
2. Verifica que no haya espacios extras: `VARIABLE=valor` (sin espacios)
3. Verifica que el nombre coincida exactamente

### Problema: "Parcel no lee el .env"

**Solución:**
Parcel lee automáticamente `.env`, pero asegúrate de:
- Que el archivo esté en la raíz del proyecto
- Que no haya errores de sintaxis
- Que el servidor se haya reiniciado

---

## 📝 Formato del Archivo .env

```bash
# Comentarios con #
VARIABLE=valor

# ❌ MAL - con espacios
VARIABLE = valor

# ✅ BIEN - sin espacios
VARIABLE=valor

# ✅ BIEN - con comillas si hay espacios en el valor
VARIABLE="valor con espacios"

# ❌ MAL - no uses export
export VARIABLE=valor

# ✅ BIEN - sin export
VARIABLE=valor
```

---

## 🎯 Próximos Pasos

1. ✅ **Archivo `.env` creado**
2. 🔄 **Reinicia el servidor**: `npm run dev`
3. 🧪 **Prueba el componente**
4. 🚀 **Deploy a Vercel**: Configura variables en el dashboard

---

## 📚 Recursos

- [Parcel - Variables de Entorno](https://parceljs.org/features/node-emulation/#environment-variables)
- [Vercel - Variables de Entorno](https://vercel.com/docs/environment-variables)
- [Seguridad - Mejores Prácticas](https://12factor.net/config)

---

**¡Tu proyecto ahora usa variables de entorno correctamente! 🎉**


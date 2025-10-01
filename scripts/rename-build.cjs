#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script para renombrar archivos de build a nombres más amigables
 */

const distDir = path.join(__dirname, '../dist');

// Función para encontrar archivos por extensión
function findFilesByExtension(ext) {
  try {
    const files = fs.readdirSync(distDir);
    return files.filter(file => 
      file.endsWith(ext) && 
      !file.endsWith('.map') &&
      !file.includes('cotizacion-unificado')
    );
  } catch (error) {
    console.error(`Error leyendo directorio ${distDir}:`, error.message);
    return [];
  }
}

// Función para renombrar archivos
function renameFiles() {
  try {
    console.log('\n🔍 Buscando archivos en:', distDir);
    
    // Buscar archivos CSS
    const cssFiles = findFilesByExtension('.css');
    const jsFiles = findFilesByExtension('.js');
    
    console.log('📦 Archivos encontrados:');
    console.log('  CSS:', cssFiles.length ? cssFiles : 'ninguno');
    console.log('  JS:', jsFiles.length ? jsFiles : 'ninguno');
    
    // Renombrar archivo CSS
    if (cssFiles.length > 0) {
      const cssFile = cssFiles[0];
      const newCssName = 'cotizacion-unificado.css';
      const oldCssPath = path.join(distDir, cssFile);
      const newCssPath = path.join(distDir, newCssName);
      
      // Si ya existe el archivo de destino, eliminarlo primero
      if (fs.existsSync(newCssPath)) {
        fs.unlinkSync(newCssPath);
      }
      
      fs.renameSync(oldCssPath, newCssPath);
      console.log(`✅ Renombrado: ${cssFile} → ${newCssName}`);
      
      // Renombrar source map si existe
      const cssMapFile = cssFile + '.map';
      const cssMapPath = path.join(distDir, cssMapFile);
      if (fs.existsSync(cssMapPath)) {
        const newCssMapName = newCssName + '.map';
        const newCssMapPath = path.join(distDir, newCssMapName);
        if (fs.existsSync(newCssMapPath)) {
          fs.unlinkSync(newCssMapPath);
        }
        fs.renameSync(cssMapPath, newCssMapPath);
        console.log(`✅ Renombrado: ${cssMapFile} → ${newCssMapName}`);
      }
    } else {
      console.log('⚠️  No se encontraron archivos CSS para renombrar');
    }
    
    // Renombrar archivo JS
    if (jsFiles.length > 0) {
      const jsFile = jsFiles[0];
      const newJsName = 'cotizacion-unificado.js';
      const oldJsPath = path.join(distDir, jsFile);
      const newJsPath = path.join(distDir, newJsName);
      
      // Si ya existe el archivo de destino, eliminarlo primero
      if (fs.existsSync(newJsPath)) {
        fs.unlinkSync(newJsPath);
      }
      
      fs.renameSync(oldJsPath, newJsPath);
      console.log(`✅ Renombrado: ${jsFile} → ${newJsName}`);
      
      // Renombrar source map si existe
      const jsMapFile = jsFile + '.map';
      const jsMapPath = path.join(distDir, jsMapFile);
      if (fs.existsSync(jsMapPath)) {
        const newJsMapName = newJsName + '.map';
        const newJsMapPath = path.join(distDir, newJsMapName);
        if (fs.existsSync(newJsMapPath)) {
          fs.unlinkSync(newJsMapPath);
        }
        fs.renameSync(jsMapPath, newJsMapPath);
        console.log(`✅ Renombrado: ${jsMapFile} → ${newJsMapName}`);
      }
    } else {
      console.log('⚠️  No se encontraron archivos JS para renombrar');
    }
    
    console.log('\n🎉 Proceso completado!');
    console.log('\n📄 Archivos listos para Shopify/CDN:');
    console.log('  - cotizacion-unificado.css');
    console.log('  - cotizacion-unificado.js\n');
    
  } catch (error) {
    console.error('❌ Error al renombrar archivos:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  renameFiles();
}

module.exports = { renameFiles };

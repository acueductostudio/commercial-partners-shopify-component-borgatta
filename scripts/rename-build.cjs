#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script para renombrar archivos de build a nombres más amigables
 */

const distDir = path.join(__dirname, '../dist');

// Función para encontrar archivos por patrón
function findFiles(pattern) {
  const files = fs.readdirSync(distDir);
  return files.filter(file => file.includes(pattern));
}

// Función para renombrar archivos
function renameFiles() {
  try {
    // Buscar archivos CSS
    const cssFiles = findFiles('.css');
    const jsFiles = findFiles('.js');
    
    console.log('Archivos encontrados:');
    console.log('CSS:', cssFiles);
    console.log('JS:', jsFiles);
    
    // Renombrar archivo CSS
    if (cssFiles.length > 0) {
      const cssFile = cssFiles[0];
      const newCssName = 'cotizacion-unificado.css';
      const oldCssPath = path.join(distDir, cssFile);
      const newCssPath = path.join(distDir, newCssName);
      
      fs.renameSync(oldCssPath, newCssPath);
      console.log(`✅ Renombrado: ${cssFile} → ${newCssName}`);
      
      // Renombrar source map si existe
      const cssMapFile = cssFile + '.map';
      if (fs.existsSync(path.join(distDir, cssMapFile))) {
        const newCssMapName = newCssName + '.map';
        fs.renameSync(path.join(distDir, cssMapFile), path.join(distDir, newCssMapName));
        console.log(`✅ Renombrado: ${cssMapFile} → ${newCssMapName}`);
      }
    }
    
    // Renombrar archivo JS
    if (jsFiles.length > 0) {
      const jsFile = jsFiles[0];
      const newJsName = 'cotizacion-unificado.js';
      const oldJsPath = path.join(distDir, jsFile);
      const newJsPath = path.join(distDir, newJsName);
      
      fs.renameSync(oldJsPath, newJsPath);
      console.log(`✅ Renombrado: ${jsFile} → ${newJsName}`);
      
      // Renombrar source map si existe
      const jsMapFile = jsFile + '.map';
      if (fs.existsSync(path.join(distDir, jsMapFile))) {
        const newJsMapName = newJsName + '.map';
        fs.renameSync(path.join(distDir, jsMapFile), path.join(distDir, newJsMapName));
        console.log(`✅ Renombrado: ${jsMapFile} → ${newJsMapName}`);
      }
    }
    
    console.log('\n🎉 Archivos renombrados exitosamente!');
    console.log('\nArchivos listos para Shopify:');
    console.log('- cotizacion-unificado.css');
    console.log('- cotizacion-unificado.js');
    
  } catch (error) {
    console.error('❌ Error al renombrar archivos:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  renameFiles();
}

module.exports = { renameFiles };

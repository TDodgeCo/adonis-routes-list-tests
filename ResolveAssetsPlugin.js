// const fs = require('fs');
// const path = require('path');
// const glob = require('glob');

// // Load the manifest.json file
// const manifestPath = path.resolve(__dirname, './public/assets/manifest.json');
// const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

// // Function to replace {{ asset('*') }} in a file's content
// function replaceAssetPlaceholders(content) {
//   return content.replace(/{{\s*asset\('(.+?)'\)\s*}}/g, (match, assetKey) => {
//     if (manifest[assetKey]) {
//       return manifest[assetKey];
//     }
//     console.warn(`Asset ${assetKey} not found in manifest.`);
//     return assetKey;
//   });
// }

// // Loop through every HTML file in './public/html/'
// const htmlFiles = glob.sync('./public/assets/html/**/*.html');
// htmlFiles.forEach((filePath) => {
//   let fileContent = fs.readFileSync(filePath, 'utf-8');
//   fileContent = replaceAssetPlaceholders(fileContent);
//   fs.writeFileSync(filePath, fileContent, 'utf-8');
// });

// module.exports = htmlFiles

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class ResolveAssetsPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('ResolveAssetsPlugin', (compilation, callback) => {
      // Load the manifest.json from the output assets
      const manifest = JSON.parse(compilation.assets['manifest.json'].source());

      function replaceAssetPlaceholders(content) {
        return content.replace(/{{\s*asset\('(.+?)'\)\s*}}/g, (match, assetKey) => {
          if (manifest[assetKey]) {
            return manifest[assetKey];
          }
          console.warn(`Asset ${assetKey} not found in manifest.`);
          return assetKey;
        });
      }

      // Loop through every HTML file in './public/html/'
      const htmlFiles = glob.sync('./public/html/**/*.html');
      htmlFiles.forEach((filePath) => {
        let fileContent = fs.readFileSync(filePath, 'utf-8');
        fileContent = replaceAssetPlaceholders(fileContent);
        fs.writeFileSync(filePath, fileContent, 'utf-8');
      });

      callback();
    });
  }
}

module.exports = ResolveAssetsPlugin;
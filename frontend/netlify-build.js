const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Log the Node.js version
console.log(`Using Node.js ${process.version}`);

// Install dependencies
console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

// Build the Angular app
console.log('Building Angular app...');
execSync('npx ng build --configuration production', { stdio: 'inherit' });

// Ensure _redirects file exists in the output directory
const redirectsPath = path.join(__dirname, 'dist', 'frontend', 'browser', '_redirects');
if (!fs.existsSync(redirectsPath)) {
  console.log('Creating _redirects file...');
  fs.writeFileSync(redirectsPath, '/* /index.html 200');
}

console.log('Build completed successfully!'); 
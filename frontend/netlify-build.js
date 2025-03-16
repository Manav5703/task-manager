const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Log the Node.js version
console.log(`Using Node.js ${process.version}`);

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Build the Angular app
  console.log('Building Angular app...');
  execSync('npx ng build --configuration production', { stdio: 'inherit' });

  // Ensure _redirects file exists in the output directory
  const outputDir = path.join(__dirname, 'dist', 'frontend', 'browser');
  const redirectsPath = path.join(outputDir, '_redirects');
  
  if (!fs.existsSync(redirectsPath)) {
    console.log('Creating _redirects file...');
    fs.writeFileSync(redirectsPath, '/* /index.html 200');
  }

  console.log('Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 
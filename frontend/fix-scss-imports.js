const fs = require('fs');
const path = require('path');
const glob = require('glob');

// First, fix the _fonts.scss file
console.log('Fixing _fonts.scss...');
const fontsPath = path.join(__dirname, 'src', '_fonts.scss');
if (fs.existsSync(fontsPath)) {
  let fontsContent = fs.readFileSync(fontsPath, 'utf8');
  fontsContent = fontsContent.replace(
    /@forward\s+['"]https:\/\/fonts.googleapis.com\/css2\?family=Inter:wght@400;500;600;700&display=swap['"]/g,
    '@import url(\'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap\')'
  );
  fontsContent = fontsContent.replace(
    /@forward\s+['"]https:\/\/fonts.googleapis.com\/css2\?family=DM\+Sans:wght@500;700&display=swap['"]/g,
    '@import url(\'https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;700&display=swap\')'
  );
  fs.writeFileSync(fontsPath, fontsContent);
  console.log('Fixed _fonts.scss');
}

// Fix main-styles.scss
console.log('Fixing main-styles.scss...');
const mainStylesPath = path.join(__dirname, 'src', 'main-styles.scss');
if (fs.existsSync(mainStylesPath)) {
  let mainStylesContent = fs.readFileSync(mainStylesPath, 'utf8');
  mainStylesContent = mainStylesContent.replace(/@use\s+['"]fonts['"]/g, '@import \'fonts\'');
  fs.writeFileSync(mainStylesPath, mainStylesContent);
  console.log('Fixed main-styles.scss');
}

// Find all SCSS files
const scssFiles = glob.sync('src/**/*.scss');

console.log(`Found ${scssFiles.length} SCSS files to process`);

scssFiles.forEach(file => {
  console.log(`Processing ${file}...`);
  
  // Read file content
  const content = fs.readFileSync(file, 'utf8');
  
  // Replace @use with @import for main-styles
  let newContent = content;
  
  // Fix main-styles imports
  newContent = newContent.replace(/@use\s+['"]\.\.\/\.\.\/\.\.\/main-styles['"]\s+as\s+\*/g, '@import \'../../../main-styles\'');
  newContent = newContent.replace(/@use\s+['"]\.\.\/\.\.\/main-styles['"]\s+as\s+\*/g, '@import \'../../main-styles\'');
  newContent = newContent.replace(/@use\s+['"]\.\.\/main-styles['"]\s+as\s+\*/g, '@import \'../main-styles\'');
  
  // Remove .scss extension if present (standardize)
  newContent = newContent.replace(/@import\s+['"]\.\.\/\.\.\/\.\.\/main-styles\.scss['"]/g, '@import \'../../../main-styles\'');
  newContent = newContent.replace(/@import\s+['"]\.\.\/\.\.\/main-styles\.scss['"]/g, '@import \'../../main-styles\'');
  newContent = newContent.replace(/@import\s+['"]\.\.\/main-styles\.scss['"]/g, '@import \'../main-styles\'');
  
  // Write back to file if changed
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
  }
});

console.log('SCSS import fixes completed!'); 
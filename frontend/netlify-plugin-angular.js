module.exports = {
  onPostBuild: async ({ constants, utils }) => {
    const fs = require('fs');
    const path = require('path');
    
    // Ensure _redirects file exists
    const redirectsPath = path.join(constants.PUBLISH_DIR, '_redirects');
    if (!fs.existsSync(redirectsPath)) {
      console.log('Creating _redirects file...');
      fs.writeFileSync(redirectsPath, '/* /index.html 200');
    }
    
    // Log success
    console.log('Angular build post-processing completed successfully!');
  }
}; 
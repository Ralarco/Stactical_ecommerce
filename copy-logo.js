const fs = require('fs');
const path = require('path');

try {
  const src = 'logoStactical.png';
  const dest = path.join('apps', 'web', 'public', 'logo.png');
  
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${src} to ${dest}`);
  } else {
    console.error(`Source file ${src} not found`);
  }
} catch (err) {
  console.error('Error copying file:', err);
}

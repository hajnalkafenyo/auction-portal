// Remove ./dist directory
const fs = require('fs');
const path = require('path');

const oldDistDir = path.resolve(__dirname, 'dist');
if (fs.existsSync(oldDistDir)) {
    fs.rmSync(oldDistDir, { recursive: true, force: true });
    console.log('Removed ./dist directory');
}

const { copyFiles } = require('./utils.js');

copyFiles(".", ".");
copyFiles("images", "images");
copyFiles("js", "js");
console.log('Build completed successfully!');

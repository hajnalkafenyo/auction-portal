// Remove ./dist directory
const fs = require('fs');
const path = require('path');

const oldDistDir = path.resolve(__dirname, 'dist');
if (fs.existsSync(oldDistDir)) {
    fs.rmSync(oldDistDir, { recursive: true, force: true });
    console.log('Removed ./dist directory');
}

// Create the dist directory again
fs.mkdirSync(oldDistDir, { recursive: true });
console.log('Created ./dist directory');

// Copy all the js and html files from src to dist
const copyExtensions = ['.js', '.html'];
const srcDir = path.resolve(__dirname, 'src');
const distDir = path.resolve(__dirname, 'dist');
const files = fs.readdirSync(srcDir);

files.forEach(file => {
    const ext = path.extname(file);
    if (copyExtensions.includes(ext)) {
        const srcFile = path.join(srcDir, file);
        const distFile = path.join(distDir, file);
        fs.copyFileSync(srcFile, distFile);
        console.log(`Copied ${file} to ./dist`);
    }
});

const { copyFiles } = require('./utils.js');
copyFiles(srcDir, distDir);
console.log('Build completed successfully!');

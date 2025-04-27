
const fs = require('fs');
const path = require('path');

function copyFiles(srcDir, distDir) {
    const imagesDir = path.join(distDir, 'images');
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
        console.log('Created ./dist/images directory');
    }
    // Copy all images from ./images to dist/images
    const imagesSrcDir = path.resolve(srcDir, 'images');
    const imagesFiles = fs.readdirSync(imagesSrcDir);
    imagesFiles.forEach(file => {
        const srcFile = path.join(imagesSrcDir, file);
        const distFile = path.join(imagesDir, file);
        fs.copyFileSync(srcFile, distFile);
        console.log(`Copied ${file} to ./dist/images`);
    });
}
module.exports = { copyFiles };
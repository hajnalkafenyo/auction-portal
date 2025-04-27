
const fs = require('fs');
const path = require('path');

function copyFiles(from, to) {
    const distDir = path.resolve(__dirname, 'dist');
    const srcDir = path.resolve(__dirname, 'src');

    const toDir = path.join(distDir, to);
    if (!fs.existsSync(toDir)) {
        fs.mkdirSync(toDir, { recursive: true });
    }

    const fromDir = path.resolve(srcDir, from);
    const files = fs.readdirSync(fromDir, { recursive: false });
    files.forEach(file => {
        const srcFile = path.join(fromDir, file);
        if (fs.lstatSync(srcFile).isDirectory()) {
            return; // Skip directories
        }
        const distFile = path.join(toDir, file);
        fs.copyFileSync(srcFile, distFile);
    });
}
module.exports = { copyFiles };
const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err.message);
    return;
  }

  function processFile(index) {
    if (index >= files.length) {
      return;
    }

    const file = files[index];
    if (!file.isFile()) {
      processFile(index + 1);
      return;
    }

    const fullName = file.name;
    const endIndex = fullName.indexOf('.');
    const fileName = fullName.slice(0, endIndex);
    const fileExt = path.extname(fullName).slice(1);

    fs.stat(path.join(dirPath, fullName), (err, stats) => {
      if (err) {
        console.log(err.message);
        processFile(index + 1);
        return;
      }
      const fileSize = stats.size;
      console.log(`${fileName} - ${fileExt} - ${fileSize}B`);
      processFile(index + 1);
    });
  }

  processFile(0);
});

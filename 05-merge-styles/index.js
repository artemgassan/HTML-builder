const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function bundle(from, to) {
  const stylesPath = await fs.promises.readdir(from, {
    withFileTypes: true,
  });

  const outputStream = fs.createWriteStream(to);

  for (let file of stylesPath) {
    if (path.extname(file.name) === '.css' && file.isFile()) {
      let bundle = [];
      const input = fs.createReadStream(path.join(from, file.name));

      input.on('data', (part) => {
        bundle.push(part);
      });

      input.on('end', () => {
        for (let part of bundle) {
          outputStream.write(part);
        }
      });
    }
  }
}

bundle(stylesPath, bundlePath);

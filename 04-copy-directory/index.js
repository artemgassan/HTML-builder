const fs = require('fs').promises;
const path = require('path');

const sourcePath = path.resolve(__dirname, 'files');
const copiedPath = path.resolve(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fs.mkdir(copiedPath, { recursive: true });
    await deleteFiles(copiedPath);
    await copyFiles(sourcePath, copiedPath);
  } catch (error) {
    console.log(error);
  }
}

async function deleteFiles(distPath) {
  try {
    const items = await fs.readdir(distPath);
    await Promise.all(
      items.map(async (item) => {
        const copiedFilePath = path.join(distPath, item);
        await fs.unlink(copiedFilePath);
      }),
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function copyFiles(srcPath, distPath) {
  try {
    const items = await fs.readdir(srcPath, { withFileTypes: true });
    await Promise.all(
      items.map(async (item) => {
        if (item.isFile()) {
          const srcFilePath = path.join(srcPath, item.name);
          const copiedFilePath = path.join(distPath, item.name);
          await fs.copyFile(srcFilePath, copiedFilePath);
        }
      }),
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}

copyDir();

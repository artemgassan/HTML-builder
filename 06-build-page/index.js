const fs = require('fs').promises;
const path = require('path');

const assetsPath = path.resolve(__dirname, 'assets');
// const componentsPath = path.resolve(__dirname, 'components');
// const stylesPath = path.resolve(__dirname, 'styles');
// const testFilesPath = path.resolve(__dirname, 'test-files');
const projectDistPath = path.resolve(__dirname, 'project-dist');
const assetsDistPath = path.resolve(__dirname, 'project-dist', 'assets');

async function copyDir() {
  try {
    await fs.mkdir(projectDistPath, { recursive: true });
    await deleteFiles(projectDistPath);
    await fs.mkdir(assetsDistPath, { recursive: true });
    await copyFiles(assetsPath, assetsDistPath);
  } catch (error) {
    console.log(error.message);
  }
}

async function deleteFiles(distPath) {
  try {
    const items = await fs.readdir(distPath, { withFileTypes: true });
    await Promise.all(
      items.map(async (item) => {
        const itemPath = path.join(distPath, item.name);
        if (item.isDirectory()) {
          await deleteFiles(itemPath);
          await fs.rmdir(itemPath);
        } else {
          await fs.unlink(itemPath);
        }
      }),
    );
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

async function copyFiles(srcPath, distPath) {
  try {
    const items = await fs.readdir(srcPath, { withFileTypes: true });
    await Promise.all(
      items.map(async (item) => {
        const srcItemPath = path.join(srcPath, item.name);
        const distItemPath = path.join(distPath, item.name);
        if (item.isDirectory()) {
          await fs.mkdir(distItemPath, { recursive: true });
          await copyFiles(srcItemPath, distItemPath);
        } else {
          await fs.copyFile(srcItemPath, distItemPath);
        }
      }),
    );
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

copyDir();

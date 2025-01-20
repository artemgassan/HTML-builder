const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const assetsPath = path.resolve(__dirname, 'assets');
const componentsPath = path.resolve(__dirname, 'components');
const stylesPath = path.resolve(__dirname, 'styles');
const projectDistPath = path.resolve(__dirname, 'project-dist');
const assetsDistPath = path.resolve(__dirname, 'project-dist', 'assets');
const templatePath = path.resolve(__dirname, 'template.html');
const bundleHTMLPath = path.resolve(projectDistPath, 'index.html');

async function copyDir() {
  try {
    await fsp.mkdir(projectDistPath, { recursive: true });
    await deleteFiles(projectDistPath);
    await fsp.mkdir(assetsDistPath, { recursive: true });
    await copyFiles(assetsPath, assetsDistPath);
  } catch (error) {
    console.log(error.message);
  }
}

async function deleteFiles(distPath) {
  try {
    const items = await fsp.readdir(distPath, { withFileTypes: true });
    await Promise.all(
      items.map(async (item) => {
        const itemPath = path.join(distPath, item.name);
        if (item.isDirectory()) {
          await deleteFiles(itemPath);
          await fsp.rmdir(itemPath);
        } else {
          await fsp.unlink(itemPath);
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
    const items = await fsp.readdir(srcPath, { withFileTypes: true });
    await Promise.all(
      items.map(async (item) => {
        const srcItemPath = path.join(srcPath, item.name);
        const distItemPath = path.join(distPath, item.name);
        if (item.isDirectory()) {
          await fsp.mkdir(distItemPath, { recursive: true });
          await copyFiles(srcItemPath, distItemPath);
        } else {
          await fsp.copyFile(srcItemPath, distItemPath);
        }
      }),
    );
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

async function bundle(from, to) {
  try {
    const styleFiles = await fsp.readdir(from, {
      withFileTypes: true,
    });

    const outputStream = fs.createWriteStream(path.join(to, 'style.css'));

    for (const file of styleFiles) {
      if (path.extname(file.name) === '.css' && file.isFile()) {
        const filePath = path.join(from, file.name);
        const bundle = await fsp.readFile(filePath, 'utf-8');
        outputStream.write(bundle + '\n');
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function generateHTML(templatePath, componentsPath, bundlePath) {
  try {
    const templateContent = await fsp.readFile(templatePath, 'utf-8');
    let resultContent = templateContent;
    const matches = templateContent.match(/{{\s*[\w-]+\s*}}/g);

    if (matches) {
      for (const match of matches) {
        const componentName = match.replace(/{{\s*|\s*}}/g, '').trim();
        const componentPath = path.join(
          componentsPath,
          `${componentName}.html`,
        );

        try {
          const componentContent = await fsp.readFile(componentPath, 'utf-8');
          resultContent = resultContent.replace(match, componentContent);
        } catch (error) {
          console.log(error.message);
        }
      }
    }

    await fsp.writeFile(bundlePath, resultContent, 'utf-8');
  } catch (error) {
    console.log(error.message);
  }
}

(async function buildProject() {
  await copyDir();
  await bundle(stylesPath, projectDistPath);
  await generateHTML(templatePath, componentsPath, bundleHTMLPath);
})();

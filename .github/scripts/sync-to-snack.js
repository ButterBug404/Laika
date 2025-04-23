const fs = require('fs');
const path = require('path');
const { Snack } = require('snack-sdk');

const APP_DIRECTORY = process.env.APP_DIRECTORY || 'app';
const SNACK_ID = process.env.SNACK_ID || null;
const SNACK_NAME = process.env.SNACK_NAME || 'CLI Synced Snack';

async function syncToSnack() {
  try {
    console.log('Starting sync to Snack.dev...');

    const appFiles = {};
    await readFilesRecursively(APP_DIRECTORY, appFiles);
		console.log('Files to sync:', Object.keys(appFiles));

    const snack = new Snack({
      files: appFiles,
      name: SNACK_NAME,
      sdkVersion: '49.0.0',
      id: SNACK_ID,
			user: {
				accessToken: process.env.EXPO_ACCESS_TOKEN,
			}
    });

		const result = await snack.saveAsync();

    console.log('Snack uploaded successfully!');
    console.log(`Snack URL: ${result.url}`);
  } catch (err) {
    console.error('Failed to sync to Snack:', err.message);
    process.exit(1);
  }
}

async function readFilesRecursively(dir, files = {}, baseDir = '') {
  const entries = fs.readdirSync(path.join(baseDir, dir), { withFileTypes: true });

  for (const entry of entries) {
    const relativePath = path.join(dir, entry.name);
    const fullPath = path.join(baseDir, relativePath);

    if (entry.isDirectory()) {
      if (!['node_modules', '.git', '.github', 'build', 'dist'].includes(entry.name)) {
        await readFilesRecursively(relativePath, files, baseDir);
      }
    } else {
      const contents = fs.readFileSync(fullPath, 'utf8');
      const fileKey = relativePath.replace(`${APP_DIRECTORY}/`, '');
      files[fileKey] = {
        type: getFileType(entry.name),
        contents,
      };
    }
  }

  return files;
}

function getFileType(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext) ? 'ASSET' : 'CODE';
}

syncToSnack();


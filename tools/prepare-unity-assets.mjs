import { promises as fs } from 'node:fs';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';

const rootDir = process.cwd();

const assets = [
  {
    source: 'public/content/projects/dotrun/play/webgl/Release/webgl.jsgz',
    target: 'public/content/projects/dotrun/play/webgl/Release/webgl.js',
  },
  {
    source: 'public/content/projects/dotrun/play/webgl/Release/webgl.datagz',
    target: 'public/content/projects/dotrun/play/webgl/Release/webgl.data',
  },
  {
    source: 'public/content/projects/dotrun/play/webgl/Release/webgl.memgz',
    target: 'public/content/projects/dotrun/play/webgl/Release/webgl.mem',
  },
  {
    source: 'public/content/projects/asteroids-3d/play/release1.5/Release/release1.5.jsgz',
    target: 'public/content/projects/asteroids-3d/play/release1.5/Release/release1.5.js',
  },
  {
    source: 'public/content/projects/asteroids-3d/play/release1.5/Release/release1.5.datagz',
    target: 'public/content/projects/asteroids-3d/play/release1.5/Release/release1.5.data',
  },
  {
    source: 'public/content/projects/asteroids-3d/play/release1.5/Release/release1.5.memgz',
    target: 'public/content/projects/asteroids-3d/play/release1.5/Release/release1.5.mem',
  },
];

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function isFresh(sourcePath, targetPath) {
  if (!(await exists(targetPath))) return false;
  const [sourceStat, targetStat] = await Promise.all([fs.stat(sourcePath), fs.stat(targetPath)]);
  return targetStat.mtimeMs >= sourceStat.mtimeMs;
}

async function main() {
  let generated = 0;

  for (const asset of assets) {
    const sourcePath = path.join(rootDir, asset.source);
    const targetPath = path.join(rootDir, asset.target);

    if (!(await exists(sourcePath))) {
      console.warn(`Unity asset ausente: ${asset.source}`);
      continue;
    }

    if (await isFresh(sourcePath, targetPath)) continue;

    const uncompressed = gunzipSync(await fs.readFile(sourcePath));
    await fs.writeFile(targetPath, uncompressed);
    generated += 1;
  }

  console.log(generated ? `Unity assets gerados: ${generated}` : 'Unity assets atualizados');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

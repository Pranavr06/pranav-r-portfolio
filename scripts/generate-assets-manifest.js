const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'public', 'assets');

if (!fs.existsSync(dir)) {
  console.log('public/assets not found, skipping manifest generation.');
  process.exit(0);
}

const files = fs.readdirSync(dir);

const imageExts = new Set(['.webp', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.avif']);
const videoExts = new Set(['.mp4', '.webm']);

const assets = files
  .filter((f) => !f.startsWith('.'))
  .map((name) => {
    const ext = path.extname(name).toLowerCase();
    const lower = name.toLowerCase();

    let type = 'other';
    if (imageExts.has(ext)) type = 'image';
    else if (ext === '.pdf') type = 'pdf';
    else if (videoExts.has(ext)) type = 'video';

    const isLogo = lower.includes('logo') || lower.includes('icon') || lower.startsWith('client-');
    const isCertificate = lower.includes('certificate') || lower.includes('cert') || ext === '.pdf';

    return {
      name,
      path: '/assets/' + name,
      ext,
      type,
      isLogo,
      isCertificate,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

const logos = assets.filter((a) => a.isLogo || (a.type === 'image' && a.name.toLowerCase().includes('logo')));
const documents = assets.filter((a) => a.type === 'pdf' || a.isCertificate);
const images = assets.filter((a) => a.type === 'image');

const manifest = { assets, logos, documents, images, total: assets.length };

const libDir = path.join(process.cwd(), 'lib');
if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true });

fs.writeFileSync(path.join(libDir, 'assetsManifest.json'), JSON.stringify(manifest));
console.log(`[assets-manifest] Generated lib/assetsManifest.json with ${assets.length} assets.`);

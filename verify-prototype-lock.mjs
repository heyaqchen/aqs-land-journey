import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const read = file => fs.readFileSync(path.join(root, file), 'utf8').replaceAll('\r\n', '\n');
const hash = value => createHash('sha256').update(value).digest('hex');
const baseline = JSON.parse(read('prototype-lock.json'));
const fragments = {
  phoneFrame: text => text.match(/<iframe id="prototype-frame"[^>]*><\/iframe>/)?.[0],
  tourScript: text => text.match(/<script src="prototype-tour\.js[^>]*><\/script>/)?.[0],
  tourStyles: text => {
    const start = text.indexOf('.prototype-tour{padding:115px');
    const end = text.indexOf('.prototype-tour{padding-bottom:', start);
    return start >= 0 && end > start ? text.slice(start, end) : undefined;
  },
  desktopPhone: text => text.match(/@media\(min-width:761px\)\{\.prototype-tour \.iphone-shell\{[^\n]+/)?.[0]
};
const failed = [];
for (const [file, expected] of Object.entries(baseline.files)) {
  if (hash(read(file)) !== expected) failed.push(file);
}
for (const [name, entry] of Object.entries(baseline.fragments)) {
  const content = fragments[name](read(entry.file));
  if (!content || hash(content) !== entry.sha256) failed.push(`${entry.file} (${name})`);
}
if (failed.length) {
  console.error('Protected prototype changes detected:\n' + failed.join('\n'));
  process.exitCode = 1;
} else console.log('Protected phone layouts and guided interactions are unchanged.');

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import { JSDOM } from 'jsdom';

const width = 1200;
const height = 630;
const font = 'Website Inter';
if (!GlobalFonts.registerFromPath(fileURLToPath(new URL('./fonts/Inter.ttf', import.meta.url)), font)) {
    throw new Error('Could not load the bundled Inter font for article cards');
}

function wrap(context, text, maxWidth) {
    const lines = [];
    let line = '';
    for (const word of text.trim().split(/\s+/)) {
        if (context.measureText(word).width > maxWidth) return null;
        const candidate = line ? `${line} ${word}` : word;
        if (context.measureText(candidate).width > maxWidth) {
            lines.push(line);
            line = word;
        } else line = candidate;
    }
    if (line) lines.push(line);
    return lines;
}

export function renderCard({ title, topic = 'Notes and essays', date, author, hostname }) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    context.fillStyle = '#f7f4ec';
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#306b99';
    context.fillRect(0, 0, 12, height);

    context.textBaseline = 'top';
    context.fillStyle = '#306b99';
    context.font = `700 22px "${font}"`;
    context.fillText('NOTES & ESSAYS', 72, 60);
    context.textAlign = 'right';
    context.fillStyle = '#566774';
    context.font = `500 20px "${font}"`;
    context.fillText(date, width - 72, 62);
    context.textAlign = 'left';
    context.strokeStyle = '#d9d4c9';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(72, 118);
    context.lineTo(width - 72, 118);
    context.stroke();

    context.fillStyle = '#a15a3a';
    context.font = `600 21px "${font}"`;
    context.fillText(topic.toUpperCase(), 72, 151, width - 144);

    let layout;
    for (let size = 62; size >= 30; size -= 2) {
        context.font = `700 ${size}px "${font}"`;
        const lines = wrap(context, title, width - 144);
        const lineHeight = Math.ceil(size * 1.18);
        if (lines && lines.length * lineHeight <= 276) {
            layout = { lines, size, lineHeight };
            break;
        }
    }
    if (!layout) throw new Error(`Article title does not fit the sharing card: ${title}`);
    context.fillStyle = '#17324d';
    layout.lines.forEach((line, index) => context.fillText(line, 72, 204 + index * layout.lineHeight));

    context.strokeStyle = '#d9d4c9';
    context.beginPath();
    context.moveTo(72, 508);
    context.lineTo(width - 72, 508);
    context.stroke();
    context.fillStyle = '#17324d';
    context.font = `600 25px "${font}"`;
    context.fillText(author, 72, 537, 850);
    context.fillStyle = '#566774';
    context.font = `400 20px "${font}"`;
    context.fillText(hostname, 72, 576, 850);
    context.fillStyle = '#17324d';
    context.fillRect(1056, 536, 72, 64);
    context.fillStyle = '#fffdfa';
    context.font = `700 28px "${font}"`;
    context.textAlign = 'center';
    context.fillText('AT', 1092, 551);

    return { png: canvas.toBuffer('image/png'), layout };
}

async function htmlFiles(directory) {
    const result = [];
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
        const filename = path.join(directory, entry.name);
        if (entry.isDirectory()) result.push(...await htmlFiles(filename));
        else if (filename.endsWith('.html')) result.push(filename);
    }
    return result.sort();
}

export async function generateSocialImages(directory) {
    const root = path.resolve(directory);
    let generated = 0;
    for (const filename of await htmlFiles(root)) {
        const dom = new JSDOM(await fs.readFile(filename, 'utf8'));
        try {
            const document = dom.window.document;
            if (!document.querySelector('.post-article')) continue;
            const canonical = new URL(document.querySelector('link[rel="canonical"]').href);
            const image = new URL(document.querySelector('meta[property="og:image"]').content);
            // An explicitly chosen image takes precedence over the generated card.
            const expected = `/assets/images/social${canonical.pathname}card.png`;
            if (image.origin !== canonical.origin || image.pathname !== expected) continue;
            const target = path.resolve(root, `.${decodeURIComponent(image.pathname)}`);
            if (!target.startsWith(path.join(root, 'assets/images/social') + path.sep)) {
                throw new Error(`Invalid sharing image path: ${image.pathname}`);
            }
            const time = document.querySelector('.post-meta-top time');
            const date = new Intl.DateTimeFormat('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Shanghai'
            }).format(new Date(time.dateTime)).toUpperCase();
            const { png } = renderCard({
                title: document.querySelector('.post-title').textContent,
                topic: document.querySelector('.post-topic-list li')?.textContent || 'Notes and essays',
                date,
                author: document.querySelector('meta[name="author"]').content,
                hostname: canonical.hostname
            });
            await fs.mkdir(path.dirname(target), { recursive: true });
            await fs.writeFile(target, png);
            generated++;
        } finally {
            dom.window.close();
        }
    }
    return generated;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
    try {
        const generated = await generateSocialImages(process.argv[2] || '_site');
        console.log(`Generated ${generated} article sharing images (1200 × 630 PNG).`);
    } catch (error) {
        console.error(`Sharing-image generation failed: ${error.message}`);
        process.exitCode = 1;
    }
}

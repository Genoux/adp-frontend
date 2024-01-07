// pages/api/listImages.js
import fs from 'fs';
import path from 'path';
import util from 'util';

const readdir = util.promisify(fs.readdir);

export default async function handler(req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string | null, imageUrls: string[] }): void; new(): any; }; }; }) {
  const imagesDirectory = path.join(process.cwd(), 'public/images/champions/splash');
  console.log("handler - imagesDirectory:", imagesDirectory);

  try {
    const files = await readdir(imagesDirectory);
    console.log("handler - files:", files);
    const imageUrls = files.map(file => `/images/champions/splash/${file}`);
    res.status(200).json({ error: null, imageUrls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error reading images directory', imageUrls: [] });
  }
}

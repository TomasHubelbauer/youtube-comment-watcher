import fs from 'fs';
import run from './index.js';

void async function () {
  const text = await fs.promises.readFile('test.code', { encoding: 'utf-8' });
  const codes = text.split(/\n/g).filter(line => line).map(line => line.trim());
  for (const code of codes) {
    console.log('Scraping', code);
    const result = await run(code);
    await fs.promises.writeFile(`data-${code}.json`, JSON.stringify(result, null, 2), { encoding: 'utf-8' });
    console.log('Scraped', code);
  }
}()

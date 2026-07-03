import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import epubGen from 'epub-gen-memory';
const epub = (epubGen as any).default ?? epubGen;

(async () => {
      const browser = await chromium.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto('ENTER URL HERE');
      const chapter = page.locator('div.chapter-formatting');
      await chapter.waitFor();
      const text = await chapter.innerText();

      const html = text
            .split('\n')
            .filter(line => line.trim() !== '')
            .map(line => `<p>${line}</p>`)
            .join('');

      const book = await epub(
            { title: 'My Book', author: 'Unknown' },
            [{ title: 'Chapter 1', content: html }]
      );

      writeFileSync('book.epub', book);
      console.log('Done — book.epub written');

      await browser.close();
})();
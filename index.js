import puppeteer from 'puppeteer';

export default async function watchYouTubeComments(/** @type {string} */ videoCode) {
  const headless = true;
  const browser = await puppeteer.launch({ headless });
  const [page] = await browser.pages();
  await page.goto('https://youtube.com/watch?v=' + videoCode);
  await page.waitForSelector('ytd-comments');
  await page.waitForFunction(() => document.querySelector('ytd-comments').getBoundingClientRect().top > 0);
  await page.evaluate(() => document.querySelector('ytd-comments').scrollIntoView());
  await page.waitForSelector('ytd-comments-header-renderer');
  const result = {};
  result.title = await page.evaluate(() => document.title);
  const count = await page.evaluate(() => document.querySelector('ytd-comments-header-renderer #count').textContent.trim());
  result.count = count;
  result.comments = [];
  const threads = await page.$$('ytd-comment-thread-renderer');
  for (const thread of threads) {
    const comment = await thread.$('ytd-comment-renderer');
    const author = await comment.$eval('#author-text', div => div.textContent.trim());
    const content = await comment.$eval('#content-text', div => div.textContent.trim());
    const date = await comment.$eval('.published-time-text', div => div.textContent.trim());
    const link = await comment.$eval('.published-time-text a', a => a.getAttribute('href'));
    const heart = await comment.$eval('ytd-creator-heart-renderer', div => div.textContent.trim());
    const item = { author, content, date, link, heart, replies: [] };
    const button = await thread.$('ytd-button-renderer#more-replies');
    if (button) {
      await button.click();
      const element = await thread.$('ytd-comment-replies-renderer #expander-contents');
      await page.waitForFunction(element => element.querySelectorAll('ytd-comment-renderer').length, undefined, element)
      const replies = await element.$$('ytd-comment-renderer');
      for (const reply of replies) {
        const author = await reply.$eval('#author-text', div => div.textContent.trim());
        const content = await reply.$eval('#content-text', div => div.textContent.trim());
        const date = await reply.$eval('.published-time-text', div => div.textContent.trim());
        const link = await reply.$eval('.published-time-text a', a => a.getAttribute('href'));
        item.replies.push({ author, content, date, link });
      }
    }

    result.comments.push(item);
  }

  await browser.close();
  return result;
}

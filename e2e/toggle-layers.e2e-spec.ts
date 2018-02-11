import { browser, element, by, ExpectedConditions as EC } from 'protractor';
const PixelDiff = require('pixel-diff');
const browserLogs = require('protractor-browser-logs');

describe('Toggle layers', () => {
  let logs: any;

  beforeEach(() => {
    logs = browserLogs(browser);
    logs.ignore(/vector tile spec v2/i);
  });

  afterEach(() => {
    return logs.verify();
  });

  it('should toggle layers', async () => {
    await browser.get('/toggle-layers');
    const elm = element(by.tagName('canvas'));
    await browser.wait(EC.presenceOf(elm), 2000);
    const buttons = element.all(by.tagName('mat-button-toggle'));
    await browser.sleep(8000);
    const screen1 = await browser.takeScreenshot();
    await buttons.get(0).click();
    await browser.sleep(4000);
    const screen2 = await browser.takeScreenshot();
    const result = new PixelDiff({
      imageA: new Buffer(screen1, 'base64'),
      imageB: new Buffer(screen2, 'base64')
    }).runSync();
    expect(result.differences).toBeGreaterThan(0);
    await buttons.get(0).click();
    await browser.sleep(4000);
    const screen1bis = await browser.takeScreenshot();
    const result2 = new PixelDiff({
      imageA: new Buffer(screen1, 'base64'),
      imageB: new Buffer(screen1bis, 'base64')
    }).runSync();
    expect(result2.differences).toBe(0);
  });
});

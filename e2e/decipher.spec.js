const { test, expect } = require('@playwright/test');
const striptags = require('striptags');

test('decipher test', async ({ page }) => {
  await page.goto('https://kodaktor.ru/g/_72ef40a/eb498');

  const elementHandle = await page.$('form');
  await elementHandle.evaluate(node => node.setAttribute('action', "https://decrypt-app.herokuapp.com"));
  await page.setInputFiles('input[name=key]', 'id_rsa2');
  await page.setInputFiles('input[name=secret]', 'secret2');
  await page.locator('[type=submit]').click();

  await page.waitForSelector("iframe");
  const responseHandle = await page.$("[name=ifr]");
  const frame = await responseHandle.contentFrame();

  await frame.waitForSelector("text=/^(?!\s*$).+/");
  const frameInnerContent = await frame.$eval("body", node => node.innerHTML);
  const cleanFrameInnerContent = striptags(frameInnerContent); 
  console.log(cleanFrameInnerContent);
  expect(cleanFrameInnerContent.trim()).toBe("matrix");
});
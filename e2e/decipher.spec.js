const { test, expect } = require("@playwright/test");
const striptags = require("striptags");

test("decipher test", async ({ page }) => {

  if ([process.env.TEST_HOST, process.env.KEY_FILE, process.env.SECRET_FILE, process.env.EXPECTED].some(el => el === undefined)) {
    console.error("Not all the required environment variables were defined. Please set up an .env file with listed variables: TEST_HOST (decipher server), KEY_FILE, SECRET_FILE, EXPECTED (expected output value)");
    throw("Not all the required environment variables were defined");
  }
  await page.goto("https://kodaktor.ru/g/_72ef40a/eb498");

  const elementHandle = await page.$("form");
  const host = process.env.TEST_HOST;
  await elementHandle.evaluate((node, [host]) => node.setAttribute("action", host), [host]);
  await page.setInputFiles("input[name=key]", process.env.KEY_FILE);
  await page.setInputFiles("input[name=secret]", process.env.SECRET_FILE);
  await page.locator("[type=submit]").click();

  await page.waitForSelector("iframe");
  const responseHandle = await page.$("[name=ifr]");
  const frame = await responseHandle.contentFrame();

  await frame.waitForSelector("text=/^(?!\s*$).+/");
  const frameInnerContent = await frame.$eval("body", node => node.innerHTML);
  const cleanFrameInnerContent = striptags(frameInnerContent); 
  console.log(cleanFrameInnerContent);
  expect(cleanFrameInnerContent.trim()).toBe(process.env.EXPECTED);
});
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { chromium } from 'playwright-core';
import { preview } from 'vite';

let server;
let browser;
let url;

before(async () => {
  server = await preview({
    configFile: false,
    preview: { host: '127.0.0.1', port: 0 },
  });
  url = server.resolvedUrls.local[0];
  browser = await chromium.launch({ channel: 'chrome' });
});

after(async () => {
  try {
    await browser?.close();
  } finally {
    await server?.close();
  }
});

async function openPage(t, width) {
  const page = await browser.newPage({ viewport: { width, height: 844 } });
  t.after(() => page.close());
  await page.goto(url);
  // Tabs become available when React has hydrated the static portfolio.
  await page.getByRole('tab', { name: 'Data', exact: true }).waitFor();
  return page;
}

void test('mobile menu closes on focus exit, Escape and outside press', async (t) => {
  const page = await openPage(t, 390);
  const menu = page.locator('.mobile-menu');
  const toggle = menu.locator('summary');
  const firstLink = menu.getByRole('link', { name: 'Expertises' });
  const lastLink = menu.getByRole('link', { name: 'Contact' });
  const isOpen = () => menu.evaluate((element) => element.open);

  await toggle.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  assert(
    await firstLink.evaluate((element) => document.activeElement === element),
  );
  await page.keyboard.press('Escape');
  assert.equal(await isOpen(), false);
  assert(
    await toggle.evaluate((element) => document.activeElement === element),
  );

  await page.keyboard.press('Enter');
  await lastLink.focus();
  await page.keyboard.press('Tab');
  assert.equal(await isOpen(), false);
  assert.equal(
    await menu.evaluate((element) => element.contains(document.activeElement)),
    false,
  );

  await toggle.click();
  assert.equal(await isOpen(), true);
  await page.mouse.click(5, 600);
  assert.equal(await isOpen(), false);
});

void test('the active panel has a visible outline when reached by Tab', async (t) => {
  const page = await openPage(t, 1440);
  const tab = page.getByRole('tab', { name: 'BI', exact: true });
  await tab.click();
  const panel = page.getByRole('tabpanel', { name: 'BI', exact: true });
  await panel.waitFor();
  const focused = () =>
    panel.evaluate((element) => document.activeElement === element);
  for (let i = 0; i < 3 && !(await focused()); i++) {
    await page.keyboard.press('Tab');
  }
  assert(await focused(), 'Tab should move into the active panel');
  const outline = await panel.evaluate((element) => {
    const { outlineStyle, outlineWidth, outlineColor } =
      getComputedStyle(element);
    return { outlineStyle, outlineWidth, outlineColor };
  });
  assert.equal(outline.outlineStyle, 'solid');
  assert(parseFloat(outline.outlineWidth) >= 2);
  assert.notEqual(outline.outlineColor, 'rgba(0, 0, 0, 0)');
});

void test('scroll reveals the header proportionally and JL returns to the top', async (t) => {
  const page = await openPage(t, 390);
  const header = page.getByRole('banner');
  async function expectVisibleHeight(pixels) {
    await page.waitForFunction((height) => {
      const bottom = document
        .querySelector('header')
        .getBoundingClientRect().bottom;
      return Math.abs(bottom - height) < 1;
    }, pixels);
  }
  // Keep native scroll events, and drive exact distances independently of the mouse wheel hardware.
  const scrollBy = (pixels) =>
    page.evaluate(
      (top) => window.scrollBy({ top, behavior: 'instant' }),
      pixels,
    );
  const height = await header.evaluate((element) => element.offsetHeight);
  await scrollBy(850);
  await expectVisibleHeight(0);
  await scrollBy(-32);
  await expectVisibleHeight(32);
  await scrollBy(12);
  await expectVisibleHeight(20);
  await scrollBy(-height);
  await expectVisibleHeight(height);
  await header
    .getByRole('link', { name: 'Jordan Lacroix, retour en haut' })
    .click();
  await page.waitForFunction(
    () => window.scrollY === 0 && location.hash === '#haut',
  );
  await expectVisibleHeight(height);
});

void test('without JavaScript each discipline opens and exposes three readable points', async (t) => {
  const page = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  t.after(() => page.close());
  await page.goto(url);
  assert.equal(await page.getByRole('button', { name: /pause/i }).count(), 0);

  const disclosures = page.locator('details[name="disciplines"]');
  // Data is initially open. Switch away and back to exercise each native disclosure.
  for (const name of [
    /Business Intelligence/,
    /Protection des données/,
    /Data management/,
  ]) {
    const details = disclosures.filter({
      has: page.getByRole('heading', { name, level: 2 }),
    });
    await details.locator('summary').click();
    assert(await details.evaluate((element) => element.open));
    assert.equal(
      await page.locator('details[name="disciplines"][open]').count(),
      1,
    );
    const points = await details.getByRole('listitem').all();
    assert.equal(points.length, 3);
    for (const point of points) {
      assert(await point.isVisible());
      assert((await point.locator('p').innerText()).trim().length > 0);
    }
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8').catch(() => '');

test('define a identidade visual e os layouts principais', () => {
  for (const token of [
    '--color-forest',
    '--color-leaf',
    '--color-cream',
    '--color-earth',
    '--font-display',
    '--font-body',
  ]) {
    assert.match(css, new RegExp(token));
  }

  assert.match(css, /\.hero-grid/);
  assert.match(css, /\.solutions-grid/);
  assert.match(css, /\.partners-grid/);
});

test('preserva navegação por teclado e movimento reduzido', () => {
  assert.match(css, /@media\s*\(min-width:\s*48rem\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
});

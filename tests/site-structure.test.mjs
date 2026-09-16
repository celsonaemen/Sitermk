import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('carrega os recursos locais da nova interface', () => {
  assert.match(html, /href="styles\.css"/);
  assert.match(html, /src="script\.js"/);
  assert.doesNotMatch(html, /lucide@latest/);
});

test('expõe a jornada comercial completa', () => {
  for (const id of ['inicio', 'solucoes', 'como-funciona', 'parceiros', 'sobre', 'contato']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }

  assert.match(html, /id="quote-form"/);
  assert.match(html, /name="nome"/);
  assert.match(html, /name="telefone"/);
  assert.match(html, /name="cidade"/);
  assert.match(html, /name="cultura"/);
  assert.match(html, /name="necessidade"/);
});

test('protege todos os links que abrem uma nova aba', () => {
  const externalLinks = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map(
    (match) => match[0],
  );

  assert.ok(externalLinks.length > 0);
  for (const anchor of externalLinks) {
    assert.match(anchor, /rel="noopener noreferrer"/);
  }
});

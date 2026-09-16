import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

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

test('oferece metadados suficientes para busca e compartilhamento', () => {
  assert.match(html, /<meta\s+name="description"/);
  assert.match(html, /<meta\s+property="og:title"/);
  assert.match(html, /<meta\s+property="og:description"/);
  assert.match(html, /<meta\s+name="theme-color"/);
  assert.match(html, /type="application\/ld\+json"/);
});

test('mantém uma hierarquia acessível e sem código visual inline', () => {
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /aria-live="polite"/);
  assert.doesNotMatch(html, /<style\b/);
  assert.doesNotMatch(html, /\sstyle="/);

  const scripts = [...html.matchAll(/<script\b[^>]*>/g)].map((match) => match[0]);
  for (const script of scripts) {
    assert.match(script, /src=|type="application\/ld\+json"/);
  }
});

test('todas as imagens declaram alternativa e dimensões', () => {
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
  assert.ok(images.length > 0);

  for (const image of images) {
    assert.match(image, /alt="[^"]*"/);
    assert.match(image, /width="\d+"/);
    assert.match(image, /height="\d+"/);
  }
});

test('todos os ativos de imagem referenciados existem', async () => {
  const sources = [...html.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map((match) => match[1]);

  await Promise.all(
    sources.map((source) => access(new URL(`../${source}`, import.meta.url))),
  );
});

import test from 'node:test';
import assert from 'node:assert/strict';
const scriptModule = await import('../script.js').catch(() => ({}));
const normalizeField = scriptModule.normalizeField ?? (() => '');
const validateQuoteRequest = scriptModule.validateQuoteRequest ?? (() => ({}));
const buildWhatsappMessage = scriptModule.buildWhatsappMessage ?? (() => '');
const buildWhatsappUrl = scriptModule.buildWhatsappUrl ?? (() => 'https://wa.me/invalid');

const validRequest = {
  nome: 'Ana Souza',
  telefone: '(33) 99999-0000',
  cidade: 'Manhuaçu - MG',
  cultura: 'Café',
  necessidade: 'Preciso de orientação sobre fertilização.',
};

test('normaliza espaços e quebras de linha sem remover acentos', () => {
  assert.equal(normalizeField('  café\n  arábica  '), 'café arábica');
});

test('exige os cinco campos da solicitação', () => {
  assert.deepEqual(Object.keys(validateQuoteRequest({})).sort(), [
    'cidade',
    'cultura',
    'necessidade',
    'nome',
    'telefone',
  ]);
  assert.deepEqual(validateQuoteRequest(validRequest), {});
});

test('gera uma mensagem comercial legível', () => {
  const message = buildWhatsappMessage(validRequest);

  assert.match(message, /SOLICITAÇÃO DE ORÇAMENTO — MAIRINQUES/);
  assert.match(message, /Nome: Ana Souza/);
  assert.match(message, /Cidade\/região: Manhuaçu - MG/);
  assert.match(message, /Necessidade:\*\nPreciso de orientação sobre fertilização\./);
});

test('gera URL codificada para o WhatsApp configurado', () => {
  const url = new URL(buildWhatsappUrl(validRequest));

  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/5533998547165');
  assert.match(url.searchParams.get('text'), /Ana Souza/);
  assert.match(url.searchParams.get('text'), /Manhuaçu - MG/);
});

test('usa uma única navegação para abrir o pedido no WhatsApp', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(new URL('../script.js', import.meta.url), 'utf8');

  assert.match(source, /window\.location\.assign\(url\)/);
  assert.doesNotMatch(source, /window\.open\(/);
});

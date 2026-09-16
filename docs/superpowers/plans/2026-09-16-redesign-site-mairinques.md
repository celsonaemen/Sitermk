# Redesign profissional do site Mairinques — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar uma landing page agro premium, responsiva e orientada a pedidos de orçamento pelo WhatsApp.

**Architecture:** O site continuará estático e sem dependências de produção. `index.html` conterá a estrutura semântica, `styles.css` será responsável pelo sistema visual mobile-first e `script.js` concentrará funções puras testáveis e a inicialização progressiva das interações do navegador.

**Tech Stack:** HTML5, CSS3, JavaScript ES modules, Node.js `node:test`, servidor estático Python.

**Spec:** `docs/superpowers/specs/2026-09-16-redesign-site-mairinques-design.md`

## Global Constraints

- Permanecer estático e sem dependências de build ou runtime.
- Usar somente afirmações comerciais comprovadas pelo material existente.
- Reaproveitar as imagens e os contatos existentes no repositório.
- Gerar pedidos pelo WhatsApp `5533998547165` sem armazenar dados.
- Funcionar em dispositivos móveis, por teclado e com movimento reduzido.
- Não adicionar backend, pagamentos, painel, banco, analytics, domínio ou hospedagem.

---

## File map

- `index.html`: conteúdo, semântica, SEO e pontos de integração.
- `styles.css`: tokens, componentes, layouts, breakpoints e acessibilidade visual.
- `script.js`: menu móvel, formulário, geração da URL do WhatsApp, animações progressivas e ano do rodapé.
- `package.json`: comando local de testes usando apenas o Node.js.
- `tests/site-structure.test.mjs`: contrato estrutural, SEO, acessibilidade básica e segurança de links.
- `tests/styles.test.mjs`: contrato do sistema visual e da responsividade.
- `tests/script.test.mjs`: testes unitários das funções puras do formulário.
- `README.md`: execução local e mapa de manutenção do conteúdo.

### Task 1: Estrutura semântica e contrato estático

**Files:**
- Create: `package.json`
- Create: `tests/site-structure.test.mjs`
- Modify: `index.html`

**Interfaces:**
- Consumes: imagens e URLs já existentes no repositório.
- Produces: IDs `inicio`, `solucoes`, `como-funciona`, `parceiros`, `sobre` e `contato`; formulário `#quote-form`; menu `#site-nav`; botão `#menu-toggle`; status `#form-status`.

- [ ] **Step 1: Criar o teste estrutural inicialmente vermelho**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('carrega CSS e JavaScript próprios', () => {
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

test('protege links que abrem nova aba', () => {
  const external = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map((match) => match[0]);
  assert.ok(external.length > 0);
  for (const anchor of external) assert.match(anchor, /rel="noopener noreferrer"/);
});
```

- [ ] **Step 2: Confirmar a falha do contrato**

Run: `node --test tests/site-structure.test.mjs`

Expected: FAIL por ausência de `styles.css`, `script.js`, novas seções/campos ou `rel` seguro.

- [ ] **Step 3: Criar o comando de testes**

```json
{
  "name": "site-representacoes-mairinques",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test"
  }
}
```

- [ ] **Step 4: Reescrever o HTML como landing page semântica**

Usar um `header` com marca textual e navegação, `main` com as seis seções contratuais e `footer`. O hero deve usar o título “Soluções agrícolas para quem produz”, o subtítulo “Atendimento próximo para encontrar insumos, proteção e equipamentos alinhados à realidade da sua produção.” e CTAs “Solicitar orçamento” e “Conhecer soluções”.

Os cards de parceiros devem usar os quatro logos locais e os perfis já confirmados. A seção institucional deve usar `Equipee.jpg` como imagem principal e `Equipeee.jpg`/`Enscopopng.png` como apoio, com texto que descreva atendimento próximo sem alegar porte ou exclusividade.

O formulário deve conter `label` explícito para cada campo e o aviso: “Ao enviar, você será direcionado ao WhatsApp. Nenhum dado fica armazenado neste site.”

- [ ] **Step 5: Executar o teste estrutural**

Run: `npm test -- tests/site-structure.test.mjs`

Expected: PASS em todos os testes estruturais.

- [ ] **Step 6: Commitar a estrutura**

```bash
git add package.json tests/site-structure.test.mjs index.html
git commit -m "feat: rebuild semantic landing page"
```

### Task 2: Sistema visual agro premium

**Files:**
- Create: `tests/styles.test.mjs`
- Create: `styles.css`

**Interfaces:**
- Consumes: classes semânticas presentes em `index.html`.
- Produces: tokens CSS `--color-forest`, `--color-leaf`, `--color-cream`, `--color-earth`, `--font-display`, `--font-body`; estados `.is-open` e `.is-visible`.

- [ ] **Step 1: Escrever o contrato visual inicialmente vermelho**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');

test('define tokens e layouts principais', () => {
  for (const token of ['--color-forest', '--color-leaf', '--color-cream', '--color-earth', '--font-display', '--font-body']) {
    assert.match(css, new RegExp(token));
  }
  assert.match(css, /\.hero-grid/);
  assert.match(css, /\.solutions-grid/);
  assert.match(css, /\.partners-grid/);
});

test('inclui responsividade e movimento reduzido', () => {
  assert.match(css, /@media\s*\(min-width:\s*48rem\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
});
```

- [ ] **Step 2: Confirmar a falha por arquivo ausente**

Run: `node --test tests/styles.test.mjs`

Expected: FAIL com `ENOENT` para `styles.css`.

- [ ] **Step 3: Implementar tokens e base visual**

Definir a paleta `#173f2a` (verde floresta), `#2f6b45` (verde folha), `#f5f1e7` (creme), `#b66a3c` (terra) e `#172019` (texto). Usar uma pilha serifada de sistema para títulos e uma sans-serif de sistema para corpo, evitando fontes externas bloqueantes.

Implementar container máximo de `74rem`, espaçamento fluido com `clamp()`, botões sólidos com altura mínima de `3rem`, cartões com bordas suaves e sombras discretas, imagens com `object-fit: cover`, cabeçalho aderente e menu móvel fechado por padrão.

- [ ] **Step 4: Implementar layouts e responsividade**

Em mobile, todas as seções usam uma coluna. A partir de `48rem`, hero e institucional usam duas colunas; soluções usam três colunas; parceiros usam quatro colunas. A partir de `64rem`, exibir a navegação desktop e ocultar o botão do menu.

Adicionar `:focus-visible` com outline de `3px`, estados de hover sem deslocamentos bruscos e bloco `@media (prefers-reduced-motion: reduce)` desabilitando transições, animações e scroll suave.

- [ ] **Step 5: Executar os contratos de HTML e CSS**

Run: `npm test -- tests/site-structure.test.mjs tests/styles.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commitar o sistema visual**

```bash
git add styles.css tests/styles.test.mjs
git commit -m "feat: add agro premium visual system"
```

### Task 3: Interações e orçamento pelo WhatsApp

**Files:**
- Create: `tests/script.test.mjs`
- Create: `script.js`

**Interfaces:**
- Produces: `normalizeField(value: unknown): string`, `validateQuoteRequest(data: QuoteRequest): Record<string, string>`, `buildWhatsappMessage(data: QuoteRequest): string`, `buildWhatsappUrl(data: QuoteRequest, phone?: string): string`.
- Consumes: IDs e campos definidos na Task 1; classes `.is-open` e `.is-visible` da Task 2.

- [ ] **Step 1: Escrever testes unitários inicialmente vermelhos**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWhatsappUrl, normalizeField, validateQuoteRequest } from '../script.js';

const valid = {
  nome: 'Ana Souza',
  telefone: '(33) 99999-0000',
  cidade: 'Manhuaçu - MG',
  cultura: 'Café',
  necessidade: 'Preciso de orientação sobre fertilização.'
};

test('normaliza espaços e quebras de linha', () => {
  assert.equal(normalizeField('  café\n  arábica  '), 'café arábica');
});

test('exige os cinco campos da solicitação', () => {
  assert.deepEqual(Object.keys(validateQuoteRequest({})).sort(), ['cidade', 'cultura', 'necessidade', 'nome', 'telefone']);
  assert.deepEqual(validateQuoteRequest(valid), {});
});

test('gera URL codificada para o WhatsApp configurado', () => {
  const url = new URL(buildWhatsappUrl(valid));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/5533998547165');
  assert.match(url.searchParams.get('text'), /Ana Souza/);
  assert.match(url.searchParams.get('text'), /Manhuaçu - MG/);
});
```

- [ ] **Step 2: Confirmar a falha por módulo ausente**

Run: `node --test tests/script.test.mjs`

Expected: FAIL com `ERR_MODULE_NOT_FOUND` para `script.js`.

- [ ] **Step 3: Implementar as funções puras**

```js
const WHATSAPP_PHONE = '5533998547165';
const REQUIRED_FIELDS = ['nome', 'telefone', 'cidade', 'cultura', 'necessidade'];

export function normalizeField(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

export function validateQuoteRequest(data) {
  return Object.fromEntries(
    REQUIRED_FIELDS
      .filter((field) => normalizeField(data?.[field]).length < 2)
      .map((field) => [field, 'Preencha este campo para continuar.'])
  );
}

export function buildWhatsappMessage(data) {
  return [
    '*SOLICITAÇÃO DE ORÇAMENTO — MAIRINQUES*',
    '',
    `Nome: ${normalizeField(data.nome)}`,
    `Telefone: ${normalizeField(data.telefone)}`,
    `Cidade/região: ${normalizeField(data.cidade)}`,
    `Cultura: ${normalizeField(data.cultura)}`,
    '',
    '*Necessidade:*',
    normalizeField(data.necessidade)
  ].join('\n');
}

export function buildWhatsappUrl(data, phone = WHATSAPP_PHONE) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(buildWhatsappMessage(data))}`;
}
```

- [ ] **Step 4: Inicializar comportamento apenas no navegador**

Quando `document` existir, ligar o menu móvel ao `aria-expanded`, fechar o menu após seleção, atualizar o ano do rodapé, validar cada campo no envio, preencher `#form-status` e abrir a URL gerada em nova aba com `window.open(url, '_blank', 'noopener,noreferrer')`. Usar `IntersectionObserver` somente quando disponível e manter todo o conteúdo visível como fallback.

- [ ] **Step 5: Executar todos os testes**

Run: `npm test`

Expected: PASS em estrutura, estilos e JavaScript.

- [ ] **Step 6: Commitar as interações**

```bash
git add script.js tests/script.test.mjs
git commit -m "feat: add accessible WhatsApp quote flow"
```

### Task 4: SEO, ativos e endurecimento de qualidade

**Files:**
- Modify: `tests/site-structure.test.mjs`
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `script.js`

**Interfaces:**
- Consumes: estrutura e funções das Tasks 1–3.
- Produces: metadados completos, imagens válidas, experiência sem JavaScript e estados de erro acessíveis.

- [ ] **Step 1: Ampliar o teste estrutural**

Adicionar asserts para `meta[name="description"]`, `meta[property="og:title"]`, `meta[property="og:description"]`, `meta[name="theme-color"]`, exatamente um `h1`, `aria-live="polite"`, textos alternativos não vazios, `width`/`height` nas imagens e ausência de estilos/scripts inline.

Adicionar um teste que extraia cada `src` relativo e confirme sua existência com `access(new URL('../' + src, import.meta.url))`.

- [ ] **Step 2: Confirmar que os novos requisitos falham**

Run: `node --test tests/site-structure.test.mjs`

Expected: FAIL indicando os metadados, dimensões ou fallbacks ainda ausentes.

- [ ] **Step 3: Completar SEO e carregamento**

Adicionar descrição objetiva, Open Graph, `theme-color`, favicon SVG em data URL e JSON-LD somente com nome, URL social e área de atuação confirmados. Definir `loading="lazy"` nas imagens abaixo da dobra, `decoding="async"` e dimensões reais. A imagem principal do hero deve usar prioridade normal, sem lazy loading.

- [ ] **Step 4: Completar estados acessíveis e fallback**

Manter os CTAs diretos de WhatsApp funcionais sem JavaScript. Garantir mensagem de erro junto ao campo, `aria-invalid`, foco no primeiro campo inválido e `aria-live="polite"` no status. Com JavaScript desativado, conteúdo e navegação devem continuar visíveis.

- [ ] **Step 5: Rodar verificação completa**

Run: `npm test && git diff --check`

Expected: todos os testes PASS e nenhuma saída do `git diff --check`.

- [ ] **Step 6: Commitar o endurecimento**

```bash
git add index.html styles.css script.js tests/site-structure.test.mjs
git commit -m "feat: harden accessibility and SEO"
```

### Task 5: Documentação e smoke test visual

**Files:**
- Create: `README.md`
- Modify: arquivos da landing page somente se o smoke test revelar defeitos.

**Interfaces:**
- Consumes: entrega completa das Tasks 1–4.
- Produces: instruções de execução e evidência de funcionamento local.

- [ ] **Step 1: Documentar execução e manutenção**

O README deve registrar `python -m http.server 5500 --bind 127.0.0.1`, URL `http://127.0.0.1:5500/`, `npm test`, localização do telefone do WhatsApp em `script.js`, perfis sociais em `index.html` e pastas de imagens dos parceiros.

- [ ] **Step 2: Subir o site localmente**

Run: `python -m http.server 5500 --bind 127.0.0.1`

Expected: servidor ouvindo em `127.0.0.1:5500` e `GET /` retornando HTTP 200.

- [ ] **Step 3: Inspecionar desktop e mobile**

Conferir visualmente em aproximadamente `1440×900`, `768×1024` e `390×844`: ausência de overflow horizontal, hierarquia do hero, legibilidade, corte das imagens, menu, cards, formulário e rodapé.

- [ ] **Step 4: Testar a jornada crítica**

Por teclado, navegar até o formulário, provocar erros vazios, preencher os cinco campos e confirmar que a URL final aponta para `wa.me/5533998547165` com a mensagem estruturada. Não enviar mensagem real.

- [ ] **Step 5: Executar a verificação final**

Run: `npm test && git diff --check && git status --short`

Expected: testes PASS, nenhum erro de whitespace e apenas mudanças intencionais.

- [ ] **Step 6: Commitar documentação e ajustes finais**

```bash
git add README.md index.html styles.css script.js tests
git commit -m "docs: add local development guide"
```

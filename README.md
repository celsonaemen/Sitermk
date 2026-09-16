# Representações Mairinques

Landing page estática para apresentar soluções agrícolas, marcas parceiras e iniciar pedidos de orçamento pelo WhatsApp.

## Executar localmente

Na raiz do projeto:

```bash
python -m http.server 5500 --bind 127.0.0.1
```

Abra `http://127.0.0.1:5500/` no navegador.

## Testes

```bash
npm test
```

A suíte usa apenas o executor nativo do Node.js e valida estrutura, ativos, SEO, CSS e geração da mensagem de orçamento.

## Manutenção

- Número do WhatsApp: constante `WHATSAPP_PHONE` em `script.js`.
- Instagram e links dos parceiros: `index.html`.
- Identidade e layout: `styles.css`.
- Fotos da equipe: arquivos de imagem na raiz.
- Produtos e logos: pastas `ParceiroFertipar`, `ParceiroOxiquimica`, `Parceiropalinialves` e `Parceirosimbiose`.

O formulário não envia ou armazena dados. Ele apenas organiza o conteúdo e abre uma URL oficial do WhatsApp para o visitante revisar a mensagem.

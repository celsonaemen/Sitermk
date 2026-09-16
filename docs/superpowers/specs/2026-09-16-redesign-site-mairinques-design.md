# Redesign profissional do site Representações Mairinques

## Objetivo

Transformar o site estático atual em uma landing page comercial profissional para uma operação real de representação agrícola ainda em estruturação. A página deve gerar pedidos de orçamento pelo WhatsApp, apresentar soluções e marcas parceiras e transmitir confiança sem sugerir porte, resultados ou credenciais que não foram comprovados.

## Direção visual

O site adotará uma estética “agro premium”: fundo claro, verde profundo, tons terrosos, tipografia editorial e imagens reais já disponíveis no repositório. A interface evitará o excesso de transparências e efeitos do layout atual. Animações serão discretas, terão finalidade de orientação e respeitarão a preferência do sistema por movimento reduzido.

## Estrutura da página

1. Cabeçalho fixo com navegação curta e chamada para orçamento.
2. Hero com proposta de valor ampla para produtores rurais de diferentes culturas e CTA principal para WhatsApp.
3. Bloco de confiança com as marcas representadas.
4. Seção de soluções: fertilizantes, proteção e tecnologia/equipamentos.
5. Seção “como funciona”: necessidade, orientação e orçamento.
6. Apresentação dos parceiros com logotipos e imagens de produtos.
7. Seção institucional honesta, acompanhada das fotos reais existentes.
8. Contato e formulário de orçamento.
9. Rodapé com Instagram, WhatsApp e ano atualizado automaticamente.

## Conteúdo e tom

A redação será objetiva, próxima do produtor e orientada a benefícios. Não serão usados depoimentos, números, certificados, promessas de produtividade ou alegações de exclusividade sem fonte. A operação será descrita como atendimento especializado em soluções agrícolas e conexão entre produtores e marcas parceiras.

## Conversão e fluxo de contato

O CTA principal abrirá o WhatsApp no número já configurado no projeto. O formulário coletará nome, telefone, cidade/região, cultura e necessidade; os campos serão validados no navegador e transformados em uma mensagem estruturada. Também haverá um link direto para WhatsApp como alternativa caso o formulário não possa ser usado.

## Arquitetura técnica

O projeto permanecerá estático e sem dependências de build. O arquivo monolítico será separado em:

- `index.html`: estrutura semântica e metadados;
- `styles.css`: tokens visuais, layout responsivo e estados de interação;
- `script.js`: menu móvel, formulário, interações e ano do rodapé.

As imagens existentes serão reaproveitadas e receberão dimensões, carregamento tardio quando adequado e textos alternativos. A dependência de ícones carregada como `latest` será removida ou fixada; a solução preferencial é usar SVGs locais embutidos para evitar dependência externa desnecessária.

## Responsividade e acessibilidade

O layout será mobile-first e testado em larguras pequenas, médias e grandes. A navegação funcionará por teclado; o menu móvel terá estado acessível; o formulário terá rótulos; foco, contraste e alvos de toque serão visíveis e adequados. Links que abrirem nova aba usarão `rel="noopener noreferrer"`.

## SEO, privacidade e segurança

A página terá título, descrição, Open Graph, URL canônica configurável e dados estruturados compatíveis com uma organização local, usando somente informações confirmadas. O formulário explicará que os dados serão usados para iniciar o atendimento no WhatsApp; nenhum dado será armazenado pelo site. Conteúdo inserido pelo usuário será codificado antes de compor a URL do WhatsApp.

## Verificação

A entrega será verificada com:

- carregamento local por servidor HTTP;
- inspeção visual em desktop e mobile;
- teste dos links de WhatsApp, Instagram e parceiros;
- navegação por teclado e teste do menu móvel;
- validação do formulário e da mensagem gerada;
- conferência do console do navegador e dos caminhos de imagens;
- revisão básica de HTML, acessibilidade, SEO e desempenho.

## Fora do escopo

Não serão adicionados backend, painel administrativo, pagamentos, catálogo com carrinho, banco de dados, analytics, domínio ou hospedagem nesta etapa. Esses itens só serão considerados após o responsável pelo negócio aprovar a demonstração.

# Sevenleo Portfolio

Portfólio pessoal de Leonardo Neves da Silva, criado como um catálogo vivo de projetos, formação, experiência e tecnologias. O site foi repaginado como uma aplicação Vite + React + TypeScript, com dados mantidos em JSON e um manifesto público gerado automaticamente no build.

O objetivo principal do projeto é facilitar manutenção e navegação: novos conteúdos entram por arquivos estruturados em `public/content`, enquanto a interface pública usa um manifesto único em `public/data/portfolio.manifest.json`.

## Conceito

O site funciona como um hub pessoal minimalista e um catálogo técnico pesquisável.

- A home é uma entrada simples, com foto, apresentação curta, botões principais e redes sociais discretas.
- O catálogo de projetos é a área central, com busca, filtros, cards compactos e indicação visual de conteúdos ainda não revisados.
- As páginas individuais dão foco ao projeto atual, sem projetos relacionados, sem botões repetidos e sem seções vazias.
- A página de tecnologias organiza linguagens, stacks e categorias como índice navegável.
- Formação, experiência e social ficam em páginas próprias.

O projeto prioriza clareza e manutenção: a aparência é controlada por CSS local, os dados por JSON, e a navegação por hash router para funcionar bem em GitHub Pages.

## Stack técnica

- **Vite 7**: servidor de desenvolvimento e build frontend.
- **React 19**: interface da aplicação.
- **TypeScript 5**: tipagem do manifesto, projetos, perfil e coleções.
- **lucide-react**: ícones da interface.
- **Node.js**: scripts de geração de manifesto e preparação de assets Unity/WebGL.
- **GitHub Pages**: publicação estática via workflow em `.github/workflows/pages.yml`.

## Estrutura do projeto

```text
.
├── .github/workflows/pages.yml      # Deploy automático para GitHub Pages
├── index.html                       # Entrada HTML do Vite
├── package.json                     # Scripts, dependências e metadados
├── public/
│   ├── content/                     # Fonte de dados editável
│   │   ├── profile.json             # Dados pessoais, foto e redes
│   │   ├── skills.json              # Skills primárias e complementares
│   │   ├── education/*.json         # Formação acadêmica e cursos
│   │   ├── experience/*.json        # Experiências profissionais
│   │   └── projects/<slug>/         # Projeto, assets e mídias
│   │       └── project.json
│   └── data/
│       └── portfolio.manifest.json  # Manifesto gerado para o app
├── src/
│   ├── App.tsx                      # Rotas, telas, componentes e comportamento
│   ├── main.tsx                     # Bootstrap React
│   ├── styles.css                   # Layout, tema e responsividade
│   └── types.ts                     # Tipos do manifesto e entidades
├── tools/
│   ├── generate-manifest.mjs        # Normaliza conteúdo e gera manifesto
│   └── prepare-unity-assets.mjs     # Descompacta assets Unity/WebGL
└── vite.config.ts
```

## Fluxo de dados

O app não lê diretórios no navegador. O conteúdo é indexado em tempo de build por `tools/generate-manifest.mjs`.

1. O mantenedor edita arquivos em `public/content`.
2. O script `npm run content:index` percorre os JSONs.
3. Assets relativos são convertidos para URLs públicas.
4. Projetos são normalizados, ordenados e enriquecidos com badges, link principal, texto de busca, estatísticas e índices.
5. O resultado é salvo em `public/data/portfolio.manifest.json`.
6. O React carrega esse manifesto via `fetch` e renderiza as páginas.

Esse fluxo evita depender de listagem de diretórios no GitHub Pages e permite adicionar projetos sem alterar código.

## Modelo de projeto

Cada projeto fica em:

```text
public/content/projects/<slug>/project.json
```

Campos principais:

```json
{
  "slug": "meu-projeto",
  "title": "Meu Projeto",
  "shortSummary": "Resumo curto para card e topo da página.",
  "description": "Descrição completa do projeto.",
  "category": "Ferramentas",
  "type": "webapp",
  "status": "active",
  "visibility": "public",
  "maturity": "mvp",
  "platforms": ["web"],
  "languages": ["TypeScript"],
  "technologies": ["React", "Vite"],
  "tags": ["produtividade", "catalogo"],
  "audience": "Usuários finais ou equipe técnica.",
  "problem": "Problema que o projeto resolve.",
  "goal": "Objetivo prático do projeto.",
  "cover": "cover.png",
  "gallery": [{ "src": "images/screenshot-1.png", "alt": "Tela principal" }],
  "links": [{ "label": "Abrir projeto", "url": "https://example.com", "type": "site", "primary": true }],
  "versions": [{ "version": "1.0.0", "date": "2026-06-06", "summary": "Primeira versão pública" }],
  "timeline": [{ "date": "2026-06-06", "title": "Publicação" }],
  "createdAt": "2026-06-06",
  "updatedAt": "2026-06-06",
  "contentReviewedAt": "2026-06-06"
}
```

### Revisão de conteúdo

`contentReviewedAt` representa a revisão do JSON/conteúdo cadastrado no portfólio, não a revisão técnica do projeto.

- Com `contentReviewedAt`: o projeto aparece completo no catálogo e na página individual.
- Sem `contentReviewedAt`, vazio ou nulo: o projeto é tratado como **Sem revisão**.
- Projetos sem revisão continuam públicos, mas exibem apenas o básico: nome, badge `Sem revisão` e link principal, quando existir.
- A data de revisão não aparece no site público; ela serve apenas para controlar manutenção.
- O formato recomendado é `YYYY-MM-DD`.

### Assets de projeto

Assets devem ficar na pasta do próprio projeto.

```text
public/content/projects/intelligent-text/
├── it.png
└── project.json
```

No JSON, use caminhos relativos:

```json
{
  "cover": "it.png"
}
```

O manifesto converte automaticamente para:

```text
/content/projects/intelligent-text/it.png
```

Links externos, `mailto:`, `tel:`, rotas com `#` e caminhos iniciados com `/` são preservados.

## Perfil, formação, experiência e skills

O conteúdo institucional fica separado dos projetos.

- `public/content/profile.json`: nome, cargo, resumo, foto, localização e redes sociais.
- `public/content/profile/leo.png`: foto usada na home.
- `public/content/skills.json`: listas de competências.
- `public/content/education/*.json`: itens da linha de formação, ordenados por `order` (contém `highlights` que são renderizados como chips de tags na timeline).
- `public/content/experience/*.json`: experiências profissionais, também ordenadas por `order` (suporta um campo opcional `tags` para exibir chips de tecnologias).

Essas coleções são lidas pelo manifesto e renderizadas nas páginas correspondentes.

## Manifesto gerado

`public/data/portfolio.manifest.json` é o arquivo consumido pelo frontend.

Ele contém:

- `generatedAt`: data/hora de geração.
- `profile`: dados pessoais normalizados.
- `skills`: competências.
- `education`: formação ordenada.
- `experience`: experiência ordenada.
- `projects`: projetos normalizados.
- `stats`: contagens usadas no catálogo.
- `indexes`: índices por linguagens, tecnologias e categorias.

O gerador também cria:

- `contentReviewed`: booleano derivado de `contentReviewedAt`.
- `primaryLink`: primeiro link marcado como `primary` ou o primeiro link disponível.
- `badges`: badges de revisão, visibilidade, status, maturidade, tipo e plataforma.
- `searchText`: texto consolidado para busca global.
- `relatedProjectSlugs`: cálculo de projetos relacionados mantido no manifesto para uso futuro, mas não exibido na UI atual.

## Rotas

A aplicação usa hash router para compatibilidade com GitHub Pages.

```text
#/                  Home
#/projects          Catálogo de projetos
#/projects/<slug>   Página individual de projeto
#/technologies      Índice técnico
#/education         Formação
#/experience        Experiência
#/social            Links sociais
```

A rota de downloads/importação foi removida da interface. Campos de `downloads` ainda podem existir no modelo para compatibilidade futura, mas não são exibidos no site.

## Interface e layout

### Direção visual

O layout atual segue uma linha escura, minimalista e técnica. Ele é funcional e compatível com a lógica do site, mas deve ser tratado como uma base de implementação, não como uma direção visual definitiva.

- Fundo escuro com superfícies discretas.
- Acento verde/azulado usado com moderação.
- Cards com raio de 8px.
- Tipografia sem letter spacing negativo.
- Textos destacados apenas em títulos e subtítulos.
- Poucos blocos por página para reduzir ruído visual.

### Home

A home é propositalmente simples:

- Foto pequena.
- Nome, cargo e resumo curto.
- Botão para catálogo.
- Botão para projeto aleatório, selecionando apenas projetos públicos e revisados.
- Redes sociais no rodapé com ícones.

Ela não exibe projetos, estatísticas, tags de foco nem atalhos duplicados, porque a navegação lateral já cobre as áreas principais.

### Sidebar

No desktop, a barra lateral (sidebar) é compacta e interativa:

- Largura colapsada reduzida com ícones perfeitamente centralizados.
- Ao passar o mouse (hover) ou expandir, a largura aumenta e as labels dos menus aparecem com efeito suave de slide-in.
- Os ícones se alinham automaticamente à esquerda quando a barra é expandida.
- Possui um botão de "Contato" destacado na parte inferior, que redireciona para a página social, com cores de alto contraste e layout que impede a quebra de texto.


No mobile, ela vira drawer:

- Botão de menu no cabeçalho móvel.
- Itens com ícone e texto.
- Fecha ao navegar.

### Catálogo de projetos

O catálogo foi desenhado para densidade e manutenção visual:

- Busca global instantânea e mais compacta.
- Filtros rápidos por categoria.
- Controles de visualização: seletor de densidade (Modo Compacto, que oculta capas, descrições, status e badges, exibindo apenas títulos e o botão de Detalhes) e modos de layout (seletores para 3, 4 ou 6 colunas por linha ou visualização em Lista vertical, que oculta descrições dos projetos).
- Painel avançado recolhível com linguagem, categoria, status, visibilidade, maturidade e plataforma.
- Projetos sem revisão têm card mínimo.

### Página individual de projeto

Projetos revisados mostram:

- Capa pequena.
- Badges.
- Nome, resumo e link principal.
- Descrição.
- Contexto: público-alvo, problema e objetivo.
- Stack: linguagens, tecnologias e tags.
- Galeria somente quando há mídia extra diferente da capa.
- Links secundários somente quando não duplicam o link principal.
- Histórico somente quando versões ou marcos existem.

Projetos sem revisão mostram apenas:

- Badge `Sem revisão`.
- Nome.
- Link principal, se existir.

## Contrato para redesign visual

A estrutura e a lógica do site estão consolidadas. Um novo layout pode mudar completamente aparência, composição, proporções, espaçamentos, cores, tipografia e hierarquia visual, mas precisa respeitar o contrato funcional abaixo para continuar compatível com o backend estático atual.

### O que o designer pode mudar

- Sistema visual completo: paleta, tipografia, grid, ritmo vertical, iconografia, composição e densidade.
- Aparência dos cards, filtros, timelines, badges, chips, botões, galerias e estados vazios.
- Posição da navegação, desde que todas as rotas continuem acessíveis.
- Layout desktop, tablet e mobile.
- Tratamento visual de capas, thumbnails e imagens de baixa resolução.
- Hierarquia visual da home, catálogo e páginas individuais.
- Estilo de hover, active, focus, disabled, empty, loading e error states.

### O que nao deve mudar sem alterar codigo e dados

- O site continua sendo uma aplicação estática React/Vite.
- A fonte de verdade continua sendo `public/content` e o manifesto gerado em `public/data/portfolio.manifest.json`.
- As rotas continuam usando hash router.
- As páginas públicas continuam sendo Home, Projetos, Projeto individual, Tecnologias, Formação, Experiência e Social.
- Downloads/importação não devem voltar para a navegação.
- A home não deve listar projetos nem estatísticas detalhadas.
- O catálogo deve continuar sendo o ponto principal para projetos, busca, filtros e estatísticas.
- Projetos sem `contentReviewedAt` devem continuar visíveis, com tratamento mínimo e badge `Sem revisão`.
- Projetos revisados devem ter página completa, mas sem exibir a data de revisão do conteúdo.
- O link principal do projeto deve aparecer apenas uma vez.
- A galeria só deve aparecer quando existir mídia extra diferente da capa.

### Componentes que precisam existir no design

- Shell global com navegação principal e área de conteúdo.
- Header mobile com botão de menu.
- Home com foto, nome, cargo, resumo, CTA para catálogo, CTA de projeto aleatório e social icons.
- Catálogo com título, busca e botões de filtro compactados, controles de densidade (Compacto) e tipo de visualização (3, 4, 6 colunas ou Lista), filtros rápidos, botão de filtros avançados, botão limpar, contagem de resultados, grid/lista de projetos e empty state.
- Card de projeto revisado com thumbnail pequeno, título, categoria, resumo curto, badges essenciais, status e ações compactas.
- Card de projeto sem revisão com nome, badge `Sem revisão` e link principal opcional.
- Página de projeto revisado com capa pequena, badges, título, resumo, CTA principal, descrição, contexto, stack, galeria opcional, links secundários opcionais e histórico opcional.
- Página de projeto sem revisão com layout mínimo.
- Página de tecnologias com grupos de linguagens, tecnologias e categorias estruturados em elementos sanfonados (acordeões) que iniciam fechados e expandem ao serem clicados, cada grupo listando até cinco projetos associados.
- Timelines para formação e experiência (exibidas de forma limpa, sem a linha cinza vertical de conexão entre os nós).
- Página social com links externos.
- Estados de carregamento e erro de manifesto.

### Estados orientados por dados

O design deve prever variação de conteúdo. Os JSONs podem gerar:

- Projeto com ou sem capa.
- Projeto com capa de baixa resolução ou apenas ícone.
- Projeto com muitos badges.
- Projeto com poucas ou muitas tags.
- Projeto sem links externos.
- Projeto com apenas link principal.
- Projeto com links secundarios além do principal.
- Projeto com ou sem galeria extra.
- Projeto com ou sem histórico.
- Projeto sem revisão, exibindo somente informações mínimas.
- Catálogo com muitos projetos.
- Busca sem resultados.
- Filtros avançados abertos e fechados.
- Listas de tecnologias com nomes curtos ou longos.
- Conteúdos acadêmicos/profissionais com períodos e descrições de tamanhos diferentes.

### Requisitos responsivos

O design final deve incluir pelo menos estes tamanhos:

- Desktop largo: 1440px.
- Desktop comum: 1280px.
- Tablet: 768px.
- Mobile: 390px.
- Mobile estreito: 320px.

Nenhum texto pode depender de `vw` para tamanho de fonte. Cards, botões, chips, thumbnails e áreas fixas devem ter dimensões estáveis para evitar que conteúdo dinâmico quebre o layout.

### Acessibilidade e usabilidade

- Contraste adequado entre texto, superfícies e fundos.
- Estados de hover, focus-visible e active claramente definidos.
- Botões e links distinguíveis entre si.
- Ícones com significado previsível.
- Social icons com labels acessíveis.
- Navegação utilizável por teclado.
- Cards clicáveis sem conflitar com links internos.
- Textos longos devem quebrar linha sem sobrepor elementos.
- O catálogo deve continuar eficiente para varrer visualmente muitos projetos.

### Entregáveis esperados do designer

O arquivo de design deve fornecer:

- Frames de todas as páginas principais em desktop e mobile.
- Componentes reutilizáveis com variants.
- Design tokens: cores, tipografia, espaçamentos, raio, sombras, bordas e estados.
- Especificação de grid e breakpoints.
- Estados de cards revisados e sem revisão.
- Estados de filtros abertos/fechados.
- Estados de busca vazia e erro/carregamento.
- Tratamento para imagens de baixa resolução.
- Protótipo simples de navegação entre Home, Projetos, Projeto individual e Tecnologias.
- Notas de handoff explicando comportamento esperado onde o visual não for óbvio.

## Scripts

```bash
npm install
```

Instala dependências.

```bash
npm run content:unity
```

Descompacta assets Unity/WebGL versionados em formato `.gz` para arquivos consumíveis pelo navegador.

```bash
npm run content:index
```

Gera `public/data/portfolio.manifest.json` a partir de `public/content`.

```bash
npm run dev
```

Prepara assets Unity, gera o manifesto e inicia o Vite em modo desenvolvimento.

```bash
npm run build
```

Prepara assets Unity, gera manifesto, roda `tsc -b` e cria o build final em `dist`.

```bash
npm run preview
```

Serve o build localmente para conferência.

## Deploy

O deploy é feito por GitHub Actions em `.github/workflows/pages.yml`.

Gatilhos:

- Push nas branches `2026`, `main` ou `master`.
- Execução manual via `workflow_dispatch`.

Pipeline:

1. Checkout do repositório.
2. Setup Node.js 22.
3. `npm ci`.
4. `npm run build`.
5. Upload de `dist`.
6. Deploy para GitHub Pages.

## Como adicionar um projeto

1. Crie a pasta:

```text
public/content/projects/meu-projeto/
```

2. Adicione `project.json`.
3. Coloque imagens/assets na mesma pasta.
4. Use caminhos relativos no JSON.
5. Se o conteúdo estiver revisado, inclua `contentReviewedAt`.
6. Rode:

```bash
npm run content:index
npm run build
```

7. Abra `#/projects` e confira busca, filtros, card e página individual.

## Checklist de manutenção

- O `slug` da pasta e o `slug` do JSON devem bater ou o JSON deve declarar explicitamente o slug correto.
- `contentReviewedAt` deve existir apenas quando o conteúdo público do JSON estiver revisado.
- `visibility: "private"` pode ser usado para projetos que não devem ter exposição completa de dados sensíveis.
- Links restritos, tokens, URLs internas e credenciais não devem ser cadastrados.
- Imagens de baixa resolução devem preferencialmente ser usadas como capa pequena ou substituídas.
- A galeria só deve conter imagens realmente extras, não cópias da capa.
- Depois de editar conteúdo, gere o manifesto antes de testar o site.

## Testes recomendados

Antes de publicar:

```bash
npm run build
```

Conferir manualmente:

- Home sem blocos repetidos.
- Sidebar desktop e drawer mobile.
- Catálogo com busca e filtros.
- Projetos revisados completos.
- Projetos sem revisão com card/página mínima.
- Galeria somente quando houver mídia extra.
- Links externos abrindo corretamente.
- Tecnologias com chips compactos.
- Formação, experiência e social.

## Observações de design e produto

Este portfólio não é uma landing page comercial tradicional. Ele funciona como uma base pública de conhecimento e apresentação técnica. Por isso, o design evita seções promocionais longas, heróis exagerados e cards decorativos em excesso.

A prioridade é o visitante encontrar rapidamente:

- quem é o autor;
- quais projetos existem;
- quais projetos estão revisados;
- quais tecnologias aparecem no histórico;
- onde acessar links públicos relevantes.

O resultado esperado é um site fácil de manter, visualmente limpo e preparado para crescer com novos projetos sem exigir alterações frequentes no código.

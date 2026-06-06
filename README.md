# Sevenleo Portfolio

Portfólio pessoal de Leonardo Neves da Silva, criado como um catálogo vivo de projetos, formação, experiência e tecnologias. O site foi repaginado como uma aplicação Vite + React + TypeScript, com dados mantidos em JSON e um manifesto público gerado automaticamente no build.

O objetivo principal do projeto é facilitar manutenção e navegação: novos conteúdos entram por arquivos estruturados em `public/content`, enquanto a interface pública usa um manifesto único em `public/data/portfolio.manifest.json`.

## Conceito

O site funciona como um hub pessoal minimalista e um catálogo técnico pesquisável.

- A home é uma entrada simples, com foto, apresentação curta, botões principais e redes sociais discretas.
- O catálogo de projetos é a área central, com busca, filtros, cards compactos e indicação visual de conteúdos ainda não revisados.
- As páginas individuais dão foco ao projeto atual, sem projetos relacionados, sem botões repetidos e sem seções vazias.
- A página de tecnologias organiza linguagens, stacks e categorias como índice navegável.
- Formação, experiência, social e documentação ficam em páginas próprias.

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
- `public/content/education/*.json`: itens da linha de formação, ordenados por `order`.
- `public/content/experience/*.json`: experiências profissionais, também ordenadas por `order`.

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
#/docs              Documentação pública de manutenção
```

A rota de downloads/importação foi removida da interface. Campos de `downloads` ainda podem existir no modelo para compatibilidade futura, mas não são exibidos no site.

## Interface e layout

### Direção visual

O layout segue uma linha escura, minimalista e técnica:

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

No desktop, a sidebar é compacta:

- Largura fixa reduzida.
- Ícones sempre visíveis.
- Labels aparecem por tooltip/hover.
- Sem logotipo superior e sem bloco inferior.

No mobile, ela vira drawer:

- Botão de menu no cabeçalho móvel.
- Itens com ícone e texto.
- Fecha ao navegar.

### Catálogo de projetos

O catálogo foi desenhado para densidade e manutenção visual:

- Cards menores para exibir mais projetos por linha.
- Thumbnails pequenos para evitar destacar ícones ou imagens de baixa resolução.
- Busca global instantânea.
- Filtros rápidos por categoria.
- Painel avançado recolhível com linguagem, categoria, status, visibilidade, maturidade e plataforma.
- Estatísticas aparecem somente nesta página.
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
- Formação, experiência, social e docs.

## Observações de design e produto

Este portfólio não é uma landing page comercial tradicional. Ele funciona como uma base pública de conhecimento e apresentação técnica. Por isso, o design evita seções promocionais longas, heróis exagerados e cards decorativos em excesso.

A prioridade é o visitante encontrar rapidamente:

- quem é o autor;
- quais projetos existem;
- quais projetos estão revisados;
- quais tecnologias aparecem no histórico;
- onde acessar links públicos relevantes.

O resultado esperado é um site fácil de manter, visualmente limpo e preparado para crescer com novos projetos sem exigir alterações frequentes no código.

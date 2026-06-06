# sevenleo.github.io

Portfólio pessoal em formato de catálogo dinâmico de projetos.

## Manutenção

Cada projeto fica em `public/content/projects/<slug>/project.json`.

- Com `contentReviewedAt`: o projeto aparece completo no catálogo e na página individual.
- Sem `contentReviewedAt`: o projeto continua público, mas aparece com a badge `Sem revisão` e mostra apenas nome/link.
- Assets do projeto devem ficar na própria pasta do projeto.

## Comandos

```bash
npm install
npm run content:index
npm run dev
npm run build
```

O build executa a geração do manifesto automaticamente.

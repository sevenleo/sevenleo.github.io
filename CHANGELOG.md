# CHANGELOG

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

## [2.1.0] - 2026-06-06

### Adicionado
- Comportamento de sanfona (accordion) nas seções de "Linguagens", "Tecnologias" e "Categorias" na página de Tecnologias (`#/technologies`), iniciando fechadas e abrindo ao clique.
- Efeito de transição e estilo específico no arquivo `src/styles.css` para as seções de acordeão (`.tech-index-section`, `.tech-index-trigger`, `.tech-index-title` e `.tech-index-arrow`).
- Hook `useEffect` na página `ProjectDetailPage` (`src/App.tsx`) para rolar a janela do navegador automaticamente para o topo (`window.scrollTo(0, 0)`) sempre que um projeto individual for aberto ou alterado.
- Caso específico para o ícone do LinkedIn (`type === 'linkedin'`) no componente `SocialIcon` (`src/App.tsx`) para renderizar o logo oficial do LinkedIn em formato SVG monocromático branco com suporte a cor dinâmica (`stroke="currentColor"`).
- Script utilitário [update.bat](file:///d:/GITHUB/sevenleo.github.io/update.bat) para automatizar a atualização do manifesto de conteúdo no Windows.

### Alterado
- Botões de links externos (`LinkButton` em `src/App.tsx`) agora abrem explicitamente em uma nova aba usando os atributos `target="_blank"` e `rel="noopener noreferrer"`.
- Atualizados os arquivos [README.md](file:///d:/GITHUB/sevenleo.github.io/README.md) e [DESIGNER.md](file:///d:/GITHUB/sevenleo.github.io/DESIGNER.md) para documentar a nova funcionalidade de sanfona (accordion) na página de Tecnologias.

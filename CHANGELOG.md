# CHANGELOG

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

## [2.1.0] - 2026-06-06

### Adicionado
- Comportamento de sanfona (accordion) nas seções de "Linguagens", "Tecnologias" e "Categorias" na página de Tecnologias (`#/technologies`), iniciando fechadas e abrindo ao clique.
- Efeito de transição e estilo específico no arquivo `src/styles.css` para as seções de acordeão (`.tech-index-section`, `.tech-index-trigger`, `.tech-index-title` e `.tech-index-arrow`).
- Hook `useEffect` na página `ProjectDetailPage` (`src/App.tsx`) para rolar a janela do navegador automaticamente para o topo (`window.scrollTo(0, 0)`) sempre que um projeto individual for aberto ou alterado.
- Caso específico para o ícone do LinkedIn (`type === 'linkedin'`) no componente `SocialIcon` (`src/App.tsx`) para renderizar o logo oficial do LinkedIn em formato SVG monocromático branco com suporte a cor dinâmica (`stroke="currentColor"`).
- Script utilitário [update.bat](file:///d:/GITHUB/sevenleo.github.io/update.bat) para automatizar a atualização do manifesto de conteúdo no Windows.
- Controles de visualização de projetos (Densidade: modo compacto vs. normal; Layout: Galeria Cheia, Galeria Vazia, e Lista) usando switch e seletores de ícones discretos na página de projetos.
- Estilos e classes específicas para visualizações alternativas de projetos no arquivo [src/styles.css](file:///d:/GITHUB/sevenleo.github.io/src/styles.css) (`.toggle-switch`, `.view-mode-selector`, `.project-list`, `.project-card-list` e `.project-card-compact`).

### Alterado
- Botões de links externos (`LinkButton` em `src/App.tsx`) agora abrem explicitamente em uma nova aba usando os atributos `target="_blank"` e `rel="noopener noreferrer"`.
- Barra de pesquisa e botões de filtro no catálogo de projetos compactados de 44px para 36px de altura.
- Atualizados os arquivos [README.md](file:///d:/GITHUB/sevenleo.github.io/README.md) e [DESIGNER.md](file:///d:/GITHUB/sevenleo.github.io/DESIGNER.md) para refletir os modos de visualização, remoção de estatísticas e novas dimensões.

### Removido
- Painel de estatísticas (`catalog-stats`) e texto secundário descritivo do cabeçalho na página de projetos.

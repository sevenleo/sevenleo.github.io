# CHANGELOG

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

## [2.5.0] - 2026-06-07

### Adicionado
- Adicionado botão de menu flutuante (`mobile-menu-toggle`) posicionado de forma fixa no canto superior direito no mobile para abrir/fechar a barra lateral.

### Alterado
- Removido o cabeçalho superior mobile (`mobile-header`) e todos os botões não funcionais (dark mode e configurações).
- Modificada a barra lateral no mobile para exibir todos os textos e labels imediatamente ao abrir, sem depender de interações de hover/toque do usuário.
- Configurada a barra lateral com altura fixa em `100vh` e suporte a rolagem vertical (`overflow-y: auto`), com barra de rolagem oculta para prevenir que itens do menu ou o botão de contato inferior sejam cortados em telas pequenas ou teclados virtuais.
- Otimizadas as linhas do tempo em Formação Acadêmica e Experiência Profissional no mobile: as margens, preenchimentos e marcadores de nós (dots) foram removidos nesta versão para que os cards ocupem toda a largura horizontal útil do dispositivo móvel.

## [2.4.0] - 2026-06-06

### Alterado
- Corrigida a lógica de status na página de Formação Acadêmica: o curso mais recente agora segue fielmente o status cadastrado no JSON (por exemplo, "CONCLUÍDO"), em vez de ser forçado incorretamente como "EM PROGRESSO".
- Removido o filtro preto e branco (escala de cinza) da foto de perfil na página inicial.
- Modificada a visualização de projetos em modo compacto: os elementos do cabeçalho (ícone de pasta, categoria e título) passam a empilhar verticalmente em linhas independentes, prevenindo estouro de layout horizontal.
- Atualizada a página de Redes Sociais para renderizar os ícones originais e monocromáticos em SVG do GitHub e LinkedIn.
- Ajustada a centralização de todos os ícones da barra lateral no modo colapsado (incluindo balanceamento com borda indicadora transparente à direita), alinhando-se automaticamente à esquerda quando a barra é expandida.
- Refatorado o botão "Contato" na barra lateral: adicionado estilo específico com classes de contraste corretas (cor de texto escura em fundo ciano) e largura flexível com `overflow: hidden` para evitar quebra de layout quando colapsado.
- Adicionada a opção de inserir `tags` personalizadas no JSON da Experiência Profissional, exibindo chips dinamicamente na timeline (ocultando-os caso não estejam definidos).
- Atualizada a página de Histórico Acadêmico para renderizar os itens do array `highlights` diretamente como chips de tags, removendo o parágrafo descritivo anterior em prol de uma interface limpa.
- Ajustada a centralização do logotipo de cabeçalho "LN" na barra lateral para ficar centralizado no modo colapsado e alinhar à esquerda quando expandido.

### Removido
- Removida por completo a página de documentação ("Docs") e suas rotas de navegação associadas.

## [2.3.0] - 2026-06-06

### Alterado
- Tradução completa da interface para o português nas páginas de Formação (Academic History), Experiência (Professional Experience), Social (Connect & Collaborate) e Docs (Architecture & Maintenance Guidelines).
- Remoção da linha vertical cinza que conectava os nós da linha do tempo (timeline) nas páginas de Formação e Experiência.
- Remoção da linha divisória inferior horizontal no cabeçalho da página de Formação.
- Ajuste na página de Tecnologias: redução do tamanho de fonte das tags de projetos associados para `10px` e padding interno para `2px 6px` para evitar que os textos toquem as bordas dos cards e melhorar a hierarquia tipográfica com os títulos (`16px`, bold).
- Exibição de imagem de capa real (com opacidade reduzida a `0.5`) no espaço de ícones para projetos não revisados em modo não-compacto, caindo de volta para o ícone de pasta padrão se nenhuma imagem existir.

## [2.2.0] - 2026-06-06

### Adicionado
- Integração completa do conceito visual "Minimalist-Technical" de alta fidelidade em todas as telas (Home, Projetos, Tecnologias, Formação, Experiência, Redes Sociais e Docs).
- Layout de documentação dividido (`.docs-page-layout`) com barra de navegação rápida (Table of Contents) flutuante e interativa à direita, com rastreamento ativo de scroll.
- Bloco de código JSON com destaque de sintaxe, cabeçalho de terminal e funcionalidade interativa de copiar texto (`COPY`) no Docs.
- Grid assimétrico estilo Bento para os links de redes sociais e container de aviso PGP.
- Conjunto de classes de utilidade utilitárias no CSS (`src/styles.css`) emulando propriedades essenciais do Tailwind (flexbox, grid responsivo, margens, paddings, posições absolutas e relativas, timelines de histórico com bolinhas de progresso e ícones).
- Congelamento da interface exclusivamente no tema escuro, removendo alternâncias desnecessárias e garantindo alto contraste técnico.

### Alterado
- Grade de 6 colunas ajustada para reduzir de forma totalmente responsiva (6 colunas no desktop largo, 3 colunas em telas médias e 1 coluna em telas de smartphones).

## [2.1.0] - 2026-06-06

### Adicionado
- Comportamento de sanfona (accordion) nas seções de "Linguagens", "Tecnologias" e "Categorias" na página de Tecnologias (`#/technologies`), iniciando fechadas e abrindo ao clique.
- Efeito de transição e estilo específico no arquivo `src/styles.css` para as seções de acordeão (`.tech-index-section`, `.tech-index-trigger`, `.tech-index-title` e `.tech-index-arrow`).
- Hook `useEffect` na página `ProjectDetailPage` (`src/App.tsx`) para rolar a janela do navegador automaticamente para o topo (`window.scrollTo(0, 0)`) sempre que um projeto individual for aberto ou alterado.
- Caso específico para o ícone do LinkedIn (`type === 'linkedin'`) no componente `SocialIcon` (`src/App.tsx`) para renderizar o logo oficial do LinkedIn em formato SVG monocromático branco com suporte a cor dinâmica (`stroke="currentColor"`).
- Script utilitário [update.bat](file:///d:/GITHUB/sevenleo.github.io/update.bat) para automatizar a atualização do manifesto de conteúdo no Windows.
- Script utilitário [run.bat](file:///d:/GITHUB/sevenleo.github.io/run.bat) para iniciar o servidor de desenvolvimento local no Windows.
- Controles de visualização de projetos (Densidade: modo compacto vs. normal; Layout: opções de 3, 4 ou 6 colunas por linha ou visualização em Lista) usando switch e seletores de ícones de colunas na página de projetos.
- Estilos e classes específicas para visualizações alternativas de projetos no arquivo [src/styles.css](file:///d:/GITHUB/sevenleo.github.io/src/styles.css) (`.toggle-switch`, `.view-mode-selector`, `.project-list`, `.project-card-list` e `.project-card-compact`).

### Alterado
- Botões de links externos (`LinkButton` em `src/App.tsx`) agora abrem explicitamente em uma nova aba usando os atributos `target="_blank"` e `rel="noopener noreferrer"`.
- Barra de pesquisa e botões de filtro no catálogo de projetos compactados de 44px para 36px de altura.
- O botão "Detalhes" agora exibe apenas o texto explicativo, sem o ícone anterior.
- O modo compacto agora oculta também o botão "Abrir" nos cards, exibindo apenas o botão "Detalhes".
- A visualização em Lista agora oculta as descrições/resumos dos projetos.
- Atualizados os arquivos [README.md](file:///d:/GITHUB/sevenleo.github.io/README.md) e [DESIGNER.md](file:///d:/GITHUB/sevenleo.github.io/DESIGNER.md) para refletir os modos de visualização, remoção de estatísticas e novas dimensões.

### Removido
- Painel de estatísticas (`catalog-stats`) e texto secundário descritivo do cabeçalho na página de projetos.

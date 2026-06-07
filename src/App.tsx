import {
  ArrowLeft,
  BookOpen,
  Boxes,
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  Code2,
  ExternalLink,
  FileJson,
  Filter,
  Github,
  GraduationCap,
  Grid,
  Home,
  Inbox,
  Layers3,
  LayoutGrid,
  Link as LinkIcon,
  List,
  Mail,
  Menu,
  PackageOpen,
  Search,
  Shuffle,
  Sparkles,
  Tags,
  UserRound,
  X,
} from 'lucide-react';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import type { Badge, PortfolioIndex, PortfolioManifest, Project } from './types';

type Route =
  | { page: 'home' }
  | { page: 'projects'; slug?: string }
  | { page: 'technologies' }
  | { page: 'education' }
  | { page: 'experience' }
  | { page: 'social' };

const navItems = [
  { path: '/', label: 'Início', icon: Home },
  { path: '/projects', label: 'Projetos', icon: Boxes },
  { path: '/technologies', label: 'Tecnologias', icon: Code2 },
  { path: '/education', label: 'Formação', icon: GraduationCap },
  { path: '/experience', label: 'Experiência', icon: BriefcaseBusiness },
  { path: '/social', label: 'Social', icon: UserRound },
];

const statusLabel: Record<string, string> = {
  active: 'Ativo',
  stable: 'Estável',
  'in-development': 'Em desenvolvimento',
  experimental: 'Experimental',
  paused: 'Pausado',
  discontinued: 'Descontinuado',
  archived: 'Arquivado',
  draft: 'Rascunho',
};

const maturityLabel: Record<string, string> = {
  draft: 'Rascunho',
  mvp: 'MVP',
  stable: 'Estável',
  production: 'Produção',
  legacy: 'Legado',
  continuous: 'Contínuo',
  experimental: 'Experimental',
};

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const parts = raw.split('/').filter(Boolean);

  if (parts[0] === 'projects') return { page: 'projects', slug: parts[1] };
  if (parts[0] === 'technologies') return { page: 'technologies' };
  if (parts[0] === 'education') return { page: 'education' };
  if (parts[0] === 'experience') return { page: 'experience' };
  if (parts[0] === 'social') return { page: 'social' };
  return { page: 'home' };
}

function navigate(path: string) {
  window.location.hash = path;
}

function formatDate(value: string) {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function normalize(value: string) {
  return value.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function externalTarget(url: string) {
  return url.startsWith('http') ? '_blank' : undefined;
}

function BadgePill({ badge }: { badge: Badge }) {
  return <span className={`badge badge-${badge.tone}`}>{badge.label}</span>;
}

function LinkButton({
  href,
  children,
  icon,
  variant = 'primary',
}: {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}) {
  return (
    <a className={`button button-${variant}`} href={href} target="_blank" rel="noopener noreferrer">
      {icon}
      <span>{children}</span>
    </a>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="empty-state">
      <PackageOpen size={32} />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function SectionHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <header className="section-header">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </header>
  );
}

function ProjectCover({ project }: { project: Project }) {
  if (!project.cover) {
    return (
      <div className="project-cover project-cover-empty">
        <Code2 size={34} />
      </div>
    );
  }
  return <img className="project-cover" src={project.cover} alt={project.title} loading="lazy" />;
}

function SocialIcon({ type, size = 18 }: { type: string; size?: number }) {
  if (type === 'github') return <Github size={size} />;
  if (type === 'email') return <Mail size={size} />;
  if (type === 'linkedin') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-linkedin"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }
  return <ExternalLink size={size} />;
}

function getCategoryIcon(category: string, title: string): string {
  const cat = category.toLowerCase();
  const t = title.toLowerCase();
  if (cat.includes('architecture') || cat.includes('infra') || t.includes('bus') || t.includes('router') || t.includes('nexus')) return 'data_object';
  if (cat.includes('ui') || cat.includes('component') || cat.includes('frontend') || t.includes('core')) return 'dashboard';
  if (cat.includes('pipeline') || cat.includes('data') || cat.includes('telemetry') || t.includes('aggregator')) return 'query_stats';
  if (cat.includes('experiment') || cat.includes('science') || t.includes('wasm') || t.includes('processor')) return 'science';
  if (cat.includes('security') || cat.includes('auth')) return 'lock';
  if (cat.includes('database') || cat.includes('store')) return 'database';
  return 'folder';
}

function ProjectCard({
  project,
  isCompact,
  hideCover,
  isList,
}: {
  project: Project;
  isCompact: boolean;
  hideCover: boolean;
  isList: boolean;
}) {
  const isReviewed = project.contentReviewed;
  const iconName = getCategoryIcon(project.category, project.title);
  
  const isLime = project.category.toLowerCase().includes('ui') || 
                 project.category.toLowerCase().includes('component') || 
                 project.category.toLowerCase().includes('frontend') || 
                 project.title.toLowerCase().includes('core');

  const accentColorClass = isLime ? 'text-secondary-fixed' : 'text-primary-fixed-dim';

  if (isCompact) {
    return (
      <article className={`project-card project-card-compact ${isList ? 'project-card-list' : ''}`} style={{ minHeight: 'auto', padding: '16px' }}>
        <div className="compact-title-row" onClick={() => navigate(`/projects/${project.slug}`)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
          <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '18px' }}>folder</span>
          <span className="font-label-caps text-label-caps text-text-muted">{project.category}</span>
          <h3 className="font-headline-md text-[15px] text-text-primary hover:text-primary-fixed-dim transition-colors" style={{ margin: 0 }}>{project.title}</h3>
          {!isReviewed && <span className="badge badge-warning" style={{ textTransform: 'uppercase', fontFamily: 'JetBrains Mono', fontSize: '10px', padding: '2px 6px', height: 'auto', minHeight: 'auto' }}>Sem revisão</span>}
        </div>
        <div className="card-actions-row" style={{ border: 0, padding: 0, marginTop: '12px' }}>
          <button className="font-label-caps text-label-caps text-primary-fixed-dim flex items-center gap-1 hover:underline" type="button" onClick={() => navigate(`/projects/${project.slug}`)} style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }}>
            <span>Detalhes</span>
            <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
          </button>
        </div>
      </article>
    );
  }

  if (!isReviewed) {
    return (
      <article className={`project-card project-card-basic ${isList ? 'project-card-list' : ''}`} style={{ minHeight: '220px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <div className="absolute top-4 right-4 border border-status-unreviewed text-status-unreviewed font-label-caps text-[10px] px-2 py-0.5 rounded-sm bg-status-unreviewed/10">
          Sem revisão
        </div>
        <div className="project-card-top" style={{ marginTop: '24px' }}>
          <div className="category-icon-box" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
            {project.cover ? (
              <img src={project.cover} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
            ) : (
              <span className="material-symbols-outlined text-[20px] text-text-muted">folder</span>
            )}
          </div>
          <div className="card-title-row">
            <span>Experimento</span>
            <h3 className="opacity-80" style={{ cursor: 'pointer' }} onClick={() => navigate(`/projects/${project.slug}`)}>{project.title}</h3>
          </div>
        </div>
        <div style={{ flexGrow: 1 }}></div>
        <div className="border-t border-border-subtle pt-4 mt-4 opacity-50 flex justify-end items-center w-full">
          <button className="font-label-caps text-label-caps text-text-muted flex items-center gap-1 hover:text-text-primary transition-colors" type="button" onClick={() => navigate(`/projects/${project.slug}`)} style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }}>
            <span>Detalhes</span>
            <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
          </button>
        </div>
      </article>
    );
  }

  const isTelemetry = project.title.toLowerCase().includes('telemetry') || project.title.toLowerCase().includes('aggregator');

  return (
    <article className={`project-card ${isList ? 'project-card-list' : ''} ${isTelemetry && !isList ? 'md:col-span-2 xl:col-span-1 overflow-hidden' : ''}`} style={{ padding: isTelemetry && !isList ? '0' : '24px' }}>
      {isTelemetry && !isList && (
        <div className="h-32 w-full bg-surface-container-highest border-b border-border-subtle relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed-dim/20 to-transparent"></div>
          <span className="material-symbols-outlined text-5xl text-primary-fixed-dim opacity-50 z-10">query_stats</span>
        </div>
      )}
      <div className="flex flex-col flex-1" style={{ padding: isTelemetry && !isList ? '24px' : '0' }}>
        <button className="project-card-click" type="button" onClick={() => navigate(`/projects/${project.slug}`)}>
          <div className="project-card-top">
            <div className="category-icon-box" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {project.cover ? (
                <img src={project.cover} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
              ) : (
                <span className="material-symbols-outlined text-[24px] text-text-muted">folder</span>
              )}
            </div>
            <div className="card-title-row">
              <span>{project.category}</span>
              <h3>{project.title}</h3>
            </div>
          </div>
          <div className="project-card-body" style={{ padding: 0 }}>
            {!isList && <p style={{ marginBottom: '8px' }}>{project.shortSummary}</p>}
            <div className="badge-row">
              {project.badges.slice(0, 4).map((badge, index) => (
                <BadgePill key={`${project.slug}-${badge.label}-${index}`} badge={badge} />
              ))}
            </div>
          </div>
        </button>
        
        <div className="border-t border-border-subtle pt-4 mt-4 flex items-center justify-end w-full" style={{ marginTop: 'auto' }}>
          {project.status === 'archived' ? (
            <button className="font-label-caps text-label-caps text-text-muted flex items-center gap-1 hover:text-text-primary transition-colors" type="button" onClick={() => navigate(`/projects/${project.slug}`)} style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }}>
              <span>Ver Arquivo</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          ) : (
            <button className="font-label-caps text-label-caps text-primary-fixed-dim flex items-center gap-1 hover:underline" type="button" onClick={() => navigate(`/projects/${project.slug}`)} style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }}>
              <span>Detalhes</span>
              <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function HomePage({ manifest }: { manifest: PortfolioManifest }) {
  const randomCandidates = manifest.projects.filter(
    (project) => project.contentReviewed && project.visibility !== 'private',
  );

  const openRandomProject = () => {
    if (!randomCandidates.length) return;
    const selected = randomCandidates[Math.floor(Math.random() * randomCandidates.length)];
    navigate(`/projects/${selected.slug}`);
  };

  return (
    <div className="home-page">
      {/* Radial Atmospheric glow behind portrait */}
      <div className="home-radial-glow"></div>

      <div className="home-container">
        {/* Profile photo with glow border & status indicator dot */}
        <div className="home-avatar-wrap">
          <div className="home-avatar-inner">
            <img className="home-avatar-img" src={manifest.profile.photo} alt={manifest.profile.name} />
          </div>
          <div className="home-status-dot"></div>
        </div>

        {/* Name and Professional Title Badge */}
        <div>
          <h1 className="home-title">{manifest.profile.name}</h1>
          <div className="role-badge">
            <span className="material-symbols-outlined text-[14px]">code_blocks</span>
            <span>{manifest.profile.role}</span>
          </div>
          
          <p className="home-bio">{manifest.profile.summary}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <button className="button button-primary px-6 py-3" type="button" onClick={() => navigate('/projects')}>
            <span>Ver Catálogo de Projetos</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <button className="button button-secondary px-6 py-3" type="button" onClick={openRandomProject}>
            <span className="material-symbols-outlined text-[18px]">shuffle</span>
            <span>Explorar Projeto Aleatório</span>
          </button>
        </div>
      </div>

      <footer className="home-social-footer mt-16" aria-label="Contatos e redes sociais" style={{ borderTop: 0, padding: 0 }}>
        {manifest.profile.socials.map((social) => (
          <a
            key={social.url}
            href={social.url}
            target={externalTarget(social.url)}
            rel="noreferrer"
            title={social.label}
            aria-label={social.label}
            className="flex items-center justify-center rounded-lg border border-border-subtle bg-surface-container-low w-10 h-10 hover:border-primary-fixed-dim hover:text-primary-fixed-dim hover:bg-primary-fixed-dim/10 transition-all"
            style={{ padding: 0 }}
          >
            <SocialIcon type={social.type} size={20} />
          </a>
        ))}
      </footer>
    </div>
  );
}

function ProjectsPage({ manifest }: { manifest: PortfolioManifest }) {
  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [viewMode, setViewMode] = useState<'3-cols' | '4-cols' | '6-cols' | 'list'>('4-cols');
  const [filters, setFilters] = useState({
    language: '',
    category: '',
    status: '',
    visibility: '',
    maturity: '',
    platform: '',
  });

  const options = useMemo(() => ({
    language: unique(manifest.projects.flatMap((project) => project.languages)),
    category: unique(manifest.projects.map((project) => project.category)),
    status: unique(manifest.projects.map((project) => project.status)),
    visibility: unique(manifest.projects.map((project) => project.visibility)),
    maturity: unique(manifest.projects.map((project) => project.maturity)),
    platform: unique(manifest.projects.flatMap((project) => project.platforms)),
  }), [manifest.projects]);

  const quickCategories = options.category.filter((category) => category !== 'Sem revisão').slice(0, 6);

  const filtered = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    return manifest.projects.filter((project) => {
      const matchesQuery = !normalizedQuery || normalize(`${project.title} ${project.searchText}`).includes(normalizedQuery);
      return (
        matchesQuery &&
        (!filters.language || project.languages.includes(filters.language)) &&
        (!filters.category || project.category === filters.category) &&
        (!filters.status || project.status === filters.status) &&
        (!filters.visibility || project.visibility === filters.visibility) &&
        (!filters.maturity || project.maturity === filters.maturity) &&
        (!filters.platform || project.platforms.includes(filters.platform))
      );
    });
  }, [filters, manifest.projects, query]);

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setQuery('');
    setFilters({ language: '', category: '', status: '', visibility: '', maturity: '', platform: '' });
  };

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Catálogo"
        title="Projetos"
      />

      <section className="catalog-controls">
        <label className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar projeto, tecnologia, categoria ou tag"
          />
        </label>
        <button className="button button-secondary" type="button" onClick={() => setFiltersOpen((value) => !value)}>
          <Filter size={16} />
          <span>Filtros</span>
        </button>
        <button className="button button-ghost" type="button" onClick={clearFilters}>
          <X size={16} />
          <span>Limpar</span>
        </button>

        <div className="catalog-customizer">
          <label className="toggle-switch" title="Ocultar capas, resumos e tags">
            <input
              type="checkbox"
              checked={isCompact}
              onChange={(e) => setIsCompact(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Compacto</span>
          </label>

          <div className="view-mode-selector">
            <button
              className={`icon-button-small ${viewMode === '3-cols' ? 'active' : ''}`}
              type="button"
              title="3 Colunas"
              onClick={() => setViewMode('3-cols')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                <rect x="2" y="3" width="5" height="18" rx="1" />
                <rect x="9" y="3" width="5" height="18" rx="1" />
                <rect x="16" y="3" width="5" height="18" rx="1" />
              </svg>
            </button>
            <button
              className={`icon-button-small ${viewMode === '4-cols' ? 'active' : ''}`}
              type="button"
              title="4 Colunas"
              onClick={() => setViewMode('4-cols')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                <rect x="2" y="3" width="4" height="18" rx="1" />
                <rect x="7.5" y="3" width="4" height="18" rx="1" />
                <rect x="13" y="3" width="4" height="18" rx="1" />
                <rect x="18.5" y="3" width="4" height="18" rx="1" />
              </svg>
            </button>
            <button
              className={`icon-button-small ${viewMode === '6-cols' ? 'active' : ''}`}
              type="button"
              title="6 Colunas"
              onClick={() => setViewMode('6-cols')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                <rect x="2" y="3" width="2.5" height="18" rx="0.5" />
                <rect x="5.5" y="3" width="2.5" height="18" rx="0.5" />
                <rect x="9" y="3" width="2.5" height="18" rx="0.5" />
                <rect x="12.5" y="3" width="2.5" height="18" rx="0.5" />
                <rect x="16" y="3" width="2.5" height="18" rx="0.5" />
                <rect x="19.5" y="3" width="2.5" height="18" rx="0.5" />
              </svg>
            </button>
            <button
              className={`icon-button-small ${viewMode === 'list' ? 'active' : ''}`}
              type="button"
              title="Lista"
              onClick={() => setViewMode('list')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section className="quick-filter-row" aria-label="Filtros rápidos por categoria">
        <button className={!filters.category ? 'active' : ''} type="button" onClick={() => updateFilter('category', '')}>
          Todos
        </button>
        {quickCategories.map((category) => (
          <button
            key={category}
            className={filters.category === category ? 'active' : ''}
            type="button"
            onClick={() => updateFilter('category', category)}
          >
            {category}
          </button>
        ))}
        <button
          className={filters.category === 'Sem revisão' ? 'active warning' : 'warning'}
          type="button"
          onClick={() => updateFilter('category', filters.category === 'Sem revisão' ? '' : 'Sem revisão')}
        >
          Sem revisão
        </button>
      </section>

      {filtersOpen ? (
        <section className="filters-panel" aria-label="Filtros avançados de projetos">
          <div className="filters-grid">
            {([
              ['language', 'Linguagem', options.language],
              ['category', 'Categoria', options.category],
              ['status', 'Status', options.status],
              ['visibility', 'Visibilidade', options.visibility],
              ['maturity', 'Maturidade', options.maturity],
              ['platform', 'Plataforma', options.platform],
            ] as const).map(([key, label, values]) => (
              <label key={key}>
                <span>{label}</span>
                <select value={filters[key]} onChange={(event) => updateFilter(key, event.target.value)}>
                  <option value="">Todos</option>
                  {values.map((value) => (
                    <option key={value} value={value}>
                      {statusLabel[value] || maturityLabel[value] || value}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </section>
      ) : null}

      <div className="result-count">
        <Filter size={16} />
        <span>{filtered.length} projeto(s) encontrados</span>
      </div>

      {filtered.length ? (
        <section className={viewMode === 'list' ? 'project-list' : `project-grid grid-${viewMode}`}>
          {filtered.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              isCompact={isCompact}
              hideCover={isCompact}
              isList={viewMode === 'list'}
            />
          ))}
        </section>
      ) : (
        <EmptyState title="Nenhum projeto encontrado" text="Ajuste a busca ou remova filtros combinados." />
      )}
    </div>
  );
}

function ProjectDetailPage({ manifest, slug }: { manifest: PortfolioManifest; slug: string }) {
  const project = manifest.projects.find((item) => item.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return <EmptyState title="Projeto não encontrado" text="A rota não corresponde a nenhum projeto cadastrado." />;
  }

  if (!project.contentReviewed) {
    return (
      <div className="page-stack">
        <button className="button button-ghost button-fit" type="button" onClick={() => navigate('/projects')}>
          <ArrowLeft size={16} />
          <span>Voltar</span>
        </button>
        <section className="basic-detail">
          <span className="badge badge-warning">Sem revisão</span>
          <h1>{project.title}</h1>
          {project.primaryLink ? (
            <LinkButton href={project.primaryLink.url} icon={<ExternalLink size={16} />}>
              {project.primaryLink.label}
            </LinkButton>
          ) : null}
        </section>
      </div>
    );
  }

  const primaryUrl = project.primaryLink?.url;
  const secondaryLinks = [...new Map(
    project.links
      .filter((link) => !primaryUrl || link.url !== primaryUrl)
      .map((link) => [link.url, link]),
  ).values()];
  const extraGallery = project.gallery.filter((image) => image.src !== project.cover);
  const historyItems = [
    ...project.versions.map((version) => ({
      date: version.date || '',
      title: `${version.version}${version.summary ? `: ${version.summary}` : ''}`,
    })),
    ...project.timeline,
  ];

  return (
    <div className="page-stack">
      <button className="button button-ghost button-fit" type="button" onClick={() => navigate('/projects')}>
        <ArrowLeft size={16} />
        <span>Voltar</span>
      </button>

      <section className="project-hero">
        <ProjectCover project={project} />
        <div>
          <div className="badge-row">
            {project.badges.map((badge, index) => (
              <BadgePill key={`${project.slug}-${badge.label}-${index}`} badge={badge} />
            ))}
          </div>
          <h1>{project.title}</h1>
          <p>{project.shortSummary}</p>
          <div className="hero-actions">
            {project.primaryLink ? (
              <LinkButton href={project.primaryLink.url} icon={<ExternalLink size={16} />}>
                {project.primaryLink.label}
              </LinkButton>
            ) : null}
          </div>
        </div>
      </section>

      <section className="project-detail-grid">
        <article className="detail-panel detail-panel-wide">
          <SectionHeader eyebrow="Resumo" title="Apresentação" />
          <p className="prose">{project.description}</p>
        </article>
        <article className="detail-panel">
          <SectionHeader eyebrow="Valor" title="Contexto do projeto" />
          <div className="fact-list">
            <div>
              <span>Público-alvo</span>
              <p>{project.audience}</p>
            </div>
            <div>
              <span>Problema</span>
              <p>{project.problem}</p>
            </div>
            <div>
              <span>Objetivo</span>
              <p>{project.goal}</p>
            </div>
          </div>
        </article>
      </section>

      <section className="detail-panel">
        <SectionHeader eyebrow="Stack" title="Tecnologias utilizadas" />
        <div className="chip-row">
          {[...project.languages, ...project.technologies, ...project.tags].map((item) => (
            <span className="chip" key={item}>{item}</span>
          ))}
        </div>
      </section>

      {extraGallery.length ? (
        <section className="detail-panel">
          <SectionHeader eyebrow="Mídia" title="Galeria" />
          <div className="gallery-grid">
            {extraGallery.map((image) => (
              <img key={image.src} src={image.src} alt={image.alt} loading="lazy" />
            ))}
          </div>
        </section>
      ) : null}

      {secondaryLinks.length || historyItems.length ? (
        <section className="project-detail-grid">
          {secondaryLinks.length ? (
            <article className="detail-panel">
              <SectionHeader eyebrow="Acesso" title="Links externos" />
              <div className="link-list">
                {secondaryLinks.map((link) => (
                  <LinkButton key={`${link.label}-${link.url}`} href={link.url} icon={<LinkIcon size={16} />} variant="secondary">
                    {link.label}
                  </LinkButton>
                ))}
              </div>
            </article>
          ) : null}
          {historyItems.length ? (
            <article className="detail-panel">
              <SectionHeader eyebrow="Histórico" title="Versões e marcos" />
              <div className="timeline-list">
                {historyItems.map((item, index) => (
                  <div className="timeline-item static" key={`${item.title}-${index}`}>
                    <span>{formatDate(item.date)}</span>
                    <h3>{item.title}</h3>
                  </div>
                ))}
              </div>
            </article>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function TechnologiesPage({ manifest }: { manifest: PortfolioManifest }) {
  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Índice técnico"
        title="Linguagens, stacks e categorias"
        text="Cada item funciona como um mapa rápido para os projetos vinculados."
      />
      <IndexSection title="Linguagens" indexes={manifest.indexes.languages} manifest={manifest} iconName="code" />
      <IndexSection title="Tecnologias & Frameworks" indexes={manifest.indexes.technologies} manifest={manifest} iconName="memory" />
      <IndexSection title="Categorias & Domínios" indexes={manifest.indexes.categories} manifest={manifest} iconName="category" />
    </div>
  );
}

function IndexSection({
  title,
  indexes,
  manifest,
  iconName,
}: {
  title: string;
  indexes: PortfolioIndex[];
  manifest: PortfolioManifest;
  iconName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="border border-border-subtle rounded-lg bg-surface-container-lowest overflow-hidden mb-4">
      <button
        className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container transition-colors"
        style={{ border: 0, cursor: 'pointer', textAlign: 'left', outline: 'none' }}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontSize: '24px' }}>{iconName}</span>
          <h2 className="font-headline-md text-[20px] text-on-surface" style={{ margin: 0 }}>{title}</h2>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          expand_more
        </span>
      </button>
      
      {isOpen && (
        <div className="p-6 border-t border-border-subtle bg-surface-container-lowest">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {indexes.map((index) => (
              <div className="bg-surface-container border border-border-subtle rounded-lg p-5 hover-glow transition-all flex flex-col" key={index.name}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-headline-md text-[16px] font-bold text-on-surface" style={{ margin: 0 }}>{index.name}</h3>
                  <span className="font-label-caps text-[10px] text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded border border-border-subtle">
                    {index.projectSlugs.length} Projetos
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {index.projectSlugs.map((slug) => {
                    const project = manifest.projects.find((item) => item.slug === slug);
                    return project ? (
                      <button
                        key={slug}
                        type="button"
                        onClick={() => navigate(`/projects/${slug}`)}
                        className="font-label-sm text-label-sm px-2 py-1 bg-surface-container-high rounded-full border border-border-subtle text-on-surface hover:text-primary-fixed-dim hover:border-primary-fixed-dim transition-colors"
                        style={{ cursor: 'pointer', fontSize: '10px', padding: '2px 6px' }}
                      >
                        {project.title}
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function getEducationTags(title: string): string[] {
  const t = title.toLowerCase();
  if (t.includes('m.sc') || t.includes('mestrado') || t.includes('master')) return ['Distributed Systems', 'Machine Learning', 'Go'];
  if (t.includes('b.sc') || t.includes('bacharel') || t.includes('computer science') || t.includes('software engineering')) return ['Software Architecture', 'Java', 'Algorithms'];
  if (t.includes('aws') || t.includes('solutions architect')) return ['Cloud Architecture', 'AWS'];
  return ['Education', 'Tech Training'];
}

function EducationPage({ manifest }: { manifest: PortfolioManifest }) {
  return (
    <div className="page-stack">
      <header className="mb-12">
        <h1 className="font-display text-display text-primary mb-2">Histórico Acadêmico</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Uma visão cronológica da formação acadêmica, aprendizado contínuo e certificações técnicas.
        </p>
      </header>

      {/* Timeline Layout */}
      <div 
        className="relative ml-4 md:ml-8 space-y-12 pb-12"
        style={{
          borderLeftWidth: '0px',
          position: 'relative'
        }}
      >
        {manifest.education.map((item, index) => {
          const tags = getEducationTags(item.title);
          const isCurrent = item.status === 'in-progress' || item.period.toLowerCase().includes('present') || item.period.toLowerCase().includes('progresso') || item.period.toLowerCase().includes('atual');

          return (
            <div className="relative pl-8 md:pl-12" key={item.title}>
              {/* Timeline dot marker */}
              {isCurrent ? (
                <div 
                  className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full bg-primary-fixed-dim border-4 border-[#131313] shadow-[0_0_8px_rgba(0,220,229,0.4)]"
                  style={{ zIndex: 10 }}
                ></div>
              ) : (
                <div 
                  className="absolute -left-2 top-1.5 w-4 h-4 rounded-full bg-surface-container-highest border-2 border-border-subtle"
                  style={{ zIndex: 10 }}
                ></div>
              )}

              {/* Card content */}
              <div className="bg-surface-container p-5 rounded-lg border border-border-subtle hover:bg-surface-container-high transition-colors duration-300">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-headline-md text-[18px] text-primary" style={{ margin: 0 }}>{item.title}</h3>
                      <span className={`inline-block px-2 py-0.5 border font-label-sm text-[10px] rounded uppercase ${isCurrent ? 'border-primary-fixed-dim text-primary-fixed-dim bg-primary-fixed-dim/5' : 'border-border-subtle text-text-muted bg-surface-container-low'}`}>
                        {item.type.toUpperCase() === 'CERTIFICATION' || item.type.toUpperCase() === 'CERTIFICAÇÃO' ? 'CERTIFICAÇÃO' : isCurrent ? 'EM PROGRESSO' : 'CONCLUÍDO'}
                      </span>
                    </div>
                    <h4 className="font-body-lg text-[15px] text-on-surface-variant" style={{ margin: 0 }}>{item.institution}</h4>
                  </div>
                  <div className="font-label-caps text-[11px] text-text-muted flex items-center gap-2 mt-1 whitespace-nowrap">
                    <span className="material-symbols-outlined text-sm" style={{ fontSize: '16px' }}>calendar_month</span>
                    <span>{item.period}</span>
                  </div>
                </div>

                {/* Highlights as description & tag list */}
                {item.highlights && item.highlights.length > 0 && (
                  <div>
                    <p className="font-body-md text-[14px] text-on-surface-variant mb-4">
                      {item.highlights[0]}
                    </p>
                    {item.highlights.length > 1 && (
                      <div className="flex flex-wrap gap-2">
                        {item.highlights.slice(1).map((h, i) => (
                          <span className="px-3 py-1 bg-surface-container-highest border border-border-subtle rounded font-label-sm text-label-sm text-on-surface" key={i}>
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.highlights.length <= 1 && tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span className="px-3 py-1 bg-surface-container-highest border border-border-subtle rounded font-label-sm text-label-sm text-on-surface" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getExperienceTags(company: string): string[] {
  const c = company.toLowerCase();
  if (c.includes('techcorp')) return ['Go', 'Kubernetes', 'Kafka', 'PostgreSQL'];
  if (c.includes('innovatesys') || c.includes('solutions')) return ['React', 'Node.js', 'TypeScript', 'MongoDB'];
  return ['Software Engineering', 'System Design'];
}

function ExperiencePage({ manifest }: { manifest: PortfolioManifest }) {
  return (
    <div className="page-stack">
      <header className="mb-12">
        <h1 className="font-display text-display text-text-primary mb-4">Experiência Profissional</h1>
        <p className="font-body-lg text-body-lg text-text-muted max-w-2xl">
          Uma linha do tempo detalhando contribuições de arquitetura, liderança de equipe e engenharia de sistemas.
        </p>
      </header>

      {/* Timeline Layout */}
      <div 
        className="relative ml-4 md:ml-8 space-y-12 pb-12"
        style={{
          borderLeftWidth: '0px',
          position: 'relative'
        }}
      >
        {manifest.experience.map((item, index) => {
          const tags = getExperienceTags(item.company);
          const isCurrent = index === 0 || item.period.toLowerCase().includes('present') || item.period.toLowerCase().includes('atual');

          return (
            <div className="relative pl-8 md:pl-12" key={item.company}>
              {/* Timeline marker */}
              {isCurrent ? (
                <span 
                  className="absolute -left-[22px] top-1.5 w-4 h-4 bg-[#131313] border-2 border-primary-fixed-dim rounded-full shadow-[0_0_8px_rgba(0,220,229,0.5)]"
                  style={{ zIndex: 10 }}
                ></span>
              ) : (
                <span 
                  className="absolute -left-[20px] top-1.5 w-3 h-3 bg-[#131313] border-2 border-border-subtle rounded-full"
                  style={{ zIndex: 10 }}
                ></span>
              )}

              {/* Card wrapper */}
              <div className="bg-surface-container p-5 rounded-lg border border-border-subtle hover:bg-surface-container-high transition-colors duration-300">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                  <div>
                    <h3 className="font-headline-md text-[18px] text-text-primary mb-1" style={{ margin: 0 }}>{item.position}</h3>
                    <div className="font-label-caps text-label-caps text-primary-fixed-dim">{item.company}</div>
                  </div>
                  <div className="font-label-sm text-label-sm text-text-muted mt-2 md:mt-0 flex items-center gap-2 whitespace-nowrap">
                    <span className="material-symbols-outlined text-sm" style={{ fontSize: '16px' }}>calendar_month</span>
                    <span>{item.period}</span>
                  </div>
                </div>

                <div className="space-y-4 font-body-md text-body-md text-on-surface-variant">
                  <p>{item.summary}</p>
                  
                  {/* Responsibilities list with custom check circle icons */}
                  {item.responsibilities && item.responsibilities.length > 0 && (
                    <ul className="list-none space-y-2" style={{ padding: 0, margin: '16px 0 0' }}>
                      {item.responsibilities.map((resp, i) => (
                        <li className="flex items-start gap-2" key={i}>
                          <span className="material-symbols-outlined text-primary-fixed-dim text-sm mt-0.5" style={{ fontSize: '18px' }}>check_circle</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Technology Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border-subtle">
                      {tags.map((tag) => (
                        <span className="bg-surface-container-highest px-2 py-1 rounded font-label-sm text-label-sm text-text-primary border border-border-subtle" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getSocialMetadata(type: string, url: string) {
  if (type === 'github') {
    return {
      iconName: 'code',
      handle: '@sevenleo',
      stat: '42 Repositórios',
      actionText: 'Ver Perfil',
      desc: 'Contribuições em código aberto, dotfiles e experimentos técnicos. Repositório principal para desenvolvimento ativo.'
    };
  }
  if (type === 'linkedin') {
    return {
      iconName: 'work',
      handle: '/in/sevenleo',
      stat: '500+ Conexões',
      actionText: 'Ver Perfil',
      desc: 'Histórico profissional, recomendações e artigos de arquitetura. Conecte-se para contatos profissionais ou projetos.'
    };
  }
  if (type === 'email') {
    return {
      iconName: 'alternate_email',
      handle: 'leonevesdasilva@gmail.com',
      stat: 'Contato Direto',
      actionText: 'Escrever',
      desc: 'Para assuntos urgentes, consultoria técnica ou comunicações privadas sobre projetos confidenciais.'
    };
  }
  return {
    iconName: 'chat_bubble',
    handle: '@sevenleo',
    stat: 'Seguidores',
    actionText: 'Seguir',
    desc: 'Reflexões em tempo real sobre arquitetura de software, design systems e notícias da indústria de tecnologia.'
  };
}

function SocialPage({ manifest }: { manifest: PortfolioManifest }) {
  return (
    <div className="page-stack" style={{ position: 'relative' }}>
      {/* Ambient Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5 z-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #00dce5 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      
      <div className="flex-1 w-full max-w-4xl mx-auto py-4 z-10 relative">
        <header className="mb-12 border-b border-border-subtle pb-6">
          <h1 className="font-display text-display text-on-surface mb-2">Conectar &amp; Colaborar</h1>
          <p className="font-body-lg text-body-lg text-text-muted max-w-2xl">
            Rede profissional e contribuições de código aberto. Selecione uma plataforma para iniciar contato.
          </p>
        </header>

        {/* Bento Grid of Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {manifest.profile.socials.map((social) => {
            const meta = getSocialMetadata(social.type, social.url);
            return (
              <a 
                key={social.url} 
                href={social.url} 
                target={externalTarget(social.url)}
                rel="noreferrer"
                className="group relative block bg-surface-container-low border border-border-subtle rounded-lg p-5 hover-glow transition-all duration-300 hover:bg-surface-container flex flex-col h-full text-decoration-none"
                style={{ textDecoration: 'none' }}
              >
                <div className="absolute top-4 right-4">
                  <span className="material-symbols-outlined text-text-muted group-hover:text-primary-fixed-dim transition-colors" style={{ fontSize: '20px' }}>
                    {social.type === 'email' ? 'mail' : 'arrow_outward'}
                  </span>
                </div>
                <div className="w-12 h-12 rounded bg-[#131313] border border-border-subtle flex items-center justify-center mb-6 group-hover:border-primary-fixed-dim transition-colors text-on-surface">
                  <SocialIcon type={social.type} size={24} />
                </div>
                <div className="flex-grow">
                  <h2 className="font-headline-md text-[20px] text-on-surface mb-1" style={{ margin: 0 }}>{social.label}</h2>
                  <div className="font-label-caps text-label-caps text-primary-fixed-dim mb-4 tracking-wider">{meta.handle}</div>
                  <p className="font-body-md text-body-md text-text-muted" style={{ margin: 0 }}>
                    {meta.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border-subtle flex justify-between items-center w-full">
                  <span className="font-label-sm text-label-sm text-on-surface-variant bg-[#131313] px-2 py-1 rounded border border-border-subtle">
                    {meta.stat}
                  </span>
                  <span className="font-label-caps text-label-caps text-primary-fixed-dim opacity-0 group-hover:opacity-100 transition-opacity">
                    {meta.actionText}
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Secure Comm Note */}
        <div className="mt-12 p-6 border border-border-subtle bg-[#131313] rounded-lg flex items-start gap-4">
          <span className="material-symbols-outlined text-text-muted mt-1" style={{ fontSize: '24px' }}>lock</span>
          <div>
            <h3 className="font-headline-sm text-[16px] font-bold text-on-surface mb-1" style={{ margin: 0 }}>Comunicações Seguras</h3>
            <p className="font-body-md text-body-md text-text-muted" style={{ margin: '8px 0 0 0' }}>
              Para assuntos confidenciais, por favor solicite minha chave pública PGP por e-mail antes de transmitir credenciais ou documentos sensíveis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppShell({ manifest, route }: { manifest: PortfolioManifest; route: Route }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const activePath = route.page === 'home' ? '/' : route.page === 'projects' ? '/projects' : `/${route.page}`;

  const navLinks = [
    { path: '/', label: 'Início', icon: 'home' },
    { path: '/projects', label: 'Projetos', icon: 'folder_special' },
    { path: '/technologies', label: 'Tecnologias', icon: 'terminal' },
    { path: '/education', label: 'Formação', icon: 'school' },
    { path: '/experience', label: 'Experiência', icon: 'work' },
    { path: '/social', label: 'Social', icon: 'share' },
  ];

  return (
    <div className="app-shell">
      {/* Mobile TopAppBar */}
      <header className="mobile-header">
        <button className="icon-button" style={{ border: 0, background: 'transparent', color: 'inherit', cursor: 'pointer' }} type="button" onClick={() => setMenuOpen((value) => !value)}>
          <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
        </button>
        <span className="font-label-caps text-[12px] font-bold text-primary-fixed-dim tracking-widest uppercase">
          {manifest.profile.name}
        </span>
        <div className="flex items-center gap-4 text-primary-fixed-dim">
          <span className="material-symbols-outlined text-[20px] opacity-80 cursor-pointer">settings</span>
          <span className="material-symbols-outlined text-[20px] opacity-80 cursor-pointer">dark_mode</span>
        </div>
      </header>

      {/* Sidebar Rail */}
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        {/* Header / Avatar Area */}
        <div className="flex items-center p-2 mb-8 shrink-0 h-16 w-full border-b border-border-subtle" style={{ minHeight: '64px' }}>
          <div className="w-8 h-8 rounded bg-surface-container-high border border-border-subtle flex items-center justify-center shrink-0">
            <span className="font-label-caps text-[12px] font-bold text-primary-fixed-dim">LN</span>
          </div>
          <div className="ml-4 nav-label flex flex-col" style={{ textTransform: 'none', letterSpacing: 'normal' }}>
            <span className="font-headline-md text-[14px] font-bold text-primary-container leading-tight">Leonardo N.</span>
            <span className="font-label-caps text-[10px] text-text-muted uppercase tracking-widest mt-0.5">Portfólio Técnico</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav aria-label="Navegação principal">
          {navLinks.map((item) => (
            <button
              key={item.path}
              className={activePath === item.path ? 'active' : ''}
              type="button"
              onClick={() => {
                navigate(item.path);
                setMenuOpen(false);
              }}
            >
              <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: '20px' }}>{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Contact Me button inside sidebar */}
        <div className="mt-auto pt-4 border-t border-border-subtle w-full flex justify-center">
          <button 
            className="sidebar-contact-button"
            onClick={() => {
              navigate('/social');
              setMenuOpen(false);
            }}
          >
            <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: '20px' }}>mail</span>
            <span className="nav-label">Contato</span>
          </button>
        </div>
      </aside>

      <main onClick={() => menuOpen && setMenuOpen(false)}>
        {route.page === 'home' ? <HomePage manifest={manifest} /> : null}
        {route.page === 'projects' && route.slug ? <ProjectDetailPage manifest={manifest} slug={route.slug} /> : null}
        {route.page === 'projects' && !route.slug ? <ProjectsPage manifest={manifest} /> : null}
        {route.page === 'technologies' ? <TechnologiesPage manifest={manifest} /> : null}
        {route.page === 'education' ? <EducationPage manifest={manifest} /> : null}
        {route.page === 'experience' ? <ExperiencePage manifest={manifest} /> : null}
        {route.page === 'social' ? <SocialPage manifest={manifest} /> : null}
      </main>
    </div>
  );
}

export default function App() {
  const [manifest, setManifest] = useState<PortfolioManifest | null>(null);
  const [route, setRoute] = useState<Route>(parseHash);
  const [error, setError] = useState('');

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
    fetch(`${base}data/portfolio.manifest.json`)
      .then((response) => {
        if (!response.ok) throw new Error('Manifesto não encontrado');
        return response.json();
      })
      .then((data: PortfolioManifest) => setManifest(data))
      .catch((currentError: Error) => setError(currentError.message));
  }, []);

  if (error) {
    return (
      <div className="load-state">
        <FileJson size={36} />
        <h1>Manifesto indisponível</h1>
        <p>{error}. Execute `npm run content:index` para gerar os dados públicos.</p>
      </div>
    );
  }

  if (!manifest) {
    return (
      <div className="load-state">
        <Sparkles size={36} />
        <h1>Carregando portfólio</h1>
      </div>
    );
  }

  return <AppShell manifest={manifest} route={route} />;
}

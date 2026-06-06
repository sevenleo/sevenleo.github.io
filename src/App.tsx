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
  | { page: 'social' }
  | { page: 'docs' };

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/projects', label: 'Projetos', icon: Boxes },
  { path: '/technologies', label: 'Tecnologias', icon: Code2 },
  { path: '/education', label: 'Formação', icon: GraduationCap },
  { path: '/experience', label: 'Experiência', icon: BriefcaseBusiness },
  { path: '/social', label: 'Social', icon: UserRound },
  { path: '/docs', label: 'Docs', icon: BookOpen },
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
  if (parts[0] === 'docs') return { page: 'docs' };
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

  if (isCompact) {
    return (
      <article className={`project-card project-card-compact ${isList ? 'project-card-list' : ''}`}>
        <div className="compact-title-row" onClick={() => navigate(`/projects/${project.slug}`)}>
          <h3>{project.title}</h3>
          {!isReviewed && <span className="badge badge-warning">Sem revisão</span>}
        </div>
        <div className="card-actions">
          <button className="button button-ghost" type="button" onClick={() => navigate(`/projects/${project.slug}`)}>
            <span>Detalhes</span>
          </button>
        </div>
      </article>
    );
  }

  if (!isReviewed) {
    return (
      <article className={`project-card project-card-basic ${isList ? 'project-card-list' : ''}`}>
        <button className="basic-row basic-button" type="button" onClick={() => navigate(`/projects/${project.slug}`)}>
          <h3>{project.title}</h3>
          <span className="badge badge-warning">Sem revisão</span>
        </button>
        {project.primaryLink ? (
          <LinkButton href={project.primaryLink.url} icon={<ExternalLink size={16} />} variant="secondary">
            {project.primaryLink.label}
          </LinkButton>
        ) : null}
      </article>
    );
  }

  return (
    <article className={`project-card ${isList ? 'project-card-list' : ''}`}>
      <button className="project-card-click" type="button" onClick={() => navigate(`/projects/${project.slug}`)}>
        <div className="project-card-top">
          {!hideCover && <ProjectCover project={project} />}
          <div className="card-title-row">
            <h3>{project.title}</h3>
            <span>{project.category}</span>
          </div>
        </div>
        <div className="project-card-body">
          {!isList && <p>{project.shortSummary}</p>}
          <div className="badge-row">
            {project.badges.slice(0, 4).map((badge, index) => (
              <BadgePill key={`${project.slug}-${badge.label}-${index}`} badge={badge} />
            ))}
          </div>
          <span className="project-status">{statusLabel[project.status] || project.status}</span>
        </div>
      </button>
      <div className="card-actions">
        <button className="button button-ghost" type="button" onClick={() => navigate(`/projects/${project.slug}`)}>
          <span>Detalhes</span>
        </button>
        {project.primaryLink ? (
          <LinkButton href={project.primaryLink.url} icon={<ExternalLink size={16} />} variant="secondary">
            Abrir
          </LinkButton>
        ) : null}
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
    <div className="page-stack home-page">
      <section className="home-minimal">
        <img className="home-avatar" src={manifest.profile.photo} alt={manifest.profile.name} />
        <div className="home-intro">
          <span className="eyebrow">Hub pessoal</span>
          <h1>{manifest.profile.name}</h1>
          <p className="hero-role">{manifest.profile.role}</p>
          <p>{manifest.profile.summary}</p>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={() => navigate('/projects')}>
              <Boxes size={18} />
              <span>Ver catálogo</span>
            </button>
            <button className="button button-secondary" type="button" onClick={openRandomProject}>
              <Shuffle size={18} />
              <span>Conhecer projeto aleatório</span>
            </button>
          </div>
        </div>
      </section>

      <footer className="home-social-footer" aria-label="Contatos e redes sociais">
        {manifest.profile.socials.map((social) => (
          <a
            key={social.url}
            href={social.url}
            target={externalTarget(social.url)}
            rel="noreferrer"
            title={social.label}
            aria-label={social.label}
          >
            <SocialIcon type={social.type} size={18} />
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
      <IndexSection title="Linguagens" indexes={manifest.indexes.languages} manifest={manifest} icon={<Code2 size={18} />} />
      <IndexSection title="Tecnologias" indexes={manifest.indexes.technologies} manifest={manifest} icon={<Layers3 size={18} />} />
      <IndexSection title="Categorias" indexes={manifest.indexes.categories} manifest={manifest} icon={<Tags size={18} />} />
    </div>
  );
}

function IndexSection({
  title,
  indexes,
  manifest,
  icon,
}: {
  title: string;
  indexes: PortfolioIndex[];
  manifest: PortfolioManifest;
  icon: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={`tech-index-section ${isOpen ? 'is-open' : 'is-closed'}`}>
      <button
        className="tech-index-trigger"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="tech-index-title">
          {icon}
          {title}
        </span>
        <span className="tech-index-arrow">
          <ChevronDown size={18} />
        </span>
      </button>
      
      {isOpen && (
        <div className="index-grid">
          {indexes.map((index) => (
            <article className="index-card" key={index.name}>
              <h3>{index.name}</h3>
              <span>{index.projectSlugs.length} projeto(s)</span>
              <div>
                {index.projectSlugs.slice(0, 5).map((slug) => {
                  const project = manifest.projects.find((item) => item.slug === slug);
                  return project ? (
                    <button key={slug} type="button" onClick={() => navigate(`/projects/${slug}`)}>
                      {project.title}
                    </button>
                  ) : null;
                })}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function EducationPage({ manifest }: { manifest: PortfolioManifest }) {
  return (
    <div className="page-stack">
      <SectionHeader eyebrow="Credibilidade" title="Formação acadêmica" />
      <div className="timeline-list large">
        {manifest.education.map((item) => (
          <article className="timeline-item static" key={item.title}>
            <span>{item.period}</span>
            <h3>{item.title}</h3>
            <em>{item.institution} · {item.type}</em>
            <ul>
              {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

function ExperiencePage({ manifest }: { manifest: PortfolioManifest }) {
  return (
    <div className="page-stack">
      <SectionHeader eyebrow="Trajetória" title="Experiência profissional" />
      <div className="timeline-list large">
        {manifest.experience.map((item) => (
          <article className="timeline-item static" key={item.company}>
            <span>{item.period}</span>
            <h3>{item.position}</h3>
            <em>{item.company}</em>
            <p>{item.summary}</p>
            <ul>
              {item.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

function SocialPage({ manifest }: { manifest: PortfolioManifest }) {
  return (
    <div className="page-stack">
      <SectionHeader eyebrow="Contato" title="Links sociais" text="Canais externos organizados para acesso rápido." />
      <div className="social-grid">
        {manifest.profile.socials.map((social) => (
          <LinkButton key={social.url} href={social.url} icon={<SocialIcon type={social.type} />}>
            {social.label}
          </LinkButton>
        ))}
      </div>
    </div>
  );
}

function DocsPage() {
  return (
    <div className="page-stack">
      <SectionHeader eyebrow="Documentação" title="Como manter o portfólio" />
      <section className="docs-grid">
        <article>
          <h3>Adicionar projeto</h3>
          <p>Crie uma pasta em `public/content/projects/nome-do-projeto` e inclua um `project.json` com os campos do catálogo.</p>
        </article>
        <article>
          <h3>Revisão do JSON</h3>
          <p>`contentReviewedAt` indica que o conteúdo do JSON foi revisado. Sem essa data, o projeto aparece como `Sem revisão` e mostra apenas nome/link.</p>
        </article>
        <article>
          <h3>Gerar manifesto</h3>
          <p>Execute `npm run content:index` após alterar JSONs ou assets. O build executa esse passo automaticamente.</p>
        </article>
      </section>
      <pre className="code-sample">{`{
  "slug": "meu-projeto",
  "title": "Meu Projeto",
  "shortSummary": "Resumo curto",
  "category": "Ferramentas",
  "status": "active",
  "visibility": "public",
  "links": [{ "label": "Abrir", "url": "https://...", "primary": true }],
  "contentReviewedAt": "2026-06-06"
}`}</pre>
    </div>
  );
}

function AppShell({ manifest, route }: { manifest: PortfolioManifest; route: Route }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const activePath = route.page === 'home' ? '/' : route.page === 'projects' ? '/projects' : `/${route.page}`;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <nav aria-label="Navegação principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                className={activePath === item.path ? 'active' : ''}
                type="button"
                title={item.label}
                aria-label={item.label}
                onClick={() => {
                  navigate(item.path);
                  setMenuOpen(false);
                }}
              >
                <Icon size={18} />
                <span className="nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main>
        <header className="mobile-header">
          <button className="icon-button" type="button" onClick={() => setMenuOpen((value) => !value)}>
            <Menu size={20} />
          </button>
          <strong>Sevenleo</strong>
        </header>
        {route.page === 'home' ? <HomePage manifest={manifest} /> : null}
        {route.page === 'projects' && route.slug ? <ProjectDetailPage manifest={manifest} slug={route.slug} /> : null}
        {route.page === 'projects' && !route.slug ? <ProjectsPage manifest={manifest} /> : null}
        {route.page === 'technologies' ? <TechnologiesPage manifest={manifest} /> : null}
        {route.page === 'education' ? <EducationPage manifest={manifest} /> : null}
        {route.page === 'experience' ? <ExperiencePage manifest={manifest} /> : null}
        {route.page === 'social' ? <SocialPage manifest={manifest} /> : null}
        {route.page === 'docs' ? <DocsPage /> : null}
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

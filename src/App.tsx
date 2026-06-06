import {
  Activity,
  Archive,
  ArrowLeft,
  BookOpen,
  Boxes,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Database,
  Download,
  ExternalLink,
  FileJson,
  Filter,
  Github,
  GraduationCap,
  Home,
  Inbox,
  Layers3,
  Link as LinkIcon,
  Mail,
  MapPin,
  Menu,
  PackageOpen,
  Search,
  Shield,
  Shuffle,
  Sparkles,
  Tags,
  UserRound,
  X,
} from 'lucide-react';
import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import type { Badge, PortfolioIndex, PortfolioManifest, Project } from './types';

type Route =
  | { page: 'home' }
  | { page: 'projects'; slug?: string }
  | { page: 'technologies' }
  | { page: 'education' }
  | { page: 'experience' }
  | { page: 'social' }
  | { page: 'downloads' }
  | { page: 'docs' };

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/projects', label: 'Projetos', icon: Boxes },
  { path: '/technologies', label: 'Tecnologias', icon: Code2 },
  { path: '/education', label: 'Formação', icon: GraduationCap },
  { path: '/experience', label: 'Experiência', icon: BriefcaseBusiness },
  { path: '/social', label: 'Social', icon: UserRound },
  { path: '/downloads', label: 'Downloads', icon: Download },
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
  if (parts[0] === 'downloads') return { page: 'downloads' };
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
    <a className={`button button-${variant}`} href={href} target={externalTarget(href)} rel="noreferrer">
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

function ProjectCard({ project }: { project: Project }) {
  if (!project.contentReviewed) {
    return (
      <article className="project-card project-card-basic">
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
    <article className="project-card">
      <button className="project-card-click" type="button" onClick={() => navigate(`/projects/${project.slug}`)}>
        <div className="project-card-top">
          <ProjectCover project={project} />
          <div className="card-title-row">
            <h3>{project.title}</h3>
            <span>{project.category}</span>
          </div>
        </div>
        <div className="project-card-body">
          <p>{project.shortSummary}</p>
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
          <Inbox size={16} />
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

  const hubCards = [
    {
      title: 'Projetos',
      text: 'Catálogo pesquisável por stack, categoria e tipo de solução.',
      path: '/projects',
      icon: Boxes,
    },
    {
      title: 'Formação',
      text: 'Linha do tempo acadêmica e cursos principais.',
      path: '/education',
      icon: GraduationCap,
    },
    {
      title: 'Experiência',
      text: 'Trajetória profissional e responsabilidades técnicas.',
      path: '/experience',
      icon: BriefcaseBusiness,
    },
    {
      title: 'Tecnologias',
      text: 'Índice de linguagens, stacks e áreas de atuação.',
      path: '/technologies',
      icon: Code2,
    },
  ];

  const compactStats = [
    { label: 'Projetos', value: manifest.stats.totalProjects, icon: Boxes },
    { label: 'Revisados', value: manifest.stats.reviewedProjects, icon: Shield },
    { label: 'Linguagens', value: manifest.stats.languages, icon: Code2 },
    { label: 'Sem revisão', value: manifest.stats.unreviewedProjects, icon: FileJson },
  ];

  return (
    <div className="page-stack home-page">
      <section className="home-hub">
        <div className="home-portrait">
          <img src={manifest.profile.photo} alt={manifest.profile.name} />
          <div className="social-strip">
            {manifest.profile.socials.map((social) => (
              <a key={social.url} href={social.url} target={externalTarget(social.url)} rel="noreferrer">
                {social.label}
              </a>
            ))}
          </div>
        </div>
        <div className="home-copy">
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
          <div className="compact-stats">
            {compactStats.map((item) => {
              const Icon = item.icon;
              return (
                <span key={item.label}>
                  <Icon size={15} />
                  <em>{item.value}</em>
                  {item.label}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <section className="hub-grid" aria-label="Áreas principais do portfólio">
        {hubCards.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.path} type="button" onClick={() => navigate(item.path)}>
              <Icon size={22} />
              <span>{item.title}</span>
              <p>{item.text}</p>
            </button>
          );
        })}
      </section>

      <section className="home-focus">
        {manifest.profile.focus.map((item) => (
          <span key={item}>
            <CheckCircle2 size={15} />
            {item}
          </span>
        ))}
      </section>
    </div>
  );
}

function ProjectsPage({ manifest }: { manifest: PortfolioManifest }) {
  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
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
        text="Busca rápida e filtros discretos para navegar por stacks, categorias e status."
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
        <section className="project-grid">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
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
            {project.downloads[0] ? (
              <LinkButton href={project.downloads[0].url} icon={<Download size={16} />} variant="secondary">
                Download
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

      {project.gallery.length ? (
        <section className="detail-panel">
          <SectionHeader eyebrow="Mídia" title="Galeria" />
          <div className="gallery-grid">
            {project.gallery.map((image) => (
              <img key={image.src} src={image.src} alt={image.alt} loading="lazy" />
            ))}
          </div>
        </section>
      ) : null}

      <section className="project-detail-grid">
        <article className="detail-panel">
          <SectionHeader eyebrow="Acesso" title="Links externos" />
          <div className="link-list">
            {project.links.length ? project.links.map((link) => (
              <LinkButton key={`${link.label}-${link.url}`} href={link.url} icon={<LinkIcon size={16} />} variant="secondary">
                {link.label}
              </LinkButton>
            )) : <p className="muted">Sem links públicos cadastrados.</p>}
          </div>
        </article>
        <article className="detail-panel">
          <SectionHeader eyebrow="Histórico" title="Versões e marcos" />
          <div className="timeline-list">
            {[...project.versions.map((version) => ({
              date: version.date || '',
              title: `${version.version}${version.summary ? `: ${version.summary}` : ''}`,
            })), ...project.timeline].map((item, index) => (
              <div className="timeline-item static" key={`${item.title}-${index}`}>
                <span>{formatDate(item.date)}</span>
                <h3>{item.title}</h3>
              </div>
            ))}
            {!project.versions.length && !project.timeline.length ? <p className="muted">Sem histórico cadastrado.</p> : null}
          </div>
        </article>
      </section>
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
  return (
    <section>
      <h3 className="subheading">{icon}{title}</h3>
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
  const iconForType = (type: string) => {
    if (type === 'github') return <Github size={18} />;
    if (type === 'email') return <Mail size={18} />;
    return <ExternalLink size={18} />;
  };

  return (
    <div className="page-stack">
      <SectionHeader eyebrow="Contato" title="Links sociais" text="Canais externos organizados para acesso rápido." />
      <div className="social-grid">
        {manifest.profile.socials.map((social) => (
          <LinkButton key={social.url} href={social.url} icon={iconForType(social.type)}>
            {social.label}
          </LinkButton>
        ))}
      </div>
    </div>
  );
}

function DownloadsPage({ manifest }: { manifest: PortfolioManifest }) {
  const [importInfo, setImportInfo] = useState<string>('');

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as Partial<PortfolioManifest>;
      const projects = parsed.projects?.length ?? 0;
      const reviewed = parsed.projects?.filter((project) => project.contentReviewed).length ?? 0;
      const unreviewed = projects - reviewed;
      setImportInfo(`Manifesto válido para leitura: ${projects} projeto(s), ${reviewed} revisado(s), ${unreviewed} sem revisão.`);
    } catch {
      setImportInfo('Arquivo inválido. Envie um JSON de manifesto exportado pelo portfólio.');
    }
  };

  return (
    <div className="page-stack">
      <SectionHeader eyebrow="Manutenção" title="Downloads e importação" />
      <section className="content-columns">
        <article className="maintenance-panel">
          <Database size={26} />
          <h3>Manifesto do portfólio</h3>
          <p>Exportação completa gerada a partir dos JSONs em `public/content`.</p>
          <LinkButton href="/data/portfolio.manifest.json" icon={<Download size={16} />}>
            Baixar manifesto
          </LinkButton>
        </article>
        <article className="maintenance-panel">
          <FileJson size={26} />
          <h3>Pré-visualizar importação</h3>
          <p>Carregue um manifesto local para conferir contagem e revisão sem alterar o site.</p>
          <label className="file-input">
            <input type="file" accept="application/json,.json" onChange={handleImport} />
            <span>Selecionar JSON</span>
          </label>
          {importInfo ? <p className="import-info">{importInfo}</p> : null}
        </article>
      </section>
      <section>
        <SectionHeader eyebrow="Downloads por projeto" title="Artefatos cadastrados" />
        <div className="link-list">
          {manifest.projects.flatMap((project) =>
            project.downloads.map((download) => (
              <LinkButton key={`${project.slug}-${download.url}`} href={download.url} icon={<Download size={16} />} variant="secondary">
                {project.title}: {download.label}
              </LinkButton>
            )),
          )}
        </div>
      </section>
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
        <div className="brand">
          <Sparkles size={20} />
          <div>
            <strong>Sevenleo</strong>
            <span>Portfolio OS</span>
          </div>
        </div>
        <nav>
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
        <div className="sidebar-footer">
          <Activity size={16} />
          <span>{manifest.stats.reviewedProjects} JSONs revisados</span>
        </div>
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
        {route.page === 'downloads' ? <DownloadsPage manifest={manifest} /> : null}
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

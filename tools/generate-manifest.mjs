import { promises as fs } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const contentDir = path.join(rootDir, 'public', 'content');
const outputFile = path.join(rootDir, 'public', 'data', 'portfolio.manifest.json');
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

const statusLabels = {
  active: 'Ativo',
  stable: 'Estável',
  'in-development': 'Em desenvolvimento',
  experimental: 'Experimental',
  paused: 'Pausado',
  discontinued: 'Descontinuado',
  archived: 'Arquivado',
  draft: 'Rascunho',
};

const visibilityLabels = {
  public: 'Público',
  private: 'Privado',
};

const maturityLabels = {
  draft: 'Rascunho',
  mvp: 'MVP',
  stable: 'Estável',
  production: 'Produção',
  legacy: 'Legado',
  continuous: 'Contínuo',
  experimental: 'Experimental',
};

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean);
}

function isExternal(value) {
  return /^(https?:|mailto:|tel:|#|\/)/i.test(value);
}

function resolveProjectAsset(slug, value) {
  if (!value || typeof value !== 'string') return '';
  const normalized = value.replaceAll('\\', '/');
  return isExternal(normalized) ? normalized : `/content/projects/${slug}/${normalized}`;
}

function resolveContentAsset(value) {
  if (!value || typeof value !== 'string') return '';
  const normalized = value.replaceAll('\\', '/');
  return isExternal(normalized) ? normalized : `/content/${normalized}`;
}

function collectText(value) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(collectText).join(' ');
  }
  if (typeof value === 'object') {
    return Object.values(value).map(collectText).join(' ');
  }
  return '';
}

function validateReviewDate(project, warnings) {
  if (!project.contentReviewedAt) return;
  if (!isoDatePattern.test(project.contentReviewedAt)) {
    warnings.push(`${project.slug}: contentReviewedAt deve usar YYYY-MM-DD.`);
  }
}

function normalizeProject(raw, folderSlug, warnings) {
  const slug = raw.slug || folderSlug;
  const contentReviewed = Boolean(raw.contentReviewedAt);
  const links = toArray(raw.links).map((link) => ({
    label: link.label || 'Abrir',
    url: link.url || '',
    type: link.type || 'link',
    primary: Boolean(link.primary),
  })).filter((link) => link.url);

  const primaryLink = links.find((link) => link.primary) || links[0] || null;
  const gallery = toArray(raw.gallery).map((item) => ({
    src: resolveProjectAsset(slug, item.src || item),
    alt: item.alt || raw.title || slug,
  })).filter((item) => item.src);

  const project = {
    slug,
    title: raw.title || slug,
    shortSummary: raw.shortSummary || '',
    description: raw.description || '',
    category: raw.category || 'Sem revisão',
    type: raw.type || 'project',
    status: raw.status || 'draft',
    visibility: raw.visibility || 'public',
    maturity: raw.maturity || (contentReviewed ? 'mvp' : 'draft'),
    platforms: toArray(raw.platforms),
    languages: toArray(raw.languages),
    technologies: toArray(raw.technologies),
    tags: toArray(raw.tags),
    audience: raw.audience || '',
    problem: raw.problem || '',
    goal: raw.goal || '',
    cover: resolveProjectAsset(slug, raw.cover || ''),
    gallery,
    links,
    primaryLink,
    downloads: toArray(raw.downloads),
    versions: toArray(raw.versions),
    timeline: toArray(raw.timeline),
    createdAt: raw.createdAt || '',
    updatedAt: raw.updatedAt || '',
    contentReviewed,
    contentReviewedAt: raw.contentReviewedAt || '',
    badges: [],
    relatedProjectSlugs: [],
    searchText: '',
  };

  validateReviewDate(project, warnings);

  const badges = [];
  if (!project.contentReviewed) {
    badges.push({ label: 'Sem revisão', tone: 'warning' });
  }
  if (visibilityLabels[project.visibility]) {
    badges.push({ label: visibilityLabels[project.visibility], tone: project.visibility === 'private' ? 'danger' : 'success' });
  }
  if (statusLabels[project.status]) {
    badges.push({ label: statusLabels[project.status], tone: project.status === 'active' || project.status === 'stable' ? 'success' : 'neutral' });
  }
  if (maturityLabels[project.maturity]) {
    badges.push({ label: maturityLabels[project.maturity], tone: project.maturity === 'production' || project.maturity === 'stable' ? 'success' : 'neutral' });
  }
  if (project.type) badges.push({ label: project.type, tone: 'info' });
  project.platforms.forEach((platform) => badges.push({ label: platform, tone: 'info' }));
  project.badges = badges;
  project.searchText = collectText({ ...raw, slug }).toLowerCase();

  return project;
}

function scoreRelated(project, candidate) {
  if (project.slug === candidate.slug) return 0;
  let score = 0;
  if (project.category && project.category === candidate.category) score += 4;
  const overlap = (a, b, weight) => {
    const left = new Set(a.map((item) => String(item).toLowerCase()));
    return b.reduce((total, item) => total + (left.has(String(item).toLowerCase()) ? weight : 0), 0);
  };
  score += overlap(project.languages, candidate.languages, 3);
  score += overlap(project.technologies, candidate.technologies, 2);
  score += overlap(project.tags, candidate.tags, 1);
  score += overlap(project.platforms, candidate.platforms, 1);
  return score;
}

function attachRelatedProjects(projects) {
  return projects.map((project) => ({
    ...project,
    relatedProjectSlugs: projects
      .map((candidate) => ({ slug: candidate.slug, score: scoreRelated(project, candidate) }))
      .filter((candidate) => candidate.score > 0)
      .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug))
      .slice(0, 4)
      .map((candidate) => candidate.slug),
  }));
}

async function readJsonCollection(folderName) {
  const folder = path.join(contentDir, folderName);
  if (!(await fileExists(folder))) return [];
  const entries = await fs.readdir(folder, { withFileTypes: true });
  const items = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    const item = await readJson(path.join(folder, entry.name));
    items.push(item);
  }

  return items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

async function readProjects(warnings) {
  const projectsDir = path.join(contentDir, 'projects');
  const entries = await fs.readdir(projectsDir, { withFileTypes: true });
  const projects = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const projectFile = path.join(projectsDir, entry.name, 'project.json');
    if (!(await fileExists(projectFile))) continue;
    const raw = await readJson(projectFile);
    projects.push(normalizeProject(raw, entry.name, warnings));
  }

  return attachRelatedProjects(projects).sort((a, b) => {
    const reviewedDiff = Number(b.contentReviewed) - Number(a.contentReviewed);
    if (reviewedDiff !== 0) return reviewedDiff;
    return (b.updatedAt || '').localeCompare(a.updatedAt || '') || a.title.localeCompare(b.title);
  });
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function buildStats(projects) {
  const today = new Date();
  const cutoff = new Date(today);
  cutoff.setDate(today.getDate() - 365);
  const isRecent = (date) => {
    if (!date || !isoDatePattern.test(date)) return false;
    const parsed = new Date(`${date}T00:00:00`);
    return parsed >= cutoff && parsed <= today;
  };

  return {
    totalProjects: projects.length,
    publicProjects: projects.filter((project) => project.visibility !== 'private').length,
    privateProjects: projects.filter((project) => project.visibility === 'private').length,
    reviewedProjects: projects.filter((project) => project.contentReviewed).length,
    unreviewedProjects: projects.filter((project) => !project.contentReviewed).length,
    languages: unique(projects.flatMap((project) => project.languages)).length,
    categories: unique(projects.map((project) => project.category)).length,
    recentUpdates: projects.filter((project) => isRecent(project.updatedAt)).length,
  };
}

function buildIndexes(projects) {
  const languages = unique(projects.flatMap((project) => project.languages)).map((name) => ({
    name,
    projectSlugs: projects.filter((project) => project.languages.includes(name)).map((project) => project.slug),
  }));

  const technologies = unique(projects.flatMap((project) => project.technologies)).map((name) => ({
    name,
    projectSlugs: projects.filter((project) => project.technologies.includes(name)).map((project) => project.slug),
  }));

  const categories = unique(projects.map((project) => project.category)).map((name) => ({
    name,
    projectSlugs: projects.filter((project) => project.category === name).map((project) => project.slug),
  }));

  return { languages, technologies, categories };
}

async function main() {
  const warnings = [];
  const profile = await readJson(path.join(contentDir, 'profile.json'));
  profile.photo = resolveContentAsset(profile.photo);

  const skills = await readJson(path.join(contentDir, 'skills.json'));
  const education = await readJsonCollection('education');
  const experience = await readJsonCollection('experience');
  const projects = await readProjects(warnings);
  const manifest = {
    generatedAt: new Date().toISOString(),
    profile,
    skills,
    education,
    experience,
    projects,
    stats: buildStats(projects),
    indexes: buildIndexes(projects),
  };

  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  console.log(`Manifesto gerado: ${path.relative(rootDir, outputFile)} (${projects.length} projetos)`);
  warnings.forEach((warning) => console.warn(`Aviso: ${warning}`));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

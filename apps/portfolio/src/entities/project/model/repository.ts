import { parseFrontmatter } from "../../../utils/frontmatter";
import {
  formatProjectName,
  ProjectCatalog,
  type ProjectDocument,
  type ProjectIndex,
  type ProjectMeta,
  normalizeBoolean,
  normalizeNumber,
  normalizeTags,
} from "./domain";

let catalog: ProjectCatalog | null = null;

export function getProjects(): ProjectDocument[] {
  return getCatalog().list();
}

export function getProject(slug: string): ProjectDocument | undefined {
  return getCatalog().findBySlug(slug);
}

export function getPortfolioIndex(): ProjectIndex {
  return getCatalog().buildIndex();
}

function getCatalog(): ProjectCatalog {
  if (!catalog) {
    catalog = ProjectCatalog.create(loadProjectDocuments());
  }
  return catalog;
}

function loadProjectDocuments(): ProjectDocument[] {
  const modules = import.meta.glob<string>(
    "../../../contents/projects/**/*.{md,mdx}",
    {
      eager: true,
      query: "?raw",
      import: "default",
    },
  );

  return Object.entries(modules)
    .map(([filePath, module]) =>
      createProjectDocument(filePath, module as unknown as string),
    )
    .filter((doc): doc is ProjectDocument => Boolean(doc));
}

function createProjectDocument(
  filePath: string,
  rawContent: string,
): ProjectDocument | null {
  const { data: frontmatter, content } = parseFrontmatter(rawContent);

  const pathParts = filePath.split("/");
  const fileName = pathParts.at(-1) ?? "";
  const fileNameWithoutExt = fileName.replace(/\.(md|mdx)$/, "");
  const projectsIndex = pathParts.findIndex((part) => part === "projects");
  const folderAfterProjects =
    projectsIndex >= 0 && projectsIndex < pathParts.length - 2
      ? pathParts[projectsIndex + 1]
      : undefined;

  const defaultSlug = fileNameWithoutExt;
  const slug = (frontmatter.slug as string) || defaultSlug;

  const relativePath = filePath
    .replace(/^\.\.\/contents\//, "/contents/")
    .replace(/\\/g, "/");

  const dateStr = (frontmatter.date as string) || new Date().toISOString();
  const createdAtMs = new Date(dateStr).getTime();

  const publishedValue =
    normalizeBoolean(frontmatter.publish) ??
    normalizeBoolean(frontmatter.published);
  const published = publishedValue ?? true;

  if (!published) {
    return null;
  }

  const tags = normalizeTags(frontmatter.tags);
  const order = normalizeNumber(frontmatter.order);
  const bannerValue = normalizeBoolean(frontmatter.banner);
  const banner = bannerValue ?? false;

  const inferredProjectRaw =
    frontmatter.project && String(frontmatter.project).trim().length > 0
      ? String(frontmatter.project)
      : folderAfterProjects &&
          !folderAfterProjects.includes(".") &&
          folderAfterProjects !== fileName
        ? folderAfterProjects
        : undefined;
  const inferredProject = formatProjectName(inferredProjectRaw);

  const meta: ProjectMeta = {
    title: (frontmatter.title as string) || fileNameWithoutExt,
    summary: (frontmatter.summary as string) || "",
    project: inferredProject,
    tags,
    date: String(frontmatter.date || dateStr),
    slug,
    path: relativePath,
    createdAtMs,
    id: fileNameWithoutExt,
    published,
    order,
    banner,
    cover: frontmatter.cover ? String(frontmatter.cover) : undefined,
    coverAlt: frontmatter.coverAlt ? String(frontmatter.coverAlt) : undefined,
    coverCaption: frontmatter.coverCaption
      ? String(frontmatter.coverCaption)
      : undefined,
    coverType: frontmatter.coverType as ProjectMeta["coverType"],
    coverAspectRatio: frontmatter.coverAspectRatio as
      | ProjectMeta["coverAspectRatio"]
      | undefined,
  };

  return {
    slug,
    content,
    meta,
  };
}


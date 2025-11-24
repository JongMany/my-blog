import { parseFrontmatter } from "../../../utils/frontmatter";
import {
  formatProjectName,
  normalizeBoolean,
  normalizeNumber,
  normalizeTags,
} from "../../../utils/normalize";
import { buildProjectIndex, findProjectBySlug } from "./catalog";
import type { ProjectDocument, ProjectIndex, ProjectMeta } from "./types";

// ============================================================================
// Types
// ============================================================================

interface PathInfo {
  fileName: string;
  fileNameWithoutExt: string;
  folderAfterProjects?: string;
}

interface DateInfo {
  dateStr: string;
  createdAtMs: number;
}

interface BuildMetaParams {
  frontmatter: Record<string, unknown>;
  pathInfo: PathInfo;
  slug: string;
  relativePath: string;
  dateInfo: DateInfo;
}

// ============================================================================
// Public API
// ============================================================================

export function getProjects(): ProjectDocument[] {
  return getDocuments();
}

export function getProject(slug: string): ProjectDocument | undefined {
  return findProjectBySlug(getDocuments(), slug);
}

export function getPortfolioIndex(): ProjectIndex {
  return buildProjectIndex(getDocuments());
}

// ============================================================================
// Cache & Load
// ============================================================================

let cachedDocuments: ProjectDocument[] | null = null;

const getDocuments = (): ProjectDocument[] => {
  if (!cachedDocuments) {
    cachedDocuments = loadProjectDocuments();
  }
  return cachedDocuments;
};

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

// ============================================================================
// Document Creation
// ============================================================================

function createProjectDocument(
  filePath: string,
  rawContent: string,
): ProjectDocument | null {
  const { data: frontmatter, content } = parseFrontmatter(rawContent);
  const pathInfo = extractPathInfo(filePath);
  const dateInfo = extractDateInfo(frontmatter);

  if (!extractPublished(frontmatter)) {
    return null;
  }

  const slug = extractSlug(frontmatter, pathInfo.fileNameWithoutExt);
  const relativePath = normalizeFilePath(filePath);
  const meta = buildProjectMeta({
    frontmatter,
    pathInfo,
    slug,
    relativePath,
    dateInfo,
  });

  return { slug, content, meta };
}

// ============================================================================
// Extractors
// ============================================================================

function extractPathInfo(filePath: string): PathInfo {
  const pathParts = filePath.split("/");
  const fileName = pathParts.at(-1) ?? "";
  const fileNameWithoutExt = fileName.replace(/\.(md|mdx)$/, "");
  const projectsIndex = pathParts.findIndex((part) => part === "projects");

  const folderAfterProjects =
    projectsIndex >= 0 && projectsIndex < pathParts.length - 2
      ? pathParts[projectsIndex + 1]
      : undefined;

  return { fileName, fileNameWithoutExt, folderAfterProjects };
}

function extractSlug(
  frontmatter: Record<string, unknown>,
  defaultSlug: string,
): string {
  return (frontmatter.slug as string) || defaultSlug;
}

function normalizeFilePath(filePath: string): string {
  return filePath
    .replace(/^\.\.\/contents\//, "/contents/")
    .replace(/\\/g, "/");
}

function extractDateInfo(frontmatter: Record<string, unknown>): DateInfo {
  const dateStr = (frontmatter.date as string) || new Date().toISOString();
  return {
    dateStr,
    createdAtMs: new Date(dateStr).getTime(),
  };
}

function extractPublished(frontmatter: Record<string, unknown>): boolean {
  return (
    normalizeBoolean(frontmatter.publish) ??
    normalizeBoolean(frontmatter.published) ??
    true
  );
}

// ============================================================================
// Builders
// ============================================================================

function buildProjectMeta({
  frontmatter,
  pathInfo,
  slug,
  relativePath,
  dateInfo,
}: BuildMetaParams): ProjectMeta {
  const title = (frontmatter.title as string) || pathInfo.fileNameWithoutExt;
  const summary = (frontmatter.summary as string) || "";

  return {
    title,
    summary,
    project: inferProjectName(frontmatter, pathInfo),
    tags: normalizeTags(frontmatter.tags),
    date: String(frontmatter.date || dateInfo.dateStr),
    slug,
    path: relativePath,
    createdAtMs: dateInfo.createdAtMs,
    id: pathInfo.fileNameWithoutExt,
    published: true,
    order: normalizeNumber(frontmatter.order),
    banner: normalizeBoolean(frontmatter.banner) ?? false,
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
}

function inferProjectName(
  frontmatter: Record<string, unknown>,
  pathInfo: PathInfo,
): string | undefined {
  const projectFromFrontmatter =
    frontmatter.project && String(frontmatter.project).trim().length > 0
      ? String(frontmatter.project)
      : undefined;

  if (projectFromFrontmatter) {
    return formatProjectName(projectFromFrontmatter);
  }

  const { folderAfterProjects, fileName } = pathInfo;
  const isValidFolderName =
    folderAfterProjects &&
    !folderAfterProjects.includes(".") &&
    folderAfterProjects !== fileName;

  return isValidFolderName ? formatProjectName(folderAfterProjects) : undefined;
}

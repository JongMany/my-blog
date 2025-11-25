import {
  parseFrontmatter,
  getString,
  getOptionalString,
} from "../../../utils/frontmatter";
import {
  formatProjectName,
  normalizeBoolean,
  normalizeNumber,
  normalizeTags,
} from "../../../utils/normalize";
import { normalizeFilePath } from "../../../utils/path";
import type { FrontmatterData } from "../../../components/mdx";
import { buildProjectIndex, findProjectBySlug } from "./catalog";
import type {
  BuildMetaParams,
  DateInfo,
  PathInfo,
  ProjectDocument,
  ProjectIndex,
  ProjectMeta,
} from "./types";

export function getProjects(): ProjectDocument[] {
  return getDocuments();
}

export function getProject(slug: string): ProjectDocument | undefined {
  return findProjectBySlug(getDocuments(), slug);
}

export function getPortfolioIndex(): ProjectIndex {
  return buildProjectIndex(getDocuments());
}

let cachedDocuments: ProjectDocument[] | null = null;

const getDocuments = (): ProjectDocument[] => {
  return cachedDocuments ?? (cachedDocuments = loadProjectDocuments());
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

  const slug = (frontmatter.slug as string) || pathInfo.fileNameWithoutExt;
  const meta = buildProjectMeta({
    frontmatter,
    pathInfo,
    slug,
    relativePath: normalizeFilePath(filePath),
    dateInfo,
  });

  return { slug, content, meta };
}

function extractPathInfo(filePath: string): PathInfo {
  const pathParts = filePath.split("/");
  const fileName = pathParts.at(-1) ?? "";
  const projectsIndex = pathParts.findIndex((part) => part === "projects");

  return {
    fileName,
    fileNameWithoutExt: fileName.replace(/\.(md|mdx)$/, ""),
    folderAfterProjects:
      projectsIndex >= 0 && projectsIndex < pathParts.length - 2
        ? pathParts[projectsIndex + 1]
        : undefined,
  };
}

function extractDateInfo(frontmatter: FrontmatterData): DateInfo {
  const dateStr = (frontmatter.date as string) || new Date().toISOString();
  return {
    dateStr,
    createdAtMs: new Date(dateStr).getTime(),
  };
}

function extractPublished(frontmatter: FrontmatterData): boolean {
  return (
    normalizeBoolean(frontmatter.publish) ??
    normalizeBoolean(frontmatter.published) ??
    true
  );
}

function buildProjectMeta({
  frontmatter,
  pathInfo,
  slug,
  relativePath,
  dateInfo,
}: BuildMetaParams): ProjectMeta {
  return {
    title: getString(frontmatter, "title", pathInfo.fileNameWithoutExt),
    summary: getString(frontmatter, "summary"),
    project: inferProjectName(frontmatter, pathInfo),
    tags: normalizeTags(frontmatter.tags),
    date: getString(frontmatter, "date", dateInfo.dateStr),
    slug,
    path: relativePath,
    createdAtMs: dateInfo.createdAtMs,
    id: pathInfo.fileNameWithoutExt,
    published: true,
    order: normalizeNumber(frontmatter.order),
    banner: normalizeBoolean(frontmatter.banner) ?? false,
    cover: getOptionalString(frontmatter, "cover"),
    coverAlt: getOptionalString(frontmatter, "coverAlt"),
    coverCaption: getOptionalString(frontmatter, "coverCaption"),
    coverType: frontmatter.coverType as ProjectMeta["coverType"],
    coverAspectRatio: frontmatter.coverAspectRatio as
      | ProjectMeta["coverAspectRatio"]
      | undefined,
  };
}

function inferProjectName(
  frontmatter: FrontmatterData,
  pathInfo: PathInfo,
): string | undefined {
  const projectFromFrontmatter = String(frontmatter.project || "").trim();
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

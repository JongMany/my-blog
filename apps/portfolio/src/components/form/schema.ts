// apps/portfolio/src/form/schema.ts
import { z } from "zod";

export const LinkSchema = z.object({
  label: z.string().min(1, "필수"),
  href: z.string().url("URL 형식"),
});

export const ProjectSchema = z.object({
  slug: z
    .string()
    .min(1, "필수")
    .regex(/^[a-z0-9-]+$/, "소문자/숫자/하이픈만"),
  title: z.string().min(1, "필수"),
  summary: z.string().optional().default(""),
  project: z.string().optional().default(""),
  date: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{4}(-\d{2})?$/.test(v), "YYYY 또는 YYYY-MM"),
  pinned: z.boolean().optional().default(false),
  tags: z.array(z.string().min(1)).default([]),
  thumb: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v : undefined))
    .refine(
      (v) => !v || /^https?:\/\//.test(v),
      "http(s):// 로 시작해야 합니다"
    ),
  images: z
    .array(z.string())
    .default([])
    .transform((arr) => arr.filter((s) => s.trim()))
    .refine(
      (arr) => arr.every((v) => /^https?:\/\//.test(v)),
      "이미지 URL은 http(s)://"
    ),
  body: z.array(z.string().min(1)).default([]),
  links: z.array(LinkSchema).default([]),
});

export type ProjectInput = z.infer<typeof ProjectSchema>;

type SectionSize = "lg" | "md" | "sm";

export interface Section {
  id: string;
  label: string;
  description: string;
  href: string;
  color: string;
  size: SectionSize;
  tags?: string[];
}

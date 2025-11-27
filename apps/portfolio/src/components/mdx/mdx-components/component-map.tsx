import { Image, Video, Mermaid, MDXLink } from "../custom";
import {
  createHeading,
  Paragraph,
  UnorderedList,
  OrderedList,
  ListItem,
  Blockquote,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Anchor,
  HorizontalRule,
  Strong,
  Emphasis,
  Pre,
  Code,
  Div,
} from "./index";

// 컴포넌트 맵을 한 번만 생성하여 재사용 (메모이제이션)
const MDX_COMPONENT_MAP = {
  Image,
  img: Image,
  Link: MDXLink,
  Video,
  Mermaid,
  h1: createHeading("h1"),
  h2: createHeading("h2"),
  h3: createHeading("h3"),
  h4: createHeading("h4"),
  h5: createHeading("h5"),
  h6: createHeading("h6"),
  p: Paragraph,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  blockquote: Blockquote,
  table: Table,
  thead: TableHead,
  tbody: TableBody,
  tr: TableRow,
  th: TableHeader,
  td: TableCell,
  a: Anchor,
  hr: HorizontalRule,
  strong: Strong,
  em: Emphasis,
  pre: Pre,
  div: Div,
  code: Code,
} as const;

export function createMdxComponentMap() {
  return MDX_COMPONENT_MAP;
}

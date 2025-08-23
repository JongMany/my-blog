export type Post = {
  id: string;
  title: string;
  content: string;
  categories: string[]; // slug 배열
  createdAt: number;
};

export type Category = { name: string; slug: string };

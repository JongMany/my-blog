export const imageSource = (
  src: string,
  prefix: "portfolio" | "blog" | "" | "resume",
  devUrl: string,
) => {
  return import.meta.env.MODE === "development"
    ? `http://localhost:3002/${src}`
    : `/my-blog/portfolio${src}`;
};

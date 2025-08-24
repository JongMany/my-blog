export const imageSource = (src: string) => {
  return import.meta.env.MODE === "development"
    ? `http://localhost:3002/${src}`
    : `/my-blog/portfolio${src}`;
};

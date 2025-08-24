export const imageSource = (
  src: string,
  prefix: "portfolio" | "blog" | "" | "resume",
  devUrl: string
) => {
  return import.meta.env.MODE === "development"
    ? `${devUrl}/${src}`
    : `/my-blog/${prefix}${src}`;
};

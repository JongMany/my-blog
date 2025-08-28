// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import { listPosts } from "../../service/api";
// import PostList from "../../components/PostList";

// export default function PostsPage() {
//   const { data = [] } = useQuery({ queryKey: ["posts"], queryFn: listPosts });
//   return (
//     <div>
//       <h3 className="mb-3 text-lg font-medium">전체 글</h3>
//       <PostList items={data} />
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { MDXProvider } from "@mdx-js/react";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime"; // jsx-runtime 직접 주입
import remarkGfm from "remark-gfm";
import { useLoaderData } from "react-router-dom";

export default function PostPage() {
  const { post, mdx } = useLoaderData() as { post: any; mdx: string };
  const [Content, setContent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    (async () => {
      const compiled = await evaluate(mdx, {
        remarkPlugins: [remarkGfm],
        jsx: runtime.jsx,
        jsxs: runtime.jsxs,
        Fragment: runtime.Fragment,
      });
      setContent(() => compiled.default);
    })();
  }, [mdx]);

  return (
    <article className="prose prose-invert max-w-none">
      <h1>{post.title}</h1>
      {Content && (
        <MDXProvider>
          <Content />
        </MDXProvider>
      )}
    </article>
  );
}

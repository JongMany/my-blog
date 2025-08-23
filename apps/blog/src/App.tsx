import { useAppStore } from "@mfe/shared";
import "./App.css";
import { useQuery } from "@tanstack/react-query";
import { Link, Route, Routes } from "react-router-dom";

import BlogHome from "./pages/home/BlogHome";
import BlogLayout from "./components/Layout";
import PostsPage from "./pages/posts/PostsPage";
import CategoriesPage from "./pages/categories/CategoriesPage";
import CategoryPage from "./pages/category/CategoryPage";
import PostDetail from "./pages/detail/PostDetail";
import WritePage from "./pages/write/WritePage";

export default function BlogApp() {
  return (
    <Routes>
      <Route
        index
        element={
          <BlogLayout>
            <BlogHome />
          </BlogLayout>
        }
      />
      <Route
        path="posts"
        element={
          <BlogLayout>
            <PostsPage />
          </BlogLayout>
        }
      />
      <Route
        path="categories"
        element={
          <BlogLayout>
            <CategoriesPage />
          </BlogLayout>
        }
      />
      <Route
        path="categories/:slug"
        element={
          <BlogLayout>
            <CategoryPage />
          </BlogLayout>
        }
      />
      <Route
        path="post/:id"
        element={
          <BlogLayout>
            <PostDetail />
          </BlogLayout>
        }
      />
      <Route
        path="write"
        element={
          <BlogLayout>
            <WritePage />
          </BlogLayout>
        }
      />
    </Routes>
  );
}

// function Post() {
//   // const { slug = "" } = useParams();
//   // const { data } = useQuery({
//   //   queryKey: qk.post(slug),
//   //   queryFn: async () => ({ id: slug, title: `Post ${slug}` }),
//   // });
//   const { data } = useQuery({
//     queryKey: ["posts"],
//     queryFn: async () => {
//       const response = await fetch(
//         "https://jsonplaceholder.typicode.com/posts"
//       );
//       return response.json();
//     },
//   });

//   const theme = useAppStore((s) => s.theme);
//   return (
//     <div>
//       <span>({theme})</span>
//       {data?.slice(0, 10).map((item) => (
//         <div>
//           <h4>{item.title}</h4>
//         </div>
//       ))}
//       {/* {data?.title} */}
//     </div>
//   );
// }

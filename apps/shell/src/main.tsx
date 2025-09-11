import ReactDOM from "react-dom/client";

import { BrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { router } from "./router";

const queryClient = new QueryClient();

const RAW_BASE = import.meta.env.BASE_URL || "/";
const BASENAME = RAW_BASE.endsWith("/") ? RAW_BASE.slice(0, -1) : RAW_BASE;

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <BrowserRouter basename={BASENAME}>
  <QueryClientProvider client={queryClient}>
    {/* <App /> */}
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
  // </BrowserRouter>
);

import { Outlet, createRootRoute } from "@tanstack/react-router";

import { ContentContainer } from "@/components/layout/ContentContainer";
import { ErrorPage } from "@/components/layout/ErrorPage";
import { NotFoundPage } from "@/components/layout/NotFoundPage";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background">
      <Header />
      <ContentContainer>
        <Outlet />
      </ContentContainer>
      <Toaster />
    </div>
  ),
  errorComponent: () => <ErrorPage />,
  notFoundComponent: () => <NotFoundPage />,
});

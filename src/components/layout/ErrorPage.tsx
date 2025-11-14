import { AlertTriangle, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const ErrorPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full px-4 py-6 flex-1 flex items-center justify-center">
        <div className="flex items-center justify-center">
          <Card className="max-w-2xl w-full p-8 md:p-12">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-destructive/10 rounded-full blur-3xl" />
                <div className="relative bg-muted rounded-full p-6">
                  <AlertTriangle className="h-16 w-16 md:h-20 md:w-20 text-destructive" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px w-12 bg-border" />
                  <h1 className="text-6xl md:text-7xl text-muted-foreground/60">
                    {t("errorPage.title")}
                  </h1>
                  <div className="h-px w-12 bg-border" />
                </div>

                <p className="">{t("errorPage.description")}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-4">
                <Button size="lg" className="gap-2" asChild>
                  <Link to="/">
                    <Home className="h-4 w-4" />
                    {t("general.backToHomepage")}
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

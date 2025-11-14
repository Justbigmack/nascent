import { ContentContainer } from "@/components/layout/ContentContainer";
import { LanguageSwitcher } from "@/components/shared/i18n/LanguageSwitcher";
import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="py-3">
        <ContentContainer>
          <div className="flex items-center justify-between max-w-[1300px] mx-auto">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-xl">{t("general.appTitle")}</span>
            </div>
            <LanguageSwitcher />
          </div>
        </ContentContainer>
      </div>
    </header>
  );
};

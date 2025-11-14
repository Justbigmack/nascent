import { type PropsWithChildren } from "react";

export const ContentContainer = ({ children }: PropsWithChildren) => {
  return (
    <div className="max-w-[1300px] mx-auto w-full px-8 lg:px-6">{children}</div>
  );
};

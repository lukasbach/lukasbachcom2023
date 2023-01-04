import React, { FC, PropsWithChildren } from "react";
import { LayoutProvider } from "./layout-provider";
import { PageHeader } from "../atoms/page-header";

export const PageLayout: FC<PropsWithChildren<{}>> = ({ children }) => (
  <LayoutProvider>
    <PageHeader />
    {children}
  </LayoutProvider>
);

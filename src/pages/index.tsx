import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { LayoutProvider } from "../components/layouts/layout-provider";
import { HomeHeader } from "../components/home/home-header";
import { FeaturedProjects } from "../components/home/featured-projects";
import { BlogPreview } from "../components/home/blog-preview";

const IndexPage: React.FC<PageProps> = () => (
  <LayoutProvider>
    <HomeHeader />
    <FeaturedProjects />
    <BlogPreview />
  </LayoutProvider>
);

export default IndexPage;

export const Head: HeadFC = () => (
  <>
    <title>lukasbach.com</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
    <link
      href="https://fonts.googleapis.com/css2?family=Barlow:wght@200;300&family=Comfortaa:wght@300;400&family=Exo+2:wght@200;300;400;500&family=Kanit:wght@200&display=swap"
      rel="stylesheet"
    />
  </>
);

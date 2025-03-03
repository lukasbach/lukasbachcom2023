import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { LayoutProvider } from "../components/layouts/layout-provider";
import { HomeHeader } from "../components/home/home-header";
import { FeaturedProjects } from "../components/home/featured-projects";
import { BlogPreview } from "../components/home/blog-preview";
import { PageHead } from "../components/atoms/page-head";
import { Resources } from "../components/home/resources";
import { Footer } from "../components/atoms/footer";
import { Releases } from "../components/home/releases";

const IndexPage: React.FC<PageProps> = () => (
  <LayoutProvider>
    <HomeHeader />
    <FeaturedProjects />
    <BlogPreview />
    <Resources />
    <Releases />
    <Footer wide />
  </LayoutProvider>
);

export default IndexPage;

export const Head: HeadFC = () => <PageHead title={null} />;

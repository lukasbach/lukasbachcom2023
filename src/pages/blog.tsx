import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { Title } from "@mantine/core";
import { graphql, useStaticQuery } from "gatsby";
import { PageHead } from "../components/atoms/page-head";
import { ContentGrid } from "../components/atoms/content-grid";
import { PageLayout } from "../components/layouts/page-layout";
import { BigListItem } from "../components/atoms/big-list-item";

const useBlogEntries = () =>
  useStaticQuery<Queries.AllBlogEntriesQuery>(graphql`
    query AllBlogEntries {
      allMarkdownRemark(sort: { frontmatter: { date: DESC } }, filter: { frontmatter: { kind: { eq: "blog" } } }) {
        nodes {
          timeToRead
          frontmatter {
            slug
            title
            category
            date(formatString: "MMMM DD, YYYY")
          }
          excerpt(truncate: true, format: PLAIN, pruneLength: 200)
        }
      }
    }
  `);
const Page: React.FC<PageProps> = () => {
  const blogEntries = useBlogEntries();
  return (
    <PageLayout>
      <ContentGrid>
        <Title order={1} color="white" mb={64}>
          Blog
        </Title>
        {blogEntries.allMarkdownRemark.nodes.map(article => (
          <BigListItem
            key={article.frontmatter?.slug ?? ""}
            category={article.frontmatter?.category ?? ""}
            title={article.frontmatter?.title ?? ""}
            text={article.excerpt ?? ""}
            timeToRead={article.timeToRead ?? 5}
            date={article.frontmatter?.date ?? ""}
            slug={article.frontmatter?.slug ?? ""}
          />
        ))}
      </ContentGrid>
    </PageLayout>
  );
};

export default Page;

export const Head: HeadFC = () => <PageHead title="Projects" />;

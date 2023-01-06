import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { Text, Title } from "@mantine/core";
import { graphql, useStaticQuery } from "gatsby";
import { PageHead } from "../components/atoms/page-head";
import { ContentGrid } from "../components/atoms/content-grid";
import { PageLayout } from "../components/layouts/page-layout";
import { BigListItem } from "../components/atoms/big-list-item";
import { CategoryText } from "../components/atoms/category-text";

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
            title={article.frontmatter?.title ?? ""}
            text={article.excerpt ?? ""}
            left={
              <Text>
                <CategoryText>{article.frontmatter?.category}</CategoryText>
              </Text>
            }
            right={
              <>
                <Text>{article.frontmatter?.date}</Text>
                <Text>{article.timeToRead ?? 5} minutes</Text>
              </>
            }
            to={article.frontmatter?.slug ?? ""}
          />
        ))}
      </ContentGrid>
    </PageLayout>
  );
};

export default Page;

export const Head: HeadFC = () => <PageHead title="Projects" />;

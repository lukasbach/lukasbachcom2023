import React, { FC } from "react";
import { Text, Center, Title, Box } from "@mantine/core";
import { graphql, Link, useStaticQuery } from "gatsby";
import { TransparentButton } from "../atoms/transparent-button";
import { ContentGrid } from "../atoms/content-grid";
import { BigListItem } from "../atoms/big-list-item";
import { CategoryText } from "../atoms/category-text";
import { getBlogTarget } from "../../util";

const useBlogEntries = () =>
  useStaticQuery<Queries.BlogPreviewQuery>(graphql`
    query BlogPreview {
      allMarkdownRemark(
        sort: { frontmatter: { date: DESC } }
        limit: 3
        filter: { frontmatter: { kind: { eq: "blog" } } }
      ) {
        nodes {
          timeToRead
          frontmatter {
            slug
            title
            category
            date(formatString: "MMMM DD, YYYY")
            medium
            devto
          }
          excerpt(truncate: true, format: PLAIN, pruneLength: 200)
        }
      }
    }
  `);

export const BlogPreview: FC = () => {
  const blogEntries = useBlogEntries();
  return (
    <Box
      py={64}
      sx={theme => ({
        backgroundColor: theme.colors.dark[8],
      })}
    >
      <ContentGrid wide>
        <Title order={2} mb={64}>
          Recent Blog Posts
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
            to={getBlogTarget(article.frontmatter).href}
            target={getBlogTarget(article.frontmatter).target}
          />
        ))}
      </ContentGrid>
      <Center mt={64}>
        <TransparentButton component={Link} to="/blog">
          More Blog Articles
        </TransparentButton>
      </Center>
    </Box>
  );
};

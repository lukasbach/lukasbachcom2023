import React, { FC } from "react";
import { Text, Center, Grid, Title, Box } from "@mantine/core";
import { graphql, Link, useStaticQuery } from "gatsby";
import { TransparentButton } from "../atoms/transparent-button";
import { ContentGrid } from "../atoms/content-grid";

const BlogEntry: FC<{
  category: string;
  title: string;
  text: string;
  date: string;
  timeToRead: number;
  slug: string;
}> = ({ category, title, text, date, timeToRead, slug }) => (
  <Box
    component={Link}
    to={slug}
    sx={theme => ({
      display: "block",
      fontSize: "14px",
      borderRadius: theme.radius.lg,
      color: theme.colors.gray[6],
      cursor: "pointer",
      textDecoration: "none",
      ":focus": {
        outline: `2px solid ${theme.white}`,
      },
      ":hover": {
        backgroundColor: theme.colors.dark[9],
      },
    })}
    mb={16}
    px={32}
    py={32}
  >
    <Grid>
      <Grid.Col lg={2}>
        <Text>{category}</Text>
      </Grid.Col>
      <Grid.Col lg={8}>
        <Title order={4} size={24} color="white" mt={-8} mb={8}>
          {title}
        </Title>
        <Text>{text}</Text>
      </Grid.Col>
      <Grid.Col lg={2} sx={{ textAlign: "right" }}>
        <Text>{date}</Text>
        <Text>{timeToRead} minutes</Text>
      </Grid.Col>
    </Grid>
  </Box>
);

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
      <ContentGrid>
        <Title order={2} mb={64}>
          Recent Blog Posts
        </Title>
        {blogEntries.allMarkdownRemark.nodes.map(article => (
          <BlogEntry
            category={article.frontmatter?.category ?? ""}
            title={article.frontmatter?.title ?? ""}
            text={article.excerpt ?? ""}
            timeToRead={article.timeToRead ?? 5}
            date={article.frontmatter?.date ?? ""}
            slug={article.frontmatter?.slug ?? ""}
          />
        ))}
      </ContentGrid>
      <Center mt={64}>
        <TransparentButton>More Blog Articles</TransparentButton>
      </Center>
    </Box>
  );
};

import React, { FC } from "react";
import { Text, Title, Box } from "@mantine/core";
import { graphql, useStaticQuery } from "gatsby";
import { ContentGrid } from "../atoms/content-grid";
import { BigListItem } from "../atoms/big-list-item";
import { CategoryText } from "../atoms/category-text";

const useResourceEntries = () =>
  useStaticQuery<Queries.ResourcesListQuery>(graphql`
    query ResourcesList {
      allMarkdownRemark(sort: { frontmatter: { date: DESC } }, filter: { frontmatter: { kind: { eq: "resource" } } }) {
        nodes {
          timeToRead
          frontmatter {
            slug
            title
            category
            description
            date(formatString: "MMMM DD, YYYY")
          }
          excerpt(truncate: true, format: PLAIN, pruneLength: 200)
        }
      }
    }
  `);

export const Resources: FC = () => {
  const resourceEntries = useResourceEntries();
  return (
    <Box
      py={64}
      // sx={theme => ({
      //   backgroundColor: theme.colors.dark[7],
      // })}
    >
      <ContentGrid>
        <Title order={2} mb={64}>
          Resources
        </Title>
        {resourceEntries.allMarkdownRemark.nodes.map(article => (
          <BigListItem
            key={article.frontmatter?.slug ?? ""}
            title={article.frontmatter?.title ?? ""}
            text={article.frontmatter?.description ?? article.excerpt ?? ""}
            left={
              <Text>
                <CategoryText>{article.frontmatter?.category}</CategoryText>
              </Text>
            }
            right={<Text>{article.frontmatter?.date}</Text>}
            to={article.frontmatter?.slug ?? ""}
          />
        ))}
      </ContentGrid>
    </Box>
  );
};

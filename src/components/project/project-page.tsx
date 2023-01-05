import React, { FC } from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { Box, Flex, Grid, Group, Text, Title, TypographyStylesProvider } from "@mantine/core";
import { PageLayout } from "../layouts/page-layout";
import { ContentGrid } from "../atoms/content-grid";
import { StatCard } from "../atoms/stat-card";

const useProjectData = (repo: string) =>
  useStaticQuery<Queries.ProjectDataQuery>(graphql`
    query ProjectData {
      allRepo {
        nodes {
          name
          full_name
          title
          owner {
            login
          }
          homepageData {
            repo
            npm
            category
            tags
          }
          latestRelease {
            data {
              url
              name
              created_at
              published_at
              assets {
                name
                url
              }
            }
          }
          stargazers_count
          watchers_count
          open_issues_count
          created_at
          license {
            name
            key
          }
          homepage
          description
        }
      }
    }
  `).allRepo.nodes.find(r => r.full_name === repo);

export const ProjectPage: FC<{ repo: string; markdownRemark: Queries.MarkdownRemarkPageQuery["markdownRemark"] }> = ({
  repo,
  markdownRemark,
}) => {
  const repoData = useProjectData(repo);

  if (!markdownRemark?.frontmatter || !repoData) {
    return null;
  }

  return (
    <PageLayout>
      <ContentGrid>
        <Flex sx={{ alignItems: "center" }} mb={32}>
          <Box sx={{ flexGrow: 1, fontWeight: 300 }}>
            <Text color="white" sx={{ textTransform: "capitalize" }}>
              {repoData.homepageData?.category}
            </Text>
            <Title order={1} lh={0.9} mb={8} color="white">
              {repoData.title}
            </Title>
            <Text color="white">{new Date(repoData.created_at ?? 0).toDateString()}</Text>
          </Box>
          <Text size="md" align="right" sx={{ maxWidth: "350px", fontWeight: 300 }} ml={32}>
            {repoData.description}
          </Text>
        </Flex>

        <Group sx={{ borderBottom: "1px solid white" }} mb={32} pb={32}>
          <StatCard title="Homepage">{repoData.homepage}</StatCard>
          <StatCard title="Github">{repoData.name}</StatCard>
          <StatCard title="Latest Release">{repoData.latestRelease?.data?.name}</StatCard>
          <StatCard title="License">{repoData.license?.name}</StatCard>
          <StatCard title="Stars">{repoData.stargazers_count}</StatCard>
          <StatCard title="Open Issues">{repoData.open_issues_count}</StatCard>
        </Group>
      </ContentGrid>
      <ContentGrid
        right={
          <dl>
            <Text component="dt">Homepage</Text>
            <Box component="dd" m={0}>
              <Link to="#">asd</Link>
            </Box>
          </dl>
        }
      >
        <TypographyStylesProvider
          sx={theme => ({
            textAlign: "justify",
            " img": { borderRadius: theme.radius.lg },
            " [data-homepagehide]": { display: "none" },
          })}
        >
          <div dangerouslySetInnerHTML={{ __html: markdownRemark.html ?? "" }} />
        </TypographyStylesProvider>
      </ContentGrid>
    </PageLayout>
  );
};

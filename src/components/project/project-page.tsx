import React, { FC } from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { Box, Divider, Flex, Group, Text, Title, TypographyStylesProvider, useMantineTheme } from "@mantine/core";
import { HiOutlineArrowDownTray } from "react-icons/hi2";
import { PageLayout } from "../layouts/page-layout";
import { ContentGrid } from "../atoms/content-grid";
import { StatCard } from "../atoms/stat-card";

const isNotNullish = <T,>(value: T | null | undefined): value is T => value !== undefined && value !== null;

const useProjectData = (repo?: string) =>
  repo
    ? useStaticQuery<Queries.ProjectDataQuery>(graphql`
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
              }
              latestRelease {
                data {
                  url
                  html_url
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
      `).allRepo.nodes.find(r => r.full_name === repo)
    : null;

export const ProjectPage: FC<{ repo?: string; markdownRemark: Queries.MarkdownRemarkPageQuery["markdownRemark"] }> = ({
  repo,
  markdownRemark,
}) => {
  const repoData = useProjectData(repo);

  if (!markdownRemark?.frontmatter) {
    return null;
  }

  const githubLink = `https://github.com/${repoData?.full_name}`;

  return (
    <PageLayout>
      <ContentGrid>
        <Flex sx={{ alignItems: "center" }}>
          <Box sx={{ flexGrow: 1, fontWeight: 300 }}>
            <Text color="white" sx={{ textTransform: "capitalize" }}>
              {repoData?.homepageData?.category ?? markdownRemark.frontmatter.category}
            </Text>
            <Title order={1} lh={0.9} mb={8} color="white">
              {repoData?.title ?? markdownRemark.frontmatter.title}
            </Title>
            <Text color="white">
              {new Date(repoData?.created_at ?? markdownRemark.frontmatter.date ?? "").toDateString()}
            </Text>
          </Box>
          <Text size="md" align="right" sx={{ maxWidth: "350px", fontWeight: 300 }} ml={32}>
            {repoData?.description ?? ""}
          </Text>
        </Flex>

        <Group sx={{ borderBottom: "1px solid white" }} mb={32} py={16}>
          <StatCard maxWidth="220px" title="Homepage" href={repoData?.homepage}>
            {repoData?.homepage}
          </StatCard>
          <StatCard maxWidth="220px" title="Github" href={githubLink}>
            {repoData?.name}
          </StatCard>
          <StatCard maxWidth="220px" title="Latest Release" href={repoData?.latestRelease?.data?.html_url}>
            {repoData?.latestRelease?.data?.name}
          </StatCard>
          <StatCard maxWidth="220px" title="License">
            {repoData?.license?.name}
          </StatCard>
          <StatCard maxWidth="220px" title="Stars" href={githubLink}>
            {repoData?.stargazers_count}
          </StatCard>
          <StatCard maxWidth="220px" title="Open Issues" href={`${githubLink}/issues`}>
            {repoData?.open_issues_count}
          </StatCard>
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
            " img": { borderRadius: theme.radius.lg, marginBottom: "16px" },
            " [data-homepagehide]": { display: "none" },
          })}
        >
          <div dangerouslySetInnerHTML={{ __html: markdownRemark.html ?? "" }} />
        </TypographyStylesProvider>

        {markdownRemark.frontmatter.download && (
          <>
            <Divider mt={48} mb={32} color="white" />
            <Title order={2}>Downloads</Title>
            {markdownRemark.frontmatter.download
              ?.filter(isNotNullish)
              .map(download => download?.split(";", 2))
              .map(([url, title]) => (
                <StatCard title={url} key={url} icon={<HiOutlineArrowDownTray />} href={url}>
                  {title}
                </StatCard>
              ))}
          </>
        )}
      </ContentGrid>
    </PageLayout>
  );
};

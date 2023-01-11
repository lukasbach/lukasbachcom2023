import React, { FC, useMemo } from "react";
import { graphql, useStaticQuery } from "gatsby";
import { Box, Divider, Flex, Grid, Group, Text, Title, TypographyStylesProvider } from "@mantine/core";
import { HiChevronLeft, HiChevronRight, HiOutlineArrowDownTray } from "react-icons/hi2";
import { PageLayout } from "../layouts/page-layout";
import { ContentGrid } from "../atoms/content-grid";
import { StatCard } from "../atoms/stat-card";
import { isNotNullish, useContainerSize } from "../../util";
import { ProjectSidebar } from "./project-sidebar";

const useProject = (repo?: string) => {
  const data = useStaticQuery<Queries.ProjectDataQuery>(graphql`
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
            highlight
            deprecation
            cliexample
            producthunt
            demo
            docs
            npminstall
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
                browser_download_url
                size
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
  `);
  return useMemo(() => {
    const sorted = [...data.allRepo.nodes].sort(
      (a, b) => new Date(b.created_at ?? "").getTime() - new Date(a.created_at ?? "").getTime()
    );
    const index = sorted.findIndex(r => r.full_name === repo);

    return {
      project: sorted[index],
      previousProject: sorted[index - 1],
      nextProject: sorted[index + 1],
    };
  }, [data.allRepo.nodes, repo]);
};

export const ProjectPage: FC<{ repo?: string; markdownRemark: Queries.MarkdownRemarkPageQuery["markdownRemark"] }> = ({
  repo,
  markdownRemark,
}) => {
  const size = useContainerSize();
  const small = ["xs", "sm"].includes(size);
  const { project, previousProject, nextProject } = useProject(repo);

  if (!markdownRemark?.frontmatter) {
    return null;
  }

  const githubLink = `https://github.com/${project?.full_name}`;

  return (
    <PageLayout>
      <ContentGrid>
        <Flex sx={{ alignItems: small ? "flex-start" : "center", flexDirection: small ? "column" : "row" }}>
          <Box sx={{ flexGrow: 1, fontWeight: 300 }}>
            <Text color="white" sx={{ textTransform: "capitalize" }}>
              {project?.homepageData?.category ?? markdownRemark.frontmatter.category}
            </Text>
            <Title order={1} lh={0.9} mb={8} color="white">
              {project?.title ?? markdownRemark.frontmatter.title}
            </Title>
            <Text color="white">
              {new Date(project?.created_at ?? markdownRemark.frontmatter.date ?? "").toDateString()}
            </Text>
          </Box>
          <Text
            size="md"
            align={small ? "left" : "right"}
            sx={{ maxWidth: "350px", fontWeight: 300 }}
            ml={small ? 0 : 32}
          >
            {project?.description ?? ""}
          </Text>
        </Flex>

        <Group sx={{ borderBottom: "1px solid white" }} mb={32} py={16}>
          <StatCard maxWidth="220px" title="Homepage" href={project?.homepage}>
            {project?.homepage}
          </StatCard>
          <StatCard maxWidth="220px" title="Github" href={githubLink}>
            {project?.name}
          </StatCard>
          <StatCard maxWidth="220px" title="Latest Release" href={project?.latestRelease?.data?.html_url}>
            {project?.latestRelease?.data?.name}
          </StatCard>
          <StatCard maxWidth="220px" title="License">
            {project?.license?.name}
          </StatCard>
          <StatCard maxWidth="220px" title="Stars" href={githubLink}>
            {project?.stargazers_count}
          </StatCard>
          <StatCard maxWidth="220px" title="Open Issues" href={`${githubLink}/issues`}>
            {project?.open_issues_count}
          </StatCard>
        </Group>
      </ContentGrid>
      <ContentGrid right={<ProjectSidebar repo={project} />}>
        <TypographyStylesProvider
          sx={theme => ({
            textAlign: "justify",
            " img": { borderRadius: theme.radius.lg, marginBottom: "16px" },
            " [data-homepagehide]": { display: "none" },
          })}
        >
          <div dangerouslySetInnerHTML={{ __html: markdownRemark.html ?? "" }} />
        </TypographyStylesProvider>
        {previousProject || nextProject ? (
          <Grid>
            <Grid.Col offsetLg={2} lg={4} md={6}>
              {previousProject && (
                <StatCard
                  title={previousProject.title ?? undefined}
                  href={`/projects/${previousProject.name}`}
                  icon={<HiChevronLeft />}
                  isExternal={false}
                >
                  Previous Project
                </StatCard>
              )}
            </Grid.Col>
            <Grid.Col lg={4} md={6}>
              {nextProject && (
                <StatCard
                  title={nextProject.title ?? undefined}
                  href={`/projects/${nextProject.name}`}
                  rightIcon={<HiChevronRight />}
                  isExternal={false}
                >
                  Next Project
                </StatCard>
              )}
            </Grid.Col>
          </Grid>
        ) : null}

        {markdownRemark.frontmatter.download && (
          <>
            <Divider mt={48} mb={32} color="white" />
            <Title order={2}>Downloads</Title>
            {markdownRemark.frontmatter.download
              ?.filter(isNotNullish)
              .map(download => download?.split(";", 2))
              .map(([url, title]) => (
                <StatCard title={url} key={url} icon={<HiOutlineArrowDownTray />} href={url} filled>
                  {title}
                </StatCard>
              ))}
          </>
        )}
      </ContentGrid>
    </PageLayout>
  );
};

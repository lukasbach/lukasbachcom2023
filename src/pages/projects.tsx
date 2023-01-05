import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { Box, Flex, Grid, Text, Title, useMantineTheme } from "@mantine/core";
import { graphql, Link, useStaticQuery } from "gatsby";
import { FC, Fragment } from "react";
import { HiStar } from "react-icons/all";
import { PageHead } from "../components/atoms/page-head";
import { ContentGrid } from "../components/atoms/content-grid";
import { PageLayout } from "../components/layouts/page-layout";

const useProjects = () =>
  useStaticQuery<Queries.ProjectListQuery>(graphql`
    query ProjectList {
      allRepo {
        nodes {
          title
          name
          homepageData {
            category
            highlight
            npm
          }
          stargazers_count
          full_name
          created_at
          homepage
          description
        }
      }
    }
  `).allRepo.nodes;

const useProjectsByYear = () => {
  const projects = useProjects();
  const byYear = projects.reduce<Record<number, ReturnType<typeof useProjects>>>((yearObj, project) => {
    const year = new Date(project.created_at ?? "").getFullYear();
    return {
      ...yearObj,
      [year]: [...(yearObj[year] ?? []), project],
    };
  }, {});
  for (const year of Object.keys(byYear)) {
    byYear[year as any] = [...byYear[year as any]].sort(
      (a, b) => new Date(b.created_at ?? "").getTime() - new Date(a.created_at ?? "").getTime()
    );
  }
  return byYear;
};

const ListItem: FC<{
  year: string | undefined;
  title: string;
  description: string;
  category: string;
  id: string;
  highlighted: boolean;
}> = ({ year, title, description, category, id, highlighted }) => {
  const theme = useMantineTheme();
  return (
    <>
      {year && <Box sx={{ borderTop: `1px solid ${theme.colors.dark[5]}` }} mt={16} mb={12} />}
      <Box
        component={Link}
        to={`/projects/${id}`}
        sx={{
          textDecoration: "none",
          " > *": {
            borderRadius: theme.radius.md,
          },
          ":hover > *": { backgroundColor: theme.colors.dark[8] },
          ":focus > *": {
            outline: `2px solid ${theme.white}`,
          },
        }}
      >
        <Grid gutter="sm" mb={8}>
          <Grid.Col lg={2}>
            <Flex>
              <Text color={theme.white}>{year}</Text>
              {highlighted && (
                <Box sx={{ flexGrow: 1, textAlign: "right", color: theme.white }}>
                  <HiStar />
                </Box>
              )}
            </Flex>
          </Grid.Col>
          <Grid.Col lg={3}>
            <Text color={theme.white}>{title}</Text>
          </Grid.Col>
          <Grid.Col lg={5}>
            <Text color={theme.colors.dark[1]}>{description}</Text>
          </Grid.Col>
          <Grid.Col lg={2}>
            <Text color={theme.colors.dark[3]} sx={{ textTransform: "capitalize" }}>
              {category}
            </Text>
          </Grid.Col>
        </Grid>
      </Box>
    </>
  );
};

const Page: React.FC<PageProps> = () => {
  const projectsByYear = useProjectsByYear();
  const yearList = Object.entries(projectsByYear).sort(([a], [b]) => b.localeCompare(a));
  return (
    <PageLayout>
      <ContentGrid>
        <Title order={1} color="white">
          Projects
        </Title>
        {yearList.map(([year, projects]) => (
          <Fragment key={year}>
            {projects.map((project, i) => (
              <ListItem
                key={project.full_name}
                year={i === 0 ? year : undefined}
                title={project.title ?? ""}
                description={project.description ?? ""}
                category={project.homepageData?.category ?? ""}
                highlighted={project.homepageData?.highlight ?? false}
                id={project.name ?? ""}
              />
            ))}
          </Fragment>
        ))}
      </ContentGrid>
    </PageLayout>
  );
};

export default Page;

export const Head: HeadFC = () => <PageHead title="Projects" />;

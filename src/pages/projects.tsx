import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { Box, Flex, Grid, Input, Text, Title, useMantineTheme } from "@mantine/core";
import { graphql, Link, useStaticQuery } from "gatsby";
import { FC, Fragment, useMemo, useState } from "react";
import { HiMagnifyingGlass, HiStar } from "react-icons/all";
import { useInputState } from "@mantine/hooks";
import { PageHead } from "../components/atoms/page-head";
import { ContentGrid } from "../components/atoms/content-grid";
import { PageLayout } from "../components/layouts/page-layout";
import { TransparentButton } from "../components/atoms/transparent-button";

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

const useProjectsByYear = (search: string, filters: string[]) => {
  const projects = useProjects();
  const projectsByYear = useMemo(() => {
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
    console.log("!");
    return Object.entries(byYear).sort(([a], [b]) => b.localeCompare(a));
  }, [projects]);
  return useMemo(
    () =>
      projectsByYear
        .map(
          ([year, yearProjects]) =>
            [
              year,
              yearProjects.filter(project => {
                if (filters.length > 0 && !filters.includes(project.homepageData?.category ?? "")) {
                  return false;
                }

                if (
                  search.length > 0 &&
                  !`${project.title} ${project.full_name} ${project.description} ${project.homepageData?.category}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
                ) {
                  return false;
                }

                return true;
              }),
            ] as const
        )
        .filter(([, yearProjects]) => yearProjects.length > 0),
    [projectsByYear, search, filters]
  );
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
          <Grid.Col lg={2} sx={{ textAlign: "right" }}>
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
  const [search, setSearch] = useInputState("");
  const [filters, setFilters] = useState<string[]>([]);
  const toggleFilter = (filter: string) => setFilters(!filters.includes(filter) ? [filter] : []);
  // setFilters(!filters.includes(filter) ? [...filters, filter] : filters.filter(f => f !== filter));
  const yearList = useProjectsByYear(search, filters);
  return (
    <PageLayout>
      <ContentGrid>
        <Title order={1} color="white">
          Projects
        </Title>

        <Flex sx={{ alignItems: "center" }} mt={32}>
          <Box sx={{ flexGrow: 1 }}>
            <Input value={search} onChange={setSearch} placeholder="Search projects..." icon={<HiMagnifyingGlass />} />
          </Box>
          {["app", "library", "game", "template", "cli", "fun"].map(filter => {
            const isActive = filters.includes(filter);
            return (
              <TransparentButton
                key={filter}
                sx={{ textTransform: "capitalize" }}
                active={isActive}
                onClick={() => toggleFilter(filter)}
                compact
                ml={8}
                aria-label={
                  isActive ? `Filtering list for "${filter}". Click to disable filter` : `Filter for "${filter}"`
                }
              >
                {filter}
              </TransparentButton>
            );
          })}
        </Flex>

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

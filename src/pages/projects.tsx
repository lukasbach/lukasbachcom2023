import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { Box, Flex, Input, Title } from "@mantine/core";
import { Link } from "gatsby";
import { Fragment, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/all";
import { useInputState } from "@mantine/hooks";
import { PageHead } from "../components/atoms/page-head";
import { ContentGrid } from "../components/atoms/content-grid";
import { PageLayout } from "../components/layouts/page-layout";
import { TransparentButton } from "../components/atoms/transparent-button";
import { DetailedListItem } from "../components/atoms/detailed-list-item";
import { useProjectsByYear } from "../hooks/use-projects-by-year";

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
              <DetailedListItem
                key={project.full_name}
                listCategory={i === 0 ? year : undefined}
                title={project.title ?? ""}
                description={project.description ?? ""}
                meta={project.homepageData?.category ?? ""}
                highlighted={project.homepageData?.highlight ?? false}
                component={Link}
                to={`/projects/${project.name ?? ""}`}
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

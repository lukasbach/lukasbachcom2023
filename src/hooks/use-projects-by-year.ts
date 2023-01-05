import { graphql, useStaticQuery } from "gatsby";
import { useMemo } from "react";

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

export const useProjectsByYear = (search: string, filters: string[]) => {
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

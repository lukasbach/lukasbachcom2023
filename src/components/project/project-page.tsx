import React, { FC } from "react";
import { graphql, useStaticQuery } from "gatsby";

const useProjectData = (repo: string) =>
  useStaticQuery<Queries.ProjectDataQuery>(graphql`
    query ProjectData {
      allRepo {
        nodes {
          name
          full_name
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

export const ProjectPage: FC<{ repo: string }> = ({ repo }) => {
  const repoData = useProjectData(repo);
  return (
    <pre>
      x: {repo} {JSON.stringify(repoData)}
    </pre>
  );
};

import { Octokit } from "octokit";
import { GatsbyNode } from "gatsby";
import { writeFileSync, readFileSync } from "fs";
import yaml from "js-yaml";
import { components } from "@octokit/openapi-types";
import config from "./gatsby-config";

const octokit = new Octokit({ auth: process.env.GITHUB_API_KEY });
octokit.rest.rateLimit.get().then(limit => console.log("Rate limiting: ", limit.data.rate));

const decodeFile = (
  data:
    | components["schemas"]["content-directory"]
    | components["schemas"]["content-file"]
    | components["schemas"]["content-symlink"]
    | components["schemas"]["content-submodule"]
) => (!Array.isArray(data) && data.type === "file" ? Buffer.from(data.content, "base64").toString("ascii") : null);

const readGithubFile = (owner: string, repo: string, path: string) =>
  octokit.rest.repos
    .getContent({
      owner,
      repo,
      path,
    })
    .then(({ data }) => decodeFile(data))
    .catch(() => null);

export const sourceNodes: GatsbyNode["sourceNodes"] = async ({ actions, createNodeId, createContentDigest }) => {
  const projectData: any = yaml.load(readFileSync("./data/project-data.yaml", "utf-8"));

  const iterator = await octokit.paginate.iterator(octokit.rest.repos.listForUser, {
    per_page: 50,
    username: config.siteMetadata.githubUser,
  });

  for await (const { data: repos } of iterator) {
    const readmeArray = await Promise.all(
      repos.map(
        async ({ owner, name }) =>
          (await readGithubFile(owner.login, name, "homepage-readme.md")) ??
          (await readGithubFile(owner.login, name, "README.MD")) ??
          (await readGithubFile(owner.login, name, "readme.md")) ??
          (await readGithubFile(owner.login, name, "README.md")) ??
          (await readGithubFile(owner.login, name, "readme.MD"))
      )
    );
    const homepageDataArray = await Promise.all(
      repos.map(({ owner, name }) =>
        readGithubFile(owner.login, name, "homepagedata.json")
          .then(data => (data ? JSON.parse(data) : null))
          .catch(() => null)
      )
    );
    const latestReleaseArray = await Promise.all(
      repos.map(({ owner, name }) =>
        octokit.rest.repos.getLatestRelease({ owner: owner.login, repo: name }).catch(() => null)
      )
    );

    for (const [index, repo] of repos.entries()) {
      if (repo.private || repo.fork) {
        continue;
      }

      const readme = readmeArray[index];
      const latestRelease = latestReleaseArray[index];

      const homepageData = {
        title: repo.name,
        homepage: repo.homepage,
        description: repo.description,
        ...projectData.find((project: any) => project.repo === repo.name),
        ...homepageDataArray[index],
      };

      actions.createNode({
        ...repo,
        title: homepageData.title,
        latestRelease,
        readme,
        homepageData,
        id: createNodeId(repo.full_name),
        internal: {
          type: "repo",
          contentDigest: createContentDigest(repo),
        },
      });

      const frontmatter = Object.entries({
        slug: `/project/${repo.name}`,
        title: homepageData.title,
        date: repo.created_at,
        repo: repo.full_name,
        kind: "project",
      }).reduce((acc, [key, value]) => `${acc}\n${key}: "${value}"`, "");

      const cleanedReadme = (readme ?? "")
        .replace(/[^\n]*img.shields\.io[^\n]*\n/g, "")
        .replace(/[^\n]*sonarcloud\.io\/api\/project_badges[^\n]*\n/g, "")
        .replace(/[^\n]*producthunt\.com[^\n]*\n/g, "")
        .replace(/[^\n]*badgen\.net[^\n]*\n/g, "")
        .replace(/[^\n]*badge\.svg[^\n]*\n/g, "") // github workflow badges
        .replace(/\n> [^\n]*/g, "")
        .replace(/\n# [^\n]*/g, "")
        .replace(/^# [^\n]*/g, "");

      writeFileSync(`${__dirname}/content/projects/${repo.name}.md`, `---${frontmatter}\n---\n\n${cleanedReadme}`);
    }
  }
  console.log("Finished loading data from github");
};

import { Octokit } from "octokit";
import { GatsbyNode } from "gatsby";
import { writeFile } from "fs";
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
export const sourceNodes: GatsbyNode["sourceNodes"] = async ({ actions, createNodeId, createContentDigest }) => {
  const iterator = await octokit.paginate.iterator(octokit.rest.repos.listForUser, {
    per_page: 50,
    username: config.siteMetadata.githubUser,
  });

  for await (const { data: repos } of iterator) {
    for (const repo of repos) {
      const readme = await octokit.rest.repos
        .getContent({
          owner: repo.owner.login,
          repo: repo.name,
          path: "readme.md",
        })
        .then(({ data }) => decodeFile(data))
        .catch(() => null);
      const homepageData = await octokit.rest.repos
        .getContent({
          owner: repo.owner.login,
          repo: repo.name,
          path: "homepagedata.json",
        })
        .then(({ data }) => decodeFile(data))
        .catch(() => null);
      actions.createNode({
        ...repo,
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
        title: repo.name,
        date: repo.created_at,
        repo: repo.full_name,
      }).reduce((acc, [key, value]) => `${acc}\n${key}: "${value}"`, "");

      await new Promise<void>((res, rej) => {
        writeFile(`${__dirname}/content/projects/${repo.name}.md`, `---\n${frontmatter}\n---\n\n${readme}`, err => {
          if (err) {
            rej(err);
          } else {
            res();
          }
        });
      });
    }
  }
  console.log("Finished loading data from github");
};

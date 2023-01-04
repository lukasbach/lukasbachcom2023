import { Octokit } from "octokit";
import { GatsbyNode } from "gatsby";
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
    const readmeArray = await Promise.all(
      repos.map(({ owner, name }) =>
        octokit.rest.repos
          .getContent({
            owner: owner.login,
            repo: name,
            path: "readme.md",
          })
          .then(({ data }) => decodeFile(data))
          .catch(() => null)
      )
    );
    console.log(readmeArray);
    const homepageDataArray = await Promise.all(
      repos.map(({ owner, name }) =>
        octokit.rest.repos
          .getContent({
            owner: owner.name!,
            repo: name,
            path: "homepagedata.json",
          })
          .then(({ data }) => decodeFile(data))
          .catch(() => null)
      )
    );
    console.log(homepageDataArray);

    for (const [index, repo] of repos.entries()) {
      const readme = readmeArray[index];
      const homepageData = homepageDataArray[index];
      console.log(repo.full_name, readme);
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
    }
  }
};

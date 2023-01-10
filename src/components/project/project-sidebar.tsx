import React, { FC } from "react";
import { Alert, Box, Title, Tooltip } from "@mantine/core";
import {
  HiOutlineQuestionMarkCircle,
  HiOutlineHome,
  HiOutlineTag,
  HiOutlineBolt,
  HiOutlineExclamationTriangle,
  HiArrowDownTray,
} from "react-icons/hi2";
import { DiGithubBadge, RiProductHuntLine } from "react-icons/all";
import { CliInput } from "../atoms/cli-input";
import { StatCard } from "../atoms/stat-card";
import { isNotNullish } from "../../util";

const ignoredAssetEndings = [".yml", ".yaml", "blockmap"];
export const ProjectSidebar: FC<{ repo?: Queries.ProjectDataQuery["allRepo"]["nodes"][0] }> = ({ repo }) => {
  if (!repo) {
    return null;
  }

  const websites: { name: string; icon?: JSX.Element; href: string }[] = [
    repo.homepage ? { name: "Homepage", href: repo.homepage, icon: <HiOutlineHome /> } : null,
    repo.homepageData?.docs
      ? { name: "Documentation", href: repo.homepageData?.docs, icon: <HiOutlineQuestionMarkCircle /> }
      : null,
    repo.homepageData?.demo ? { name: "Demo", href: repo.homepageData?.demo, icon: <HiOutlineBolt /> } : null,
    repo.homepageData?.producthunt
      ? {
          name: "Product Hunt",
          href: `https://www.producthunt.com/posts/${repo.homepageData?.producthunt}`,
          icon: <RiProductHuntLine />,
        }
      : null,
    repo.full_name
      ? { name: "Github Repo", href: `https://github.com/${repo.full_name}`, icon: <DiGithubBadge /> }
      : null,
  ].filter(isNotNullish);

  return (
    <>
      <CliInput {...repo.homepageData} />
      {repo.homepageData?.deprecation && (
        <Alert icon={<HiOutlineExclamationTriangle />} color="yellow" radius="lg" variant="outline" mb={32}>
          {repo.homepageData.deprecation}
        </Alert>
      )}
      {repo.homepageData?.npm && (
        <Box mb={32}>
          <Title order={4}>On NPM</Title>
          {repo.homepageData.npm.split(", ").map(pkg => (
            <StatCard key={pkg} icon={<HiOutlineTag />} href={`https://www.npmjs.com/package/${pkg}`} filled>
              {pkg}
            </StatCard>
          ))}
        </Box>
      )}
      {websites.length > 0 && (
        <Box mb={32}>
          <Title order={4}>Websites</Title>
          {websites.map(({ name, icon, href }) => (
            <Tooltip label={href} position="left" offset={32} openDelay={500}>
              <div>
                <StatCard key={href} title={href} icon={icon} href={href} filled>
                  {name}
                </StatCard>
              </div>
            </Tooltip>
          ))}
        </Box>
      )}
      {repo.latestRelease?.data && (
        <Box mb={32}>
          <Title order={4}>Latest Release</Title>
          <StatCard
            title={new Date(repo.latestRelease.data.created_at ?? 0).toDateString()}
            icon={<HiOutlineTag />}
            href={repo.latestRelease.data.html_url}
            filled
          >
            {repo.latestRelease.data.name}
          </StatCard>
          {repo.latestRelease?.data.assets
            ?.filter(isNotNullish)
            .filter(({ name }) => !ignoredAssetEndings.find(ending => name?.endsWith(ending)))
            .map(({ name, browser_download_url, size }) => (
              <Tooltip label={name} position="left" offset={32} openDelay={500}>
                <div>
                  <StatCard
                    key={browser_download_url}
                    title={`${Math.floor(size / (1024 * 1024))}mb`}
                    icon={<HiArrowDownTray />}
                    href={browser_download_url}
                    filled
                  >
                    {name}
                  </StatCard>
                </div>
              </Tooltip>
            ))}
        </Box>
      )}
    </>
  );
};

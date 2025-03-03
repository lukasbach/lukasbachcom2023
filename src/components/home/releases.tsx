import React, { FC } from "react";
import { Title, Box, Center } from "@mantine/core";
import { graphql, Link, useStaticQuery } from "gatsby";
import { ContentGrid } from "../atoms/content-grid";
import { DetailedListItem } from "../atoms/detailed-list-item";
import { TransparentButton } from "../atoms/transparent-button";

const useReleaseEntries = () =>
  useStaticQuery<Queries.ReleasesSubsetQuery>(graphql`
    query ReleasesSubset {
      allRelease(limit: 10, sort: { publishedAt: DESC }) {
        nodes {
          nameWithOwner
          publishedAt
          tagName
          resourcePath
        }
      }
    }
  `);

export const Releases: FC = () => {
  const resourceEntries = useReleaseEntries();
  return (
    <Box
      py={64}
      mb={-128}
      sx={theme => ({
        backgroundColor: theme.colors.dark[8],
      })}
    >
      <ContentGrid wide>
        <Title order={2} mb={64}>
          Recent Releases
        </Title>
        {resourceEntries.allRelease.nodes.map(release => (
          <DetailedListItem
            listCategory={undefined}
            highlighted={false}
            key={release.resourcePath}
            title={release.nameWithOwner ?? ""}
            description={release.tagName ?? ""}
            meta={new Date(release.publishedAt ?? "").toLocaleString()}
            component={Link}
            to={`https://github.com/${release.resourcePath}`}
            target="_blank"
            titleRightAligned
          />
        ))}
      </ContentGrid>
      <Center mt={64}>
        <TransparentButton component={Link} to="/releases">
          More Releases
        </TransparentButton>
      </Center>
    </Box>
  );
};

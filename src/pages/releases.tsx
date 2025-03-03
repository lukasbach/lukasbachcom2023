import * as React from "react";
import { HeadFC, Link, PageProps, graphql, useStaticQuery } from "gatsby";
import { Text, Title } from "@mantine/core";
import { PageHead } from "../components/atoms/page-head";
import { ContentGrid } from "../components/atoms/content-grid";
import { PageLayout } from "../components/layouts/page-layout";
import { DetailedListItem } from "../components/atoms/detailed-list-item";

const useReleaseEntries = () =>
  useStaticQuery<Queries.AllReleasesQuery>(graphql`
    query AllReleases {
      allRelease(limit: 200, sort: { publishedAt: DESC }) {
        nodes {
          nameWithOwner
          publishedAt
          tagName
          resourcePath
        }
      }
    }
  `);

const Page: React.FC<PageProps> = () => {
  const resourceEntries = useReleaseEntries();
  return (
    <PageLayout>
      <ContentGrid wide>
        <Title order={1} color="white" mb={64}>
          Recent Releases
        </Title>
        <Text mb={16}>This list only includes the 10 most recent releases per Repository.</Text>
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
    </PageLayout>
  );
};

export default Page;

export const Head: HeadFC = () => <PageHead title="Releases" description="Recent Releases on GitHub" />;

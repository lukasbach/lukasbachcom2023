import * as React from "react";
import { graphql, HeadFC, PageProps } from "gatsby";
import { Title, TypographyStylesProvider } from "@mantine/core";
import { PageLayout } from "../components/layouts/page-layout";
import { ContentGrid } from "../components/atoms/content-grid";
import { PageHead } from "../components/atoms/page-head";
import { ProjectPage } from "../components/project/project-page";

const BlogPost = ({
  data, // this prop will be injected by the GraphQL query below.
}: PageProps<Queries.MarkdownRemarkPageQuery>) => {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  if (!markdownRemark?.frontmatter || !markdownRemark?.html) {
    return <div>Not loaded..</div>;
  }

  if (markdownRemark.frontmatter.template === "advanced") {
    return <ProjectPage repo={markdownRemark.frontmatter.repo ?? undefined} markdownRemark={markdownRemark} />;
  }

  if (markdownRemark.frontmatter.template === "page") {
    return (
      <PageLayout>
        <ContentGrid>
          <Title order={1}>{markdownRemark.frontmatter.title}</Title>
          <TypographyStylesProvider>
            <div dangerouslySetInnerHTML={{ __html: markdownRemark.html }} />
          </TypographyStylesProvider>
        </ContentGrid>
      </PageLayout>
    );
  }

  return null;
};

export default BlogPost;
// eslint-disable-next-line react/prop-types
export const Head: HeadFC<Queries.Query> = ({ data }) => (
  // eslint-disable-next-line react/prop-types
  <PageHead title={data.markdownRemark?.frontmatter?.title ?? null} />
);

export const pageQuery = graphql`
  query MarkdownRemarkPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        category
        kind
        repo
        download
        template
      }
    }
  }
`;

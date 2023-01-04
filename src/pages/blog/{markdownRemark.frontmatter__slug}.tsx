import * as React from "react";
import { graphql, PageProps } from "gatsby";

const BlogPost = ({
  data, // this prop will be injected by the GraphQL query below.
}: PageProps<Queries.Query>) => {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  if (!markdownRemark?.frontmatter || !markdownRemark?.html) {
    return <div>Not loaded..</div>;
  }
  return (
    <div>
      <div>
        <h1>{markdownRemark.frontmatter.title}</h1>
        <h2>{markdownRemark.frontmatter.date}</h2>
        <div dangerouslySetInnerHTML={{ __html: markdownRemark.html }} />
      </div>
    </div>
  );
};

export default BlogPost;

export const pageQuery = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        category
      }
    }
  }
`;

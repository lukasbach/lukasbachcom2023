import type { GatsbyConfig } from "gatsby";
import * as dotenv from "dotenv";

dotenv.config({
  path: `.env`,
});

const me = {
  title: `Lukas Bach`,
  shortDescription: "Software engineer at GoTo",
  siteUrl: `https://lukasbach.com`,
  githubUser: "lukasbach",
  mediumUser: "@lukasbach",
  linkedinUser: "lukasbach",
  twitterUser: "lukmbach",
  mail: "contact@lukasbach.com",
};

const links = {
  github: `https://github.com/${me.githubUser}`,
  linkedin: `https://www.linkedin.com/in/${me.linkedinUser}`,
  twitter: `https://twitter.com/${me.twitterUser}`,
  medium: `https://medium.com/${me.mediumUser}`,
  mailto: `mailto:${me.mail}`,
};

const siteMetadata = {
  ...me,
  links,
  footer: {
    title: me.title,
    description: me.shortDescription,
    lists: [
      {
        text: "Featured Projects",
        links: [
          {
            text: "React Complex Tree",
            href: `/projects/react-complex-tree`,
          },
          {
            text: "Monaco Auto Typings",
            href: `/projects/monaco-editor-auto-typings`,
          },
          {
            text: "Yana",
            href: `/projects/yana`,
          },
        ],
      },
      {
        text: "Follow me",
        links: [
          {
            text: "GitHub",
            href: links.github,
            isExternal: true,
          },
          {
            text: "LinkedIn",
            href: links.linkedin,
            isExternal: true,
          },
          {
            text: "Medium",
            href: links.medium,
            isExternal: true,
          },
          {
            text: "Twitter",
            href: links.twitter,
            isExternal: true,
          },
        ],
      },
    ],
  },
};

// TODO fonts

const config = {
  siteMetadata,
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-mantine",
    // "gatsby-plugin-google-gtag",
    "gatsby-plugin-image",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /\.svg$/,
        },
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-mdx",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content`,
      },
    },
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-source-medium`,
      options: {
        username: siteMetadata.mediumUser,
      },
    },
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./data/`,
      },
    },
  ],
} satisfies GatsbyConfig;

export default config;

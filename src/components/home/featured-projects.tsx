import React, { FC } from "react";
import { Text, Card, Center, Title, Box, CSSObject, Group } from "@mantine/core";
import { graphql, Link, useStaticQuery } from "gatsby";
import { TransparentButton } from "../atoms/transparent-button";
import { ContentGrid } from "../atoms/content-grid";
import YanaPictogram from "../../svg/yana-picto.svg";
import RctPictogram from "../../svg/rct-picto.svg";
import MatPictogram from "../../svg/mat-picto.svg";

const useRepoCount = () =>
  useStaticQuery<Queries.RepoCountQuery>(graphql`
    query RepoCount {
      allRepo {
        totalCount
      }
    }
  `).allRepo.totalCount;

const ProjectCard: FC<{
  category: string;
  title: string;
  text: string;
  pictogram: JSX.Element;
  svgCss: CSSObject;
  id: string;
}> = ({ category, title, text, pictogram, svgCss, id }) => (
  <Card
    component={Link}
    to={`/projects/${id}`}
    sx={theme => ({
      backgroundColor: theme.white,
      color: theme.colors.gray[7],
      fontSize: "12px",
      position: "relative",
      width: "400px",
      height: "210px",
      cursor: "pointer",
      transition: "transform .05s ease",
      ":focus": {
        outline: `2px solid ${theme.white}`,
        outlineOffset: "3px",
      },
      ":hover": {
        transform: "translateY(0) scale(1.02)",
      },
      " svg": {
        position: "absolute",
        ...svgCss,
      },
    })}
  >
    {pictogram}
    <Box pos="absolute" sx={{ bottom: "20px" }}>
      <Text>{category}</Text>
      <Title order={4} size={24} color="black">
        {title}
      </Title>
      <Text>{text}</Text>
    </Box>
  </Card>
);

export const FeaturedProjects: FC = () => {
  const repoCount = useRepoCount();
  return (
    <Box py={64}>
      <ContentGrid wide>
        <Title order={2} mb={64}>
          Featured Projects
        </Title>
        <Group spacing={32} mb={64}>
          <ProjectCard
            category="Library"
            title="React Complex Tree"
            id="react-complex-tree"
            text="Unopinionated Accessible Tree Component with Multi-Select and Drag-And-Drop"
            pictogram={<RctPictogram />}
            svgCss={{
              top: "10px",
              right: "-75px",
              height: "100px",
            }}
          />
          <ProjectCard
            category="App"
            title="Yana"
            id="yana"
            text="Powerful note-taking app with nested documents, full-text search, rich-text editor, code snippet editor and more"
            pictogram={<YanaPictogram />}
            svgCss={{
              top: "10px",
              right: "-10px",
            }}
          />
          <ProjectCard
            category="Library"
            title="Monaco Editor Auto Typings"
            id="monaco-editor-auto-typings"
            text="Automatically load declaration files while typing in monaco editor instances"
            pictogram={<MatPictogram />}
            svgCss={{
              top: "10px",
              right: "-20px",
              height: "100px",
            }}
          />
        </Group>
      </ContentGrid>
      <Center>
        <TransparentButton component={Link} to="/projects">
          See {repoCount - 3} more projects
        </TransparentButton>
      </Center>
    </Box>
  );
};

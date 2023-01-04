import React, { FC } from "react";
import { Text, Card, Center, Grid, Title, Box, CSSObject, Group } from "@mantine/core";
import { TransparentButton } from "../atoms/transparent-button";
import { ContentGrid } from "../atoms/content-grid";
import YanaPictogram from "../../svg/yana-picto.svg";
import RctPictogram from "../../svg/rct-picto.svg";
import MatPictogram from "../../svg/mat-picto.svg";

const ProjectCard: FC<{ category: string; title: string; text: string; pictogram: JSX.Element; svgCss: CSSObject }> = ({
  category,
  title,
  text,
  pictogram,
  svgCss,
}) => (
  <Card
    sx={theme => ({
      backgroundColor: theme.white,
      color: theme.colors.gray[7],
      fontSize: "12px",
      position: "relative",
      width: "400px",
      height: "210px",
      cursor: "pointer",
      transition: "transform .05s ease",
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

export const FeaturedProjects: FC = () => (
  <>
    <ContentGrid>
      <Title order={2} mb={32}>
        Featured Projects
      </Title>
      <Group spacing={32} mb={32}>
        <ProjectCard
          category="App"
          title="Yana"
          text="Powerful note-taking app with nested documents, full-text search, rich-text editor, code snippet editor and more"
          pictogram={<YanaPictogram />}
          svgCss={{
            top: "10px",
            right: "-10px",
          }}
        />
        <ProjectCard
          category="Library"
          title="React Complex Tree"
          text="Unopinionated Accessible Tree Component with Multi-Select and Drag-And-Drop"
          pictogram={<RctPictogram />}
          svgCss={{
            top: "10px",
            right: "-50px",
            height: "100px",
          }}
        />
        <ProjectCard
          category="Library"
          title="Monaco Editor Auto Typings"
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
      <TransparentButton>See 123 more projects</TransparentButton>
    </Center>
  </>
);

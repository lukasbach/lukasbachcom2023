import React, { FC } from "react";
import { Box, Flex, Group, Title } from "@mantine/core";
import { StaticImage } from "gatsby-plugin-image";
import { Link } from "gatsby";
import { HeaderBg } from "./header-bg";
import { ContentGrid } from "./content-grid";
import { TransparentButton } from "./transparent-button";

export const PageHeader: FC = () => (
  <HeaderBg maxHeight={200} bgOpacity={0.4} gradientStart={0.25}>
    <ContentGrid>
      <Flex py={32} sx={{ alignItems: "center" }}>
        <Box
          component={Link}
          to="/"
          display="flex"
          sx={theme => ({
            color: theme.white,
            textDecoration: "none",
            flexGrow: 1,
            alignItems: "center",
            ":hover, :focus-visible": {
              outline: "none",
              " h1": {
                borderColor: theme.white,
              },
              " [data-gatsby-image-wrapper]": {
                outline: `3px solid ${theme.white}`,
                outlineOffset: "4px",
              },
            },
          })}
        >
          <StaticImage
            src="../../images/profile.jpg"
            alt="Profile Image"
            style={{ borderRadius: 999, minWidth: 64, width: 64, height: 64 }}
          />
          <Title
            ml={32}
            sx={{
              borderBottom: `4px solid transparent`,
              lineHeight: "1.2em",
              fontSize: "30px",
            }}
          >
            Lukas Bach
          </Title>
        </Box>
        <Group>
          <TransparentButton>Projects</TransparentButton>
          <TransparentButton>Blog</TransparentButton>
          <TransparentButton>GitHub</TransparentButton>
        </Group>
      </Flex>
    </ContentGrid>
  </HeaderBg>
);

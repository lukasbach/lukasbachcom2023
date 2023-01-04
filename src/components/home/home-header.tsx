import React, { FC } from "react";
import { Box, Button, Flex, Grid, Group, Header, Text, Title, useMantineTheme } from "@mantine/core";
import { StaticImage } from "gatsby-plugin-image";
import { BsLinkedin, BsMedium, DiGithubBadge, IoMdMail } from "react-icons/all";
import { TransparentButton } from "../atoms/transparent-button";
import { ContentGrid } from "../atoms/content-grid";

export const HomeHeader: FC = () => {
  const theme = useMantineTheme();
  return (
    <Box sx={{ display: "grid" }} mb={32}>
      <StaticImage
        src="../../images/pexels-dexter-fernandes-2646237.jpg"
        layout="fullWidth"
        alt=""
        style={
          {
            gridArea: "1/1",
            maxHeight: 500,
            maskImage: "linear-gradient(180deg, black 0%, black 25%, transparent 100%)",
            "-webkit-mask-image": "linear-gradient(180deg, black 0%, black 25%, transparent 100%)",
            opacity: 0.6,
          } as any
        }
      />
      <div
        style={{
          // By using the same grid area for both, they are stacked on top of each other
          gridArea: "1/1",
          position: "relative",
          // This centers the other elements inside the hero component
          // placeItems: "center",
          // display: "grid",
        }}
      >
        <ContentGrid pt={140}>
          <Group noWrap>
            <StaticImage
              src="../../images/profile.jpg"
              alt="Profile Image"
              style={{ borderRadius: 999, minWidth: 128, width: 128 }}
            />
            <Box pl={32} sx={{ color: "white", flexGrow: 1 }}>
              <Title>Lukas Bach</Title>
              <Text ff="'Exo 2', sans-serif">
                I am a software engineer focused on frontend development. I primarily work with TypeScript and React,
                and am interested in accessibility, infrastructure and architecture. Currently, I work at GoTo.
              </Text>
            </Box>
          </Group>
          <Group mt={16} spacing={8}>
            <TransparentButton leftIcon={<DiGithubBadge />} component="a" href="#">
              GitHub
            </TransparentButton>
            <TransparentButton leftIcon={<BsLinkedin />} component="a" href="#">
              LinkedIn
            </TransparentButton>
            <TransparentButton leftIcon={<BsMedium />} component="a" href="#">
              Medium
            </TransparentButton>
            <TransparentButton leftIcon={<IoMdMail />} component="a" href="#">
              E-Mail
            </TransparentButton>
          </Group>
        </ContentGrid>
      </div>
    </Box>
  );
};

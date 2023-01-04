import React, { FC } from "react";
import { Box, Group, Text, Title, useMantineTheme } from "@mantine/core";
import { StaticImage } from "gatsby-plugin-image";
import { BsLinkedin, BsMedium, DiGithubBadge, IoMdMail } from "react-icons/all";
import { TransparentButton } from "../atoms/transparent-button";
import { ContentGrid } from "../atoms/content-grid";
import { HeaderBg } from "../atoms/header-bg";

export const HomeHeader: FC = () => (
  <HeaderBg maxHeight={500} bgOpacity={0.6} gradientStart={0.25}>
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
            I am a software engineer focused on frontend development. I primarily work with TypeScript and React, and am
            interested in accessibility, infrastructure and architecture. Currently, I work at GoTo.
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
  </HeaderBg>
);

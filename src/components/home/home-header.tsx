import React, { FC } from "react";
import { Box, Flex, Group, Menu, Text, Title } from "@mantine/core";
import { StaticImage } from "gatsby-plugin-image";
import { BsLinkedin, BsMedium } from "react-icons/bs";
import { DiGithubBadge } from "react-icons/di";
import { IoMdMail } from "react-icons/io";
import { graphql, useStaticQuery } from "gatsby";
import { TransparentButton } from "../atoms/transparent-button";
import { ContentGrid } from "../atoms/content-grid";
import { HeaderBg } from "../atoms/header-bg";
import { HeaderLinks } from "../atoms/header-links";
import { useContainerSize } from "../../util";

const useLinks = () =>
  useStaticQuery<Queries.HomeLinksQuery>(graphql`
    query HomeLinks {
      site {
        siteMetadata {
          mail
          links {
            github
            linkedin
            twitter
            medium
            mailto
          }
        }
      }
    }
  `)?.site?.siteMetadata;

export const HomeHeader: FC = () => {
  const { links } = useLinks() ?? {};
  const size = useContainerSize();
  const small = ["xs", "sm", "md"].includes(size);
  return (
    <HeaderBg maxHeight={500} bgOpacity={0.6} gradientStart={0.25}>
      <ContentGrid pt={140} wide>
        <Group noWrap>
          <StaticImage
            src="../../images/profile.jpg"
            alt="Profile Image"
            style={{ borderRadius: 999, minWidth: 128, width: 128 }}
          />
          <Box pl={32} sx={{ color: "white", flexGrow: 1 }}>
            <Title>Lukas Bach</Title>
            <Text ff="'Exo 2', sans-serif" ta="justify">
              I am a software engineer focused on frontend development. I primarily work with TypeScript and React, and
              am interested in accessibility, infrastructure and architecture. Currently, I work at GoTo.
            </Text>
          </Box>
        </Group>
        <Flex sx={{ alignItems: "center" }} mt={16}>
          {small ? (
            <Box sx={{ flexGrow: 1 }}>
              <Menu position="bottom-start">
                <Menu.Target>
                  <TransparentButton>Follow me...</TransparentButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item icon={<DiGithubBadge />} component="a" href={links?.github ?? "#"} target="_blank">
                    GitHub
                  </Menu.Item>
                  <Menu.Item icon={<BsLinkedin />} component="a" href={links?.linkedin ?? "#"} target="_blank">
                    LinkedIn
                  </Menu.Item>
                  <Menu.Item icon={<BsMedium />} component="a" href={links?.medium ?? "#"} target="_blank">
                    Medium
                  </Menu.Item>
                  <Menu.Item icon={<IoMdMail />} component="a" href={links?.mailto ?? "#"} target="_blank">
                    E-Mail
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Box>
          ) : (
            <Group sx={{ flexGrow: 1 }}>
              <TransparentButton leftIcon={<DiGithubBadge />} component="a" href={links?.github ?? "#"} target="_blank">
                GitHub
              </TransparentButton>
              <TransparentButton leftIcon={<BsLinkedin />} component="a" href={links?.linkedin ?? "#"} target="_blank">
                LinkedIn
              </TransparentButton>
              <TransparentButton leftIcon={<BsMedium />} component="a" href={links?.medium ?? "#"} target="_blank">
                Medium
              </TransparentButton>
              <TransparentButton leftIcon={<IoMdMail />} component="a" href={links?.mailto ?? "#"} target="_blank">
                E-Mail
              </TransparentButton>
            </Group>
          )}
          <HeaderLinks />
        </Flex>
      </ContentGrid>
    </HeaderBg>
  );
};

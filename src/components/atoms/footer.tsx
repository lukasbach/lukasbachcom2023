import React, { FC } from "react";
import { Box, Text, Flex, useMantineTheme, Title, Group, Avatar, Anchor, Stack, Divider } from "@mantine/core";
import { StaticImage } from "gatsby-plugin-image";
import { graphql, Link, useStaticQuery } from "gatsby";
import { ContentGrid } from "./content-grid";

const useFooterData = () =>
  useStaticQuery<Queries.FooterDataQuery>(graphql`
    query FooterData {
      site {
        jsxRuntime
        polyfill
        buildTime(formatString: "MMMM DD, YYYY")
        siteMetadata {
          footer {
            description
            title
            lists {
              text
              links {
                href
                text
                isExternal
              }
            }
          }
        }
      }
    }
  `).site;
export const Footer: FC = () => {
  const theme = useMantineTheme();
  const footer = useFooterData();
  return (
    <Box component="footer" bg={theme.colors.dark[6]} py={48} mt={128}>
      <ContentGrid>
        <Flex sx={{ alignItems: "flex-start" }}>
          <Group sx={{ flexGrow: 1 }}>
            <StaticImage
              src="../../images/profile.jpg"
              alt="Profile Image"
              style={{ borderRadius: 999, minWidth: 48, width: 48 }}
            />
            <div>
              <Text size="xl" ff="'Exo 2', sans-serif" color={theme.white}>
                {footer?.siteMetadata?.footer?.title}
              </Text>
              <Text>{footer?.siteMetadata?.footer?.description}</Text>
            </div>
          </Group>
          <Group sx={{ alignItems: "flex-start", textAlign: "right" }} spacing={64}>
            {footer?.siteMetadata?.footer?.lists?.map((list, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Box key={index}>
                <Title size="lg" order={4} ff="'Exo 2', sans-serif" color={theme.white}>
                  {list?.text}
                </Title>
                <Stack spacing={4} mt={12}>
                  {list?.links?.map(link =>
                    link?.isExternal ? (
                      <Anchor
                        target="_blank"
                        href={link.href ?? "#"}
                        key={link.href}
                        sx={{ color: theme.colors.gray[5] }}
                      >
                        {link.text}
                      </Anchor>
                    ) : (
                      <Anchor
                        component={Link}
                        to={link?.href ?? "#"}
                        key={link?.href}
                        sx={{ color: theme.colors.gray[5] }}
                      >
                        {link?.text}
                      </Anchor>
                    )
                  )}
                </Stack>
              </Box>
            ))}
          </Group>
        </Flex>
        <Divider my="lg" />
        <Flex>
          <Text sx={{ flexGrow: 1, color: theme.colors.gray[5] }} size="sm">
            © 2023 Lukas Bach. Contact me at{" "}
            <Anchor href="mailto:contact@lukasbach.com" sx={{ color: theme.colors.gray[3] }}>
              contact@lukasbach.com
            </Anchor>
          </Text>
          <Group>
            <Anchor component={Link} to="/impress" sx={{ color: theme.colors.gray[6] }} size="sm">
              Impress
            </Anchor>
            <Anchor component={Link} to="/privacy" sx={{ color: theme.colors.gray[6] }} size="sm">
              Privacy and Cookie Policy
            </Anchor>
          </Group>
        </Flex>
      </ContentGrid>
    </Box>
  );
};
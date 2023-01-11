import React, { FC, PropsWithChildren } from "react";
import { Box, Text } from "@mantine/core";
import { BoxProps } from "@mantine/core/lib/Box/Box";

export const StatCard: FC<
  PropsWithChildren<{
    title?: string;
    maxWidth?: string;
    icon?: JSX.Element;
    rightIcon?: JSX.Element;
    href?: string | null;
    filled?: boolean;
    isExternal?: boolean;
  }>
> = ({ title, children, maxWidth, icon, rightIcon, href, filled, isExternal }) =>
  children ? (
    <Box
      component={href ? "a" : "div"}
      href={href!}
      target={isExternal ?? true ? "_blank" : undefined}
      py={8}
      px={16}
      ml={-18}
      mr={filled ? -18 : 24}
      my={0}
      sx={theme =>
        ({
          display: "block",
          textDecoration: "none",
          cursor: "pointer",
          color: "unset",
          borderRadius: theme.radius.lg,
          border: "1px solid transparent",
          ":hover": { backgroundColor: theme.colors.dark[6], borderColor: theme.colors.dark[4] },
          ":focus": href
            ? {
                outline: `2px solid ${theme.white}`,
              }
            : null,
        } as any)
      }
    >
      <Box sx={{ display: "flex", alignItems: "center" }} component="dl" m={0}>
        {icon}
        <Box
          ml={icon ? 16 : 0}
          mr={rightIcon ? 16 : 0}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title && (
            <Text component="dt" size="xs">
              {title}
            </Text>
          )}
          <Text component="dl" m={0} color="white" size="lg" truncate sx={{ maxWidth }}>
            {children}
          </Text>
        </Box>
        {rightIcon}
      </Box>
    </Box>
  ) : null;

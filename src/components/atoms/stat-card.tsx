import React, { FC, PropsWithChildren } from "react";
import { Box, Text } from "@mantine/core";

export const StatCard: FC<PropsWithChildren<{ title: string }>> = ({ title, children }) =>
  children ? (
    <Box
      component="dl"
      sx={theme => ({
        cursor: "pointer",
        borderRadius: theme.radius.lg,
        border: "1px solid transparent",
        ":hover": { backgroundColor: theme.colors.dark[6], borderColor: theme.colors.dark[4] },
      })}
      py={8}
      px={16}
      ml={-18}
      mr={24}
    >
      <Text component="dt" size="xs">
        {title}
      </Text>
      <Text component="dl" m={0} color="white" size="lg" truncate sx={{ maxWidth: "220px" }}>
        {children}
      </Text>
    </Box>
  ) : null;

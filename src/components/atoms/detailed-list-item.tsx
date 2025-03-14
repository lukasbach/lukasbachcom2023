import { Box, BoxProps, Flex, Grid, Text, useMantineTheme } from "@mantine/core";
import { HiStar } from "react-icons/hi2";
import * as React from "react";

// TODO responsiveness

export function DetailedListItem<T = "a">({
  listCategory,
  title,
  description,
  meta,
  highlighted,
  titleRightAligned,
  ...props
}: {
  listCategory: string | undefined;
  title: string;
  description: string;
  meta: string;
  highlighted: boolean;
  titleRightAligned?: boolean;
} & import("@mantine/utils").PolymorphicComponentProps<T, BoxProps>) {
  const theme = useMantineTheme();
  return (
    <>
      {listCategory && <Box sx={{ borderTop: `1px solid ${theme.colors.dark[5]}` }} mt={16} mb={12} />}
      <Box
        {...props}
        sx={
          {
            textDecoration: "none",
            " > *": {
              borderRadius: theme.radius.md,
            },
            ":hover > *": { backgroundColor: theme.colors.dark[9] },
            ":focus > *": {
              outline: `2px solid ${theme.white}`,
            },
            ":focus": {
              outline: "none",
            },
          } as any
        }
      >
        <Grid gutter="sm" mb={8}>
          <Grid.Col md={2}>
            <Flex>
              <Text color={theme.white}>{listCategory}</Text>
              {highlighted && (
                <Box sx={{ flexGrow: 1, textAlign: "right", color: theme.white }}>
                  <HiStar />
                </Box>
              )}
            </Flex>
          </Grid.Col>
          <Grid.Col md={3}>
            <Text color={theme.white} align={titleRightAligned ? "right" : undefined}>
              {title}
            </Text>
          </Grid.Col>
          <Grid.Col md={5}>
            <Text color={theme.colors.dark[1]}>{description}</Text>
          </Grid.Col>
          <Grid.Col md={2} sx={{ textAlign: "right" }}>
            <Text color={theme.colors.dark[3]} sx={{ textTransform: "capitalize" }}>
              {meta}
            </Text>
          </Grid.Col>
        </Grid>
      </Box>
    </>
  );
}

import React, { FC } from "react";
import { Box, Grid, Text, Title } from "@mantine/core";
import { Link } from "gatsby";

export const BigListItem: FC<{
  title: string;
  text: string;
  right: JSX.Element;
  left: JSX.Element;
  to: string;
  target?: string;
}> = ({ title, text, left, right, to, target }) => (
  <Box
    component={Link}
    to={to}
    target={target}
    sx={theme => ({
      display: "block",
      fontSize: "14px",
      borderRadius: theme.radius.lg,
      color: theme.colors.gray[6],
      cursor: "pointer",
      textDecoration: "none",
      ":focus": {
        outline: `2px solid ${theme.white}`,
      },
      ":hover": {
        backgroundColor: theme.colors.dark[9],
      },
    })}
    mb={16}
    px={32}
    py={32}
  >
    <Grid>
      <Grid.Col md={2}>{left}</Grid.Col>
      <Grid.Col md={8}>
        <Title order={4} size={24} color="white" mt={-8} mb={8}>
          {title}
        </Title>
        <Text>{text}</Text>
      </Grid.Col>
      <Grid.Col md={2} sx={{ textAlign: "right" }}>
        {right}
      </Grid.Col>
    </Grid>
  </Box>
);

import React, { FC } from "react";
import { Box, Grid, Text, Title } from "@mantine/core";
import { Link } from "gatsby";

export const BigListItem: FC<{
  category: string;
  title: string;
  text: string;
  date: string;
  timeToRead: number;
  slug: string;
}> = ({ category, title, text, date, timeToRead, slug }) => (
  <Box
    component={Link}
    to={slug}
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
      <Grid.Col lg={2}>
        <Text>{category}</Text>
      </Grid.Col>
      <Grid.Col lg={8}>
        <Title order={4} size={24} color="white" mt={-8} mb={8}>
          {title}
        </Title>
        <Text>{text}</Text>
      </Grid.Col>
      <Grid.Col lg={2} sx={{ textAlign: "right" }}>
        <Text>{date}</Text>
        <Text>{timeToRead} minutes</Text>
      </Grid.Col>
    </Grid>
  </Box>
);

import React, { FC } from "react";
import { Group } from "@mantine/core";
import { Link } from "gatsby";
import { TransparentButton } from "./transparent-button";

export const HeaderLinks: FC = () => (
  <Group>
    <TransparentButton component={Link} to="/projects">
      Projects
    </TransparentButton>
    <TransparentButton component={Link} to="/blog">
      Blog
    </TransparentButton>
    <TransparentButton component="a" href="https://github.com/lukasbach" target="_blank">
      GitHub
    </TransparentButton>
  </Group>
);

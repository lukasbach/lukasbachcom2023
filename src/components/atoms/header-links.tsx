import React, { FC } from "react";
import { Group, Menu } from "@mantine/core";
import { Link } from "gatsby";
import { HiOutlineBars3 } from "react-icons/hi2";
import { TransparentButton } from "./transparent-button";
import { useContainerSize } from "../../util";

export const HeaderLinks: FC = () => {
  const size = useContainerSize();
  const small = ["xs", "sm"].includes(size);
  return small ? (
    <Menu position="bottom-end">
      <Menu.Target>
        <TransparentButton>
          <HiOutlineBars3 />
        </TransparentButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component={Link} to="/projects">
          Projects
        </Menu.Item>
        <Menu.Item component={Link} to="/blog">
          Blog
        </Menu.Item>
        <Menu.Item component="a" href="https://github.com/lukasbach" target="_blank">
          GitHub
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ) : (
    <Group sx={{ justifyContent: "flex-end" }}>
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
};

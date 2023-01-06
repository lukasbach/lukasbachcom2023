import React, { FC, PropsWithChildren } from "react";
import { Grid } from "@mantine/core";
import { GridProps } from "@mantine/core/lib/Grid/Grid";

// TODO use Container component
export const ContentGrid: FC<
  PropsWithChildren<{ left?: JSX.Element; right?: JSX.Element } & Omit<GridProps, "left" | "right">>
> = ({ children, left, right, ...props }) => (
  <Grid gutter={0} {...props}>
    {left && (
      <Grid.Col lg={2} offsetLg={2}>
        {left}
      </Grid.Col>
    )}
    <Grid.Col lg={left && right ? 4 : left || right ? 6 : 8} offsetLg={left ? 0 : 2}>
      {children}
    </Grid.Col>
    {right && <Grid.Col lg={2}>{right}</Grid.Col>}
  </Grid>
);

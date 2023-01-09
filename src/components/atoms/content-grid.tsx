import React, { FC, PropsWithChildren } from "react";
import { Container, Grid } from "@mantine/core";
import { GridProps } from "@mantine/core/lib/Grid/Grid";
import { useContainerSize } from "../../util";

// TODO use Container component
export const ContentGrid: FC<
  PropsWithChildren<{ right?: JSX.Element; wide?: boolean } & Omit<GridProps, "left" | "right">>
> = ({ children, right, wide, ...props }) => {
  const size = useContainerSize();
  return (
    <Container
      size={size}
      sizes={
        wide
          ? {
              xs: 900,
              sm: 900,
              md: 900,
              lg: 900,
              xl: 1300,
            }
          : undefined
      }
    >
      <Grid gutter={16} {...props}>
        <Grid.Col lg={right ? 9 : 12} sm={right ? 8 : 12}>
          {children}
        </Grid.Col>
        {right && (
          <Grid.Col lg={3} sm={4}>
            {right}
          </Grid.Col>
        )}
      </Grid>
    </Container>
  );
};

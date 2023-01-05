import { Button, ButtonProps } from "@mantine/core";
import React from "react";

export function TransparentButton<T = "button">({
  active,
  ...props
}: import("@mantine/utils").PolymorphicComponentProps<T, ButtonProps> & { active?: boolean }) {
  return (
    <Button
      styles={{
        root: {
          border: "1px solid white",
          backgroundColor: "transparent",
          color: "white",
          ":hover": {
            backgroundColor: "white",
            color: "black",
          },
          ...(active
            ? {
                backgroundColor: "white",
                color: "black",
              }
            : null),
        },
        icon: { "> svg": { width: 20, height: 20 } },
      }}
      {...(props as any)}
    />
  );
}

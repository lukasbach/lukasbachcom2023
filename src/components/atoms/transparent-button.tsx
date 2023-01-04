import { Button, ButtonProps } from "@mantine/core";
import React from "react";

export function TransparentButton<T = "button">(
  props: import("@mantine/utils").PolymorphicComponentProps<T, ButtonProps>
) {
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
        },
        icon: { "> svg": { width: 20, height: 20 } },
      }}
      {...(props as any)}
    />
  );
}

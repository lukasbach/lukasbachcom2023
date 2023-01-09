import { Button, ButtonProps } from "@mantine/core";
import React, { ForwardedRef, forwardRef } from "react";

function TransparentButtonInner<T = "button">(
  { active, ...props }: import("@mantine/utils").PolymorphicComponentProps<T, ButtonProps> & { active?: boolean },
  ref: ForwardedRef<T>
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
      ref={ref}
    />
  );
}

export const TransparentButton = forwardRef(TransparentButtonInner<any>) as typeof TransparentButtonInner;

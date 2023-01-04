import React, { FC, PropsWithChildren } from "react";
import { Box } from "@mantine/core";
import { StaticImage } from "gatsby-plugin-image";

export const HeaderBg: FC<PropsWithChildren<{ maxHeight: number; bgOpacity: number; gradientStart: number }>> = ({
  children,
  gradientStart,
  bgOpacity,
  maxHeight,
}) => {
  const gradientStartText = `${gradientStart * 100}%`;
  return (
    <Box sx={{ display: "grid" }}>
      <StaticImage
        src="../../images/pexels-dexter-fernandes-2646237.jpg"
        layout="fullWidth"
        alt=""
        style={
          {
            gridArea: "1/1",
            maxHeight,
            maskImage: `linear-gradient(180deg, black 0%, black ${gradientStartText}, transparent 100%)`,
            "-webkit-mask-image": `linear-gradient(180deg, black 0%, black ${gradientStartText}, transparent 100%)`,
            opacity: bgOpacity,
          } as any
        }
      />
      <div
        style={{
          // By using the same grid area for both, they are stacked on top of each other
          gridArea: "1/1",
          position: "relative",
          // This centers the other elements inside the hero component
          // placeItems: "center",
          // display: "grid",
        }}
      >
        {children}
      </div>
    </Box>
  );
};

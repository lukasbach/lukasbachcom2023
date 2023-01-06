import { MantineProvider } from "@mantine/core";
import React, { FC, PropsWithChildren } from "react";

export const LayoutProvider: FC<PropsWithChildren<{}>> = ({ children }) => (
  <MantineProvider
    withGlobalStyles
    withNormalizeCSS
    theme={{
      colorScheme: "dark",
      defaultRadius: "lg",
      primaryColor: "indigo",
      fontSizes: {
        xs: 12,
        sm: 14,
        md: 18,
        lg: 18,
        xl: 20,
      },
      colors: {
        brand: [
          "#EFF2F6",
          "#D1DBE6",
          "#B3C4D5",
          "#96ADC5",
          "#7896B5",
          "#5B7FA4",
          "#496683",
          "#364C63",
          "#243342",
          "#121921",
        ],
      },
      activeStyles: { transform: "scale(0.95)" },
      // fontFamily: "'Exo 2', sans-serif",
      headings: {
        fontFamily: "'Exo 2', sans-serif",
        fontWeight: "400",
        sizes: {
          h1: {
            fontSize: "60px",
          },
          h2: {
            fontSize: "50px",
          },
        },
      },
      components: {
        Button: {
          defaultProps: {
            radius: "lg",
            size: "md",
          },
        },
        grid: {
          styles: {},
        },
      },
      focusRingStyles: {
        styles: theme => ({
          outline: `2px solid ${theme.white}`,
          outlineOffset: "3px",
        }),
        inputStyles: theme => ({
          outline: `1px solid ${theme.white}`,
        }),
      },
    }}
  >
    {children}
  </MantineProvider>
);

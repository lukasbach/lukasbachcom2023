import { MantineSize, useMantineTheme } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

export const isNotNullish = <T>(value: T | null | undefined | false): value is T => !!value;
export const useContainerSize = () => {
  const theme = useMantineTheme();
  const { width } = useViewportSize();
  console.log(theme.breakpoints, width);
  return (Object.entries(theme.breakpoints)
    .reverse()
    .find(([, size]) => width >= size)?.[0] ?? "xs") as MantineSize;
};

export const getBlogTarget = (frontmatter?: null | Record<"medium" | "devto" | "slug", string | null | undefined>) => ({
  href: frontmatter?.medium || frontmatter?.devto || frontmatter?.slug || "#",
  target: frontmatter?.medium || frontmatter?.devto ? "_blank" : undefined,
});

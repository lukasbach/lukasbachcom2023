import { MantineSize, useMantineTheme } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

export const isNotNullish = <T>(value: T | null | undefined | false): value is T => !!value;
export const useContainerSize = () => {
  const theme = useMantineTheme();
  const { width } = useViewportSize();
  return (Object.entries(theme.breakpoints)
    .reverse()
    .find(([, size]) => width >= size)?.[0] ?? "xl") as MantineSize;
};

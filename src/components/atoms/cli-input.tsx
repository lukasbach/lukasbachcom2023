import React, { FC, useRef, useState } from "react";
import { ActionIcon, Group, Input, Menu, Title, Tooltip } from "@mantine/core";
import { HiChevronDown, HiOutlineSquare2Stack, RiTerminalLine } from "react-icons/all";
import { HiCheck } from "react-icons/hi2";
import { useClipboard } from "@mantine/hooks";
import { isNotNullish } from "../../util";

export const CliInput: FC<{
  npm?: string | null;
  cliexample?: string | null;
  npminstall?: string | null;
  category?: string | null;
}> = ({ npm, cliexample, npminstall, category }) => {
  const installGlobal = category === "cli";
  const yarnInstall = installGlobal ? "yarn global add" : "yarn add";
  const npmInstall = installGlobal ? "npm i -g" : "npm i";
  const options = [
    cliexample,
    installGlobal && npm && `npx ${npm.split(", ")[0]}`,
    npminstall && `${npmInstall} ${npminstall}`,
    npminstall && `${yarnInstall} ${npminstall}`,
    ...(npm
      ? npm.split(", ").reduce<string[]>((prev, cmd) => [...prev, `${npmInstall} ${cmd}`, `${yarnInstall} ${cmd}`], [])
      : []),
  ].filter(isNotNullish);
  const [selected, setSelected] = useState(options[0]);
  const { copy, copied } = useClipboard({ timeout: 1000 });
  const ref = useRef<HTMLInputElement>(null);
  const title = installGlobal || cliexample ? "Usage" : "Installation";

  if (options.length === 0) {
    return null;
  }

  return (
    <>
      <Title order={4}>{title}</Title>
      <Input
        mb={32}
        variant="filled"
        readOnly
        icon={<RiTerminalLine size={16} />}
        value={selected}
        styles={{
          rightSection: { width: "unset" },
        }}
        color={copied ? "green" : undefined}
        ref={ref}
        onClick={() => {
          ref.current?.select();
          copy(selected);
        }}
        rightSection={
          <Group spacing={2} mr={4}>
            <Tooltip label={copied ? "Copied" : "Copy to clipboard"} position="top-end" withArrow>
              <ActionIcon
                color={copied ? "teal" : "gray"}
                variant="default"
                onClick={() => {
                  ref.current?.select();
                  copy(selected);
                }}
              >
                {copied ? <HiCheck /> : <HiOutlineSquare2Stack />}
              </ActionIcon>
            </Tooltip>
            <Menu position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="default">
                  <HiChevronDown />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {options.map(cmd => (
                  <Menu.Item
                    aria-selected={cmd === selected}
                    color={cmd === selected ? "blue" : undefined}
                    key={cmd}
                    onClick={() => {
                      setSelected(cmd);
                      ref.current?.select();
                      copy(cmd);
                    }}
                    // icon={cmd === selected ? <HiChevronRight /> : undefined}
                  >
                    {cmd}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          </Group>
        }
      />
    </>
  );
};

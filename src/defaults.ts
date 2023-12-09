import type { ThemeSetting } from "./types";
// 内置主题色配置
const presetPrimaryColors: Record<string, string> = {
  red: "#F5222D",
  volcano: "#FA541C",
  orange: "#FA8C16",
  gold: "#FAAD14",
  yellow: "#FADB14",
  lime: "#A0D911",
  green: "#52C41A",
  cyan: "#13C2C2",
  blue: "#1677FF",
  geekblue: "#2F54EB",
  purple: "#722ED1",
  magenta: "#EB2F96",
  grey: "#bfbfbf",
};
// 内置主题配置
const presetThemeSettingLight: ThemeSetting = {
  name: "light",
  mode: "light",
  baseColor: "#ebebeb",
  isDefault: true,
  primaryColors: presetPrimaryColors,
  colors: {},
};
const presetThemeSettingDark: ThemeSetting = {
  name: "dark",
  mode: "dark",
  baseColor: "#141414",
  isDefault: false,
  primaryColors: presetPrimaryColors,
  colors: {},
};

export { presetThemeSettingLight, presetThemeSettingDark, presetPrimaryColors };

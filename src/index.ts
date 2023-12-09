import { parseCssColor } from "@unocss/rule-utils";
import { generate } from "@ant-design/colors";
import { deepMerge, isColor } from "./helpers";
import {
  presetThemeSettingLight,
  presetThemeSettingDark,
  presetPrimaryColors,
} from "./defaults";
import type { ThemeSetting, ThemeOptionItem } from "./types";
/**
 * 将主题配置转换为css变量
 * @param {object} primaryColors 主题色配置 融合presetPrimaryColors
 * @param {string} options.mode 主题模式 light|dark 默认 light
 * @param {string} options.baseColor 色板基色 默认 #ebebeb
 * @returns {object} cssVars css变量 [{name:object}]
 */
function generateThemeVars(
  primaryColors: Record<string, string | Record<string, string>>,
  options: { mode?: string; baseColor?: string } | undefined
): Record<string, Record<string, string>> {
  const { mode = "light", baseColor = "#ebebeb" } = options || {};
  const colors = Object.assign(
    {},
    presetPrimaryColors,
    primaryColors || {}
  ) as Record<string, string | Record<string, string>>;
  let cssVars: Record<string, any> = {};
  const paletteOps = {
    theme: mode === "dark" ? "dark" : ("default" as any),
    backgroundColor: baseColor,
  };
  cssVars.base = {
    [`--color-base`]: parseCssColor(baseColor)?.components?.join(" ") || "",
  };
  Object.entries(colors).forEach(([primaryName, primaryColor]) => {
    let themeVars: Record<string, string> = {};
    if (typeof primaryColor === "string") {
      // 生成主题色
      const palette = generate(primaryColor, paletteOps);
      palette.forEach((color: string, inx: number) => {
        const colorConfig: any = parseCssColor(color);
        themeVars[`--color-${primaryName}-${inx}`] =
          colorConfig.components.join(" ");
      });
      themeVars[`--color-${primaryName}`] = `var(--color-${primaryName}-4)`;
    } else if (typeof primaryColor === "object") {
      // 自定义主题色
      Object.entries(primaryColor).forEach(([colorName, colorValue]) => {
        const colorConfig: any = isColor(colorValue)
          ? parseCssColor(colorValue)
          : colorValue;
        let cssName = `--color-${primaryName}`;
        if (colorName != "DEFAULT") {
          cssName += `-${colorName}`;
        }
        themeVars[cssName] = colorConfig.components?.join(" ") || colorConfig;
      });
    }

    cssVars[primaryName] = themeVars;
  });
  return cssVars;
}
/**
 * 将主题css变量转换为unocss主题配置
 * @param {object} themeVars 主题css变量
 * @returns {object} unocss主题配置
 */
function parseThemeVars(themeVars: Record<string, Record<string, string>>) {
  let colors: Record<string, Record<string, string>> = {};
  Object.entries(themeVars).forEach(([primaryName, primaryVars]) => {
    let color: Record<string, string> = {};
    Object.keys(primaryVars).forEach((colorVarName, index) => {
      if (/-\d+$/.test(colorVarName)) {
        color[index] = `rgb(var(${colorVarName}))`;
      } else {
        color.DEFAULT = `rgb(var(${colorVarName}))`;
      }
    });
    colors[primaryName] = color;
  });
  return colors;
}
/**
 * 将主题css变量转换为css-style字符串
 * @param {object} themeVars 主题css变量
 * @returns {string} css-style字符串
 */
function parseThemeVarsToCss(
  themeVars: Record<string, Record<string, string>>
) {
  let css = ``;
  Object.entries(themeVars).forEach(([primaryName, primaryVars]) => {
    Object.entries(primaryVars).forEach(([colorVarName, colorVarValue]) => {
      css += `${colorVarName}: ${colorVarValue};\n`;
    });
  });
  return css;
}

function presetThemeVars(themeSettings?: ThemeSetting[]) {
  const themeOptions: ThemeOptionItem[] = [
    presetThemeSettingLight,
    presetThemeSettingDark,
  ];
  themeSettings?.forEach((themeSetting) => {
    const sameTheme =
      themeOptions.find((v) => v.name === themeSetting.name) || [];
    if (sameTheme) {
      deepMerge(sameTheme, themeSetting);
    } else {
      themeOptions.push(themeSetting);
    }
  });
  themeOptions.sort((a, b) => (a.isDefault ? -1 : 1));

  themeOptions.forEach((themeSetting) => {
    const { mode, baseColor } = themeSetting;
    const primaryColors = Object.assign(
      {},
      themeSetting.primaryColors,
      themeSetting.colors || {}
    );
    themeSetting.themeVars = generateThemeVars(primaryColors, {
      mode,
      baseColor,
    });
    themeSetting.themeColors = parseThemeVars(themeSetting.themeVars);
    themeSetting.themeCss = parseThemeVarsToCss(themeSetting.themeVars);
  });
  const defaultTheme = themeOptions[0];
  return {
    name: "unocss-preset-theme-vars",
    extendTheme(originalTheme: Record<string, any>) {
      Object.assign(originalTheme.colors, defaultTheme.themeColors);
      return originalTheme;
    },
    layers: {
      themeVars: 0,
      default: 1,
    },
    preflights: [
      {
        layer: "themeVars",
        getCSS() {
          let css = ``;
          themeOptions.forEach((themeSetting) => {
            css += `[data-theme="${themeSetting.name}"]{\n`;
            if (themeSetting.name === defaultTheme.name) {
              css = `:root,\n${css}`;
            }
            css += themeSetting.themeCss;
            css += `}\n`;
          });
          return css;
        },
      },
    ],
  };
}

export {
  presetThemeVars,
  generateThemeVars,
  parseThemeVarsToCss,
};

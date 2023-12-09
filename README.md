## unocss-preset-theme-vars - 配合[unocss](https://github.com/unocss/unocss)轻松实现主题化定制

* [NPM](https://www.npmjs.com/package/unocss-preset-theme-vars)
* [GITHUB](https://github.com/itmanyong/unocss-preset-theme-vars)

### 安装

```bash
# pnpm 推荐
pnpm add unocss-preset-theme-vars -D
# npm
npm i unocss-preset-theme-vars -D
# yarn
yarn add unocss-preset-theme-vars -D
```

### 使用

```js
import {
    defineConfig
} from "unocss";
import {
    presetThemeVars
} from "unocss-preset-theme-vars";

export default defineConfig({
    presets: [
        // 默认情况下会生成内置的两套(light|dark)主题配置
        presetThemeVars(),
    ],
});
```

### 配置项

* `presetThemeVars(themeSettings: ThemeSetting[]): UnocssPlugin`

```ts
interface ThemeSetting {
  name: string; // 主题名称
  mode: "dark" | "light"; // 主题模式
  baseColor?: string; // 主题模式基础色,可理解为基础背景色
  isDefault?: boolean; // 是否为默认主题
  primaryColors?: Record<string, any>; // 阶梯主题色配置
  colors?: Record<string, Record<string, any>>; // 自定义颜色配置
}
```

##### 释义

* `name` 主题名称，用以切换主题
* `mode` 主题明暗模式，`dark` | `light`，主要用以生成阶梯主题色
* `baseColor` 主题模式基础色，，主要用以生成阶梯主题色
* `isDefault` 是否为默认主题，用以生成默认主题配置，配置多个也只有第一个为默认主题
* `primaryColors` 阶梯主题色配置，用以生成阶梯主题色，会根据`mode`和`baseColor`由浅到深生成阶梯主题色
* `colors` 自定义颜色配置，与阶梯主题色不同，此配置不会进行改动，只会将其转换成 css 变量形式使其动态化

##### 阶梯主题色生成规则 - primaryColors

* `primaryColors` 会根据`mode`和`baseColor`由浅到深生成`0 ~ 9`阶梯主题色
* css 变量命名规则为 `--color-[primaryColorName]-[level]`
* 额外会生成一个 `--color-[primaryColorName]` 默认色，其等同于 `--color-[primaryColorName]-4`

##### 自定义颜色配置 - colors

* `colors` 会将其转换成 css 变量形式使其动态化
* css 变量命名规则为 `--color-[colorName]-[colorKey]`
* `colorKey` 支持特殊值 `DEFAULT`，其等同于 `--color-[colorName]` 默认色

### 说明|技巧

* 内置阶梯主题色配置

```ts
const presetPrimaryColors = {
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
```

* 内置两套主题配置

```ts
// 主题 light
const presetThemeSettingLight = {
  name: "light",
  mode: "light",
  baseColor: "#ebebeb",
  isDefault: true,
  primaryColors: presetPrimaryColors,
  colors: {},
};
// 主题 dark
const presetThemeSettingDark = {
  name: "dark",
  mode: "dark",
  baseColor: "#141414",
  isDefault: false,
  primaryColors: presetPrimaryColors,
  colors: {},
};
```

* 如何覆盖内置主题配置

```js
export default defineConfig({
    presets: [
        presetThemeVars([
            // 直接定义名称为内置主题的名称配置即可
            // 未覆盖的内置主题配置会保留
            {
                name: "light",
                baseColor: "#ffffff",
                isDefault: false,
                primaryColors: {
                    red: "#ff0000", // 覆盖主题 light 内置阶梯主题色 red 配置为 #ff0000
                },
            },
        ]),
    ],
});
```

* 如何切换主题

> 通过js设置生效范围内的 DOM 元素的 data-theme 属性值为主题名称name即可

```js
// 1.全局生效
document.documentElement.setAttribute("data-theme", "dark");
// 2.局部生效
document.querySelector(".container").setAttribute("data-theme", "light");
```

* 如何在配置中关联使用内置/配置生成的主题色

```ts
// 1.如内置阶梯主题色中 red，其 css 变量命名为 --color-red-[level]
// 2.想要在 colors 的配置中引用 red 的第六阶梯色：--color-red-5
// 3.可以通过如下方式引用
const presetThemeSetting = {
  colors: {
    // 通过 var(--color-red-5) 引用 red 的第六阶梯色
    red: {
      DEFAULT: "var(--color-red-5)",
      error: "var(--color-red)",
    },
  },
};
// 4.最终会生成css变量为
--color-red: var(--color-red-5);
--color-red-error: var(--color-red);
// 5.直接在colors配置中引用colors配置的变量也是同理，只需要注意先后顺序即可

```

## 高级 API

### `generateThemeVars` - 阶梯主题色板生成器

* TS 定义

```ts
// 类型
type Colors = Record<string, string>; // 颜色配置
interface Options {
  mode: "dark" | "light"; // 主题模式
  baseColor: string; // 主题模式基础色,可理解为基础背景色
}
// 签名
generateThemeVars(primaryColors:Colors,options: Options): Record<string, string|Record<string, string>>
// 示例
generateThemeVars({
    red: "#F5222D",
    volcano: "#FA541C",
    orange: "#FA8C16"
},{
    mode: "dark",
    baseColor: "#141414",
})

```

### `parseThemeVarsToCss` - 主题色板转换为 css 样式

* TS 定义

```ts
// 类型
type ThemeVars  = Record<string, string|Record<string, string>>; // 主题色板 => generateThemeVars 的返回值
// 签名
parseThemeVarsToCss(themeVars: ThemeVars): string
// 示例
parseThemeVarsToCss({base: {'--color-base': '235 235 235'}})

```

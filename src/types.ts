export type Keys<T> = T extends Record<string, any> ? keyof T : never;
export type Values<T> = T extends Record<string, any> ? T[keyof T] : never;

export interface ThemeSetting {
  name: string;
  mode: "dark" | "light";
  baseColor?: string;
  isDefault?: boolean;
  primaryColors?: Record<string, any>;
  colors?: Record<string, Record<string, any>>;
}

export type ThemeOptionItem = ThemeSetting & {
  themeVars?: Record<string, Record<string, string>>;
  themeColors?: Record<string, Record<string, string>>;
  themeCss?: string;
};

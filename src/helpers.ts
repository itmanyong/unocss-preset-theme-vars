
/**
 * 对象深度合并
 * @param {object} target 目标对象
 * @param {object} source 源对象
 * @returns {object} 合并后的对象
 */
function deepMerge(target: Record<string,any>, source: Record<string,any>): Record<string,any> {
  if (typeof target !== "object" || typeof source !== "object") return target;
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      if (sourceValue && typeof sourceValue === "object") {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], sourceValue);
      } else {
        Object.assign(target, { [key]: sourceValue });
      }
    }
  }
  return target;
}
/**
 * 判断是否是颜色值
 * @param {string} color 颜色值
 * @returns {boolean} 是否是颜色值
 */
function isColor(color: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(color);
}

export { deepMerge, isColor };

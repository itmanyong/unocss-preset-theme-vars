/** @type {import("prettier").Config} */
module.exports = {
  rangeStart: 0, // 执行格式化的内容起始位置
  rangeEnd: Infinity, // 执行格式化的内容结束位置
  tabWidth: 2, // 缩进字节数
  printWidth: 135, // 换行字符数
  semi: false, // 在语句末尾打印分号
  singleQuote: true, // 使用单引号而不是双引号
  jsxSingleQuote: true, // 在 JSX 中使用单引号而不是双引号
  bracketSpacing: true, // 括号两端空格
  bracketSameLine: true, // 起始标签的尾括号是否独占一行
  vueIndentScriptAndStyle: true, // Vue 文件脚本和样式标签是否缩进
  singleAttributePerLine: false, // 在 HTML、Vue 和 JSX 中每行强制执行单个属性
  endOfLine: 'crlf', // 换行符策略 lf|crlf|cr|auto
  proseWrap: 'always', // Markdown中文本换行策略 always|never|preserve
  arrowParens: 'avoid', // 箭头函数一个参数时括号策略 always|avoid
  trailingComma: 'none', // 多行时是否需要尾随逗号 none|es5|all
  quoteProps: 'as-needed', // 对象的属性引号规则 as-needed|consistent|preserve
  htmlWhitespaceSensitivity: 'css', // HTML 空白敏感度 css|strict|ignore
  embeddedLanguageFormatting: 'auto' // 是否格式化嵌入在文件中的引用代码 off|auto
}

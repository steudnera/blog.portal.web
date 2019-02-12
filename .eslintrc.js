/**
 * Eslint 配置
 * @author Philip
 */
module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // add your custom rules here
  rules: {
    "indent": ["error", 4],
    "generator-star-spacing": "off",
    "no-debugger": process.env.NODE_ENV === ' production' ? 'error' : 'off'
  },
  globals: {
    "$": true,
    "window": true
  }
}

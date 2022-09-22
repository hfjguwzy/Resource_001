module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

    //关闭官方格式
    "prettier/prettier": "off",
    // 关闭官方文件命名自动校验
    "vue/multi-word-component-names": "off",
    // 关闭定义未使用
    "no-unused-vars": "off",
    // 关闭组件注册未使用
    "vue/no-unused-components": "off",
  },
};

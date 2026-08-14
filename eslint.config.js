const html = require("eslint-plugin-html");
module.exports = [
  {
    plugins: {
      html
    },
    files: ["**/*.html"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    }
  }
];

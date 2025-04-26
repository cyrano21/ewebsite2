module.exports = {
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  rules: {
    "react/no-unknown-property": ["error", { 
      ignore: ["jsx"] 
    }],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off"
  },
  settings: {
    react: {
      version: "detect"
    }
  }
}
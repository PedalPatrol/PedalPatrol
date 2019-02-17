module.exports = {
    presets: [
      "module:metro-react-native-babel-preset",
      "@babel/preset-env",
      "@babel/preset-react"
    ],
    plugins: [
      [
        "babel-plugin-root-import",
        {
          "rootPathPrefix": "@"
        }
      ],
      "@babel/plugin-proposal-class-properties"
    ]
};
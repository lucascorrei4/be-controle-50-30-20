module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    "babel-plugin-transform-typescript-metadata",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : false }],
    ['module-resolver', {
      alias: {
        '@config': './src/config',
        '@controllers': './src/controllers',
        '@database': './src/database',
        '@exceptions': './src/exceptions',
        '@interfaces': './src/interfaces',
        '@jobs': './src/jobs',
        '@libs': './src/libs',
        "@middlewares": "./src/middlewares",
        "@models": "./src/models",
        "@reports": "./src/reports",
        "@repositories": "./src/repositories",
        "@routes": "./src/routes",
        "@services": "./src/services",
        "@schemas": "./src/schemas",
        "@utils": "./src/utils"
      }
    }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}

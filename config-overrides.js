const path = require("path");

module.exports = function override(config, env) {
  const wasmExtensionRegExp = /\.wasm$/;
  const workerExtensionRegExp = /\.worker\.js$/;

  config.resolve.extensions.push(".wasm");

  config.module.rules.forEach(rule => {
    (rule.oneOf || []).forEach(oneOf => {
      if (oneOf.loader && oneOf.loader.indexOf("file-loader") >= 0) {
        // Make file-loader ignore WASM files
        oneOf.exclude.push(wasmExtensionRegExp);
      }
    });
  });

  config.module.rules.push(
    /* Allow simple loading of WASM modules */
    {
      test: wasmExtensionRegExp,
      include: path.resolve(__dirname, "src"),
      use: [{ loader: require.resolve("wasm-loader"), options: {} }]
    },
    /* Add loader for worker code,
    allows modules to be bundled */
    {
      test: workerExtensionRegExp,
      include: path.resolve(__dirname, "src"),
      use: [
        {
          loader: require.resolve("worker-loader"),
          options: {
            fallback: false,
            inline: true
          }
        }
      ]
    }
  );

  return config;
};

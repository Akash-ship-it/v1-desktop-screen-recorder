const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add fallbacks for Node.js modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    path: false,
    os: false,
    crypto: false,
    stream: false,
    util: false,
    buffer: false,
    events: false,
    assert: false,
    constants: false,
    domain: false,
    punycode: false,
    querystring: false,
    string_decoder: false,
    sys: false,
    timers: false,
    tty: false,
    url: false,
    vm: false,
    zlib: false,
    http: false,
    https: false,
    net: false,
    tls: false,
    child_process: false,
    cluster: false,
    dgram: false,
    dns: false,
    module: false,
    process: false,
    readline: false,
    repl: false,
    string_decoder: false,
    v8: false,
    worker_threads: false
  };

  // Exclude electron from webpack bundle
  config.externals = config.externals || {};
  config.externals.electron = 'commonjs electron';

  // Add a plugin to provide process
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
    })
  );

  return config;
};

const withSourceMaps = require("@zeit/next-source-maps");

const config = {
  // target: "serverless",
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        // https://github.com/googleapis/google-auth-library-nodejs/issues/150#issuecomment-488780989
        ...config.node,
        fs: "empty",
        child_process: "empty",
        net: "empty",
        tls: "empty"
      };
    }
    config.plugins = [...config.plugins];

    return config;
  },
  env: {
    GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT
  }
};

module.exports = withSourceMaps(config);

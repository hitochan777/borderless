// next.config.js
module.exports = {
  target: "serverless",
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

    return config;
  }
};

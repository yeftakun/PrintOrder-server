module.exports = {
  devServer: {
    allowedHosts: 'all',
    client: {
      webSocketURL: {
        protocol: 'wss',
        port: 443,
      },
    },
  },
};

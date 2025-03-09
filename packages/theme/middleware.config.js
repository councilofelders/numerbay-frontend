module.exports = {
  integrations: {
    numerbay: {
      location: '@numerbay/numerbay-api/server',
      configuration: {
        api: {
          url: 'https://numerbay.ai/backend-api/v1/'
        },
        debug: true,
        verbosity: 'debug',
        logRequestPayloads: true,
        logResponsePayloads: true
      },
      extensions: () => []
    }
  }
};

import { AxiosInstance } from 'axios';

// Define the types needed for the implementation
type ApiConfig = {
  api: {
    url: string;
  };
};

type Context = {
  client: AxiosInstance;
  config: ApiConfig;
};

export type LogInGetNonceParams = {
  publicAddress: string;
};

export type LogInGetNonceResponse = {
  nonce: string;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function logInGetNonce(
  context: Context, 
  params: LogInGetNonceParams, 
  customQuery?: any
): Promise<LogInGetNonceResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL('login/nonce', context.config.api.url);

  const payload = {
    // eslint-disable-next-line camelcase
    public_address: params.publicAddress
  };

  try {
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, payload);

    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error getting nonce:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}


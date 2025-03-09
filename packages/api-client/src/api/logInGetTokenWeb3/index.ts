import { AxiosInstance } from 'axios';

// Define the types needed for the implementation
type ApiConfig = {
  api: {
    url: string;
  };
  auth: {
    onTokenChange: (token: string) => Promise<void>;
  };
};

type Context = {
  client: AxiosInstance;
  config: ApiConfig;
};

export type LogInGetTokenWeb3Params = {
  publicAddress: string;
  signature: string;
};

export type LogInGetTokenWeb3Response = {
  access_token: string;
  token_type: string;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function logInGetTokenWeb3(
  context: Context, 
  params: LogInGetTokenWeb3Params, 
  customQuery?: any
): Promise<LogInGetTokenWeb3Response> {
  // Create URL object containing full endpoint URL
  const url = new URL('login/access-token-web3', context.config.api.url);

  const payload = {
    // eslint-disable-next-line camelcase
    public_address: params.publicAddress,
    signature: params.signature
  };

  try {
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, payload);

    await context.config.auth.onTokenChange(data.access_token);
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error logging in with Web3:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}


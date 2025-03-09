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

export type LogInGetTokenParams = {
  username: string;
  password: string;
};

export type LogInGetTokenResponse = {
  access_token?: string;
  token_type?: string;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function logInGetToken(
  context: Context, 
  params: LogInGetTokenParams, 
  customQuery?: any
): Promise<LogInGetTokenResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL('login/access-token', context.config.api.url);

  // Add parameters passed from composable as post query (x-www-form-urlencoded)
  const postParams = new URLSearchParams();
  postParams.append('username', params.username);
  postParams.append('password', params.password);

  try {
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, postParams);

    if (data?.access_token) {
      await context.config.auth.onTokenChange(data.access_token);
    }

    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error logging in user:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}


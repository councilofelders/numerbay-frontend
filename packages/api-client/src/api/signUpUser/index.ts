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

export type SignUpUserParams = {
  username: string;
  password: string;
};

export type SignUpUserResponse = {
  access_token?: string;
  token_type?: string;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function signUpUser(
  context: Context, 
  params: SignUpUserParams, 
  customQuery?: any
): Promise<SignUpUserResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL('users/', context.config.api.url);

  const payload = {
    username: params.username,
    password: params.password
  };

  try {
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, payload);

    if (data?.access_token) {
      await context.config.auth.onTokenChange(data.access_token);
    }

    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error signing up user:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

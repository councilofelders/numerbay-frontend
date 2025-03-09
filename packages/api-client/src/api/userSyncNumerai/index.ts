import { AxiosInstance } from 'axios';
import { authHeaders } from '../utils';

// Define the types needed for the implementation
type ApiConfig = {
  api: {
    url: string;
  };
  auth: {
    onTokenRead: () => string | null;
  };
};

type Context = {
  client: AxiosInstance;
  config: ApiConfig;
};

export type UserSyncNumeraiParams = Record<string, unknown>;

export type UserSyncNumeraiResponse = {
  success: boolean;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function userSyncNumerai(
  context: Context, 
  params?: UserSyncNumeraiParams, 
  customQuery?: any
): Promise<UserSyncNumeraiResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL('users/sync-numerai', context.config.api.url);
  const token = context.config.auth.onTokenRead();

  try {
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, null, authHeaders(token));

    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error syncing Numerai account:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}


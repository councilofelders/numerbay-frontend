import { AxiosInstance } from 'axios';
import { authHeaders, safeTokenRead } from '../utils';

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

export type GetMeParams = Record<string, unknown>;

export type GetMeResponse = {
  id: number;
  username: string;
  email?: string;
  is_active: boolean;
  is_superuser: boolean;
  [key: string]: any;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/explicit-module-boundary-types
export default async function getMe(context, params, customQuery?: any) {
  // Create URL object containing full endpoint URL
  const url = new URL('users/me', context.config.api.url);
  const token = safeTokenRead(context);
  
  try {
    const { data } = await context.client.get(url.href, authHeaders(token));
    // Return data from the API
    return data;
  } catch (error) {
    // If the error is a 403 (Forbidden), return null to indicate unauthenticated state
    if (error.response && error.response.status === 403) {
      console.log('Authentication failed: Could not validate credentials');
      return null;
    }
    // For other errors, rethrow
    throw error;
  }
}


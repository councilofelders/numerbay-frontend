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

export type VotePollParams = {
  id: string | number;
  options: any[];
};

export type VotePollResponse = {
  success?: boolean;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function votePoll(
  context: Context, 
  params: VotePollParams, 
  customQuery?: any
): Promise<VotePollResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL(`polls/${params.id}`, context.config.api.url);
  const token = context.config.auth.onTokenRead();

  // Prepare payload
  const payload = params.options;

  try {
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, payload, authHeaders(token));
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error voting on poll:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}


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

export type UpdatePollParams = {
  id: string | number;
  description?: string;
  dateFinish?: string;
  isBlind?: boolean;
  options?: any[];
};

export type UpdatePollResponse = {
  id: number;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function updatePoll(
  context: Context, 
  params: UpdatePollParams, 
  customQuery?: any
): Promise<UpdatePollResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL(`polls/${params.id}`, context.config.api.url);
  const token = context.config.auth.onTokenRead();

  // Prepare payload
  const payload = {
    description: params.description,
    date_finish: params.dateFinish,
    is_blind: params.isBlind,
    options: params.options
  };

  try {
    // Use axios to send a PUT request
    const { data } = await context.client.put(url.href, payload, authHeaders(token));
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error updating poll:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}


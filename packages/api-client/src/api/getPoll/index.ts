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

export type GetPollParams = {
  id?: string | number;
  limit?: number;
  offset?: number;
  filters?: Record<string, any>;
  term?: string;
  sort?: any;
};

export type GetPollResponse = {
  data: any[];
  total: number;
};

// Keep the original function signature for backward compatibility
export default async function getPoll(
  context: Context, 
  params: GetPollParams, 
  customQuery?: any
): Promise<GetPollResponse> {
  // Create URL object containing full endpoint URL
  const token = context.config.auth.onTokenRead();

  const url = new URL(token ? 'polls/search-authenticated' : 'polls/search', context.config.api.url);

  const payload = {
    id: params.id,
    limit: params.limit,
    skip: params.offset,
    filters: params.filters,
    term: params.term,
    sort: params.sort
  };

  try {
    // Use axios to send a POST request
    const { data } = await context.client.post(url.href, payload, token ? authHeaders(token) : null);
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error fetching polls:', error);
    try {
      // Fallback to public endpoint if authenticated request fails
      const publicUrl = new URL('polls/search', context.config.api.url);
      const { data } = await context.client.post(publicUrl.href, payload);
      return data;
    } catch (fallbackError) {
      console.error('Error in fallback poll request:', fallbackError);
      if (fallbackError.response) {
        fallbackError.response.data.error = fallbackError.response.status;
        return fallbackError.response.data;
      }
      throw fallbackError;
    }
  }
}


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

export type GetStatsParams = Record<string, unknown>;

export type GetStatsResponse = {
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function getStats(
  context: Context, 
  params?: GetStatsParams, 
  customQuery?: any
): Promise<GetStatsResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL('stats/', context.config.api.url);

  try {
    // Use axios to send a GET request
    const { data } = await context.client.get(url.href);

    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

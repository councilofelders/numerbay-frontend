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

export type GetOrderArtifactParams = {
  orderId: string | number;
};

export type GetOrderArtifactResponse = {
  data: any[];
  total: number;
  [key: string]: any;
};

// Keep the original function signature for backward compatibility
export default async function getOrderArtifact(
  context: Context, 
  params: GetOrderArtifactParams, 
  customQuery?: any
): Promise<GetOrderArtifactResponse> {
  // Create URL object containing full endpoint URL
  const url = new URL('artifacts/', context.config.api.url);
  const token = context.config.auth.onTokenRead();

  // Add parameters passed from composable as query strings to the URL
  url.searchParams.set('order_id', params.orderId.toString());

  try {
    // Use axios to send a GET request
    const { data } = await context.client.get(url.href, authHeaders(token));
    
    // Return data from the API
    return data;
  } catch (error) {
    console.error('Error fetching order artifacts:', error);
    if (error.response) {
      error.response.data.error = error.response.status;
      return error.response.data;
    }
    throw error;
  }
}

